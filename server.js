const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

let analytics = { track() {} };
try {
  analytics = require("./lib/analytics");
} catch (_) {}

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const COOKIE = "ir_orig_path";

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const part of parts) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i) === name) {
      try {
        return decodeURIComponent(part.slice(i + 1));
      } catch (_) {
        return part.slice(i + 1);
      }
    }
  }
  return null;
}

function decodePassengerEnv(header) {
  if (!header) return {};
  try {
    const text = Buffer.from(String(header), "base64").toString("utf8");
    const parts = text.split("\0");
    const out = {};
    for (let i = 0; i + 1 < parts.length; i += 2) {
      if (parts[i]) out[parts[i]] = parts[i + 1];
    }
    return out;
  } catch (_) {
    return {};
  }
}

function safePath(value) {
  if (!value) return null;
  let s = String(value).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const u = new URL(s);
      s = u.pathname + u.search;
    } catch (_) {
      return null;
    }
  }
  if (!s.startsWith("/") || s.startsWith("//") || s.includes("\\") || s.includes("\0")) return null;
  const pathOnly = s.split("?")[0];
  if (pathOnly === "/403.shtml" || pathOnly === "/404.shtml") return null;
  return s;
}

function isErrorDoc(pathOnly) {
  return pathOnly === "/403.shtml" || pathOnly === "/404.shtml";
}

function originalPath(req) {
  const env = decodePassengerEnv(req.headers["!~passenger-envvars"]);
  const fromEnv = [
    env.REDIRECT_SEO_ORIG,
    env.SEO_ORIG,
    env.REDIRECT_URL,
    env.REDIRECT_REQUEST_URI,
    env.REQUEST_URI,
  ]
    .map(safePath)
    .find(Boolean);
  if (fromEnv) return fromEnv;
  return safePath(readCookie(req, COOKIE));
}

function bootstrapHtml() {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>جاري التحميل…</title></head><body>
<script>
(function () {
  var path = location.pathname + location.search + location.hash;
  if (path === "/403.shtml" || path === "/404.shtml" || path.indexOf("/403.shtml") === 0) {
    path = "/";
  }
  document.cookie = "${COOKIE}=" + encodeURIComponent(path) + "; Path=/; Max-Age=60; SameSite=Lax";
  location.reload();
})();
</script>
<noscript><p>فعّل JavaScript ثم أعد تحميل الصفحة.</p><p><a href="/">الرئيسية</a></p></noscript>
</body></html>`;
}

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const raw = req.url || "/";
    const pathOnly = raw.split("?")[0];
    const restored = isErrorDoc(pathOnly) ? originalPath(req) : null;
    if (restored) {
      res.setHeader("Set-Cookie", COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax");
      req.url = restored;
      try {
        analytics.track(req, res, restored);
      } catch (_) {}
      return handle(req, res, parse(restored, true));
    }

    if (isErrorDoc(pathOnly)) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(bootstrapHtml());
      return;
    }

    try {
      analytics.track(req, res, raw);
    } catch (_) {}
    handle(req, res, parse(raw, true));
  });

  if (typeof PhusionPassenger !== "undefined") {
    server.listen("passenger");
  } else {
    server.listen(port);
  }
});
