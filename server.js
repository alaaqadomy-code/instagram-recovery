const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

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

function logMiss(req) {
  try {
    const headers = {};
    for (const key of Object.keys(req.headers)) {
      if (/cookie|envvars/i.test(key)) continue;
      const value = String(req.headers[key]);
      headers[key] = value.length > 180 ? value.slice(0, 180) : value;
    }
    const line = JSON.stringify({ url: req.url, headers }) + "\n";
    fs.appendFileSync(path.join(__dirname, "tmp", "seo-fix.log"), line);
  } catch (_) {}
}

function startSelectorOnce() {
  const flag = path.join(__dirname, "tmp", "run-cl-create");
  if (!fs.existsSync(flag)) return;
  try { fs.unlinkSync(flag); } catch (_) {}
  const { spawn } = require("child_process");
  const outPath = path.join(__dirname, "tmp", "cl-create.out");
  const out = fs.openSync(outPath, "w");
  const child = spawn(
    "/bin/bash",
    [
      "-lc",
        [
          "set +e",
          "echo HTACCESS",
          "cat /home/instagra/public_html/.htaccess",
          "echo GETAPP",
          "/usr/sbin/cloudlinux-selector get --json --interpreter nodejs --domain instagram-recover.com | python3 -c 'import json,sys; d=json.load(sys.stdin); d.pop(\"available_versions\", None); print(json.dumps(d)[:5000])'",
          "echo RESTART",
          "/usr/sbin/cloudlinux-selector restart --json --interpreter nodejs --domain instagram-recover.com --app-root irapp",
          "sleep 3",
          "echo APACHE",
          "curl -s -o /home/instagra/public_html/tmp/apache-body.html -w '%{http_code}' --max-time 15 -H 'Host: instagram-recover.com' http://127.0.0.1:81/",
          "echo",
          "python3 -c 'p=open(\"/home/instagra/public_html/tmp/apache-body.html\",encoding=\"utf-8\",errors=\"replace\").read(); print(\"H1\", \"<h1\" in p, \"FORBIDDEN\", \"Forbidden\" in p, \"LEN\", len(p))'",
        ].join("\n"),
    ],
    { detached: true, stdio: ["ignore", out, out] }
  );
  child.unref();
}

startSelectorOnce();

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
      return handle(req, res, parse(restored, true));
    }

    if (isErrorDoc(pathOnly)) {
      logMiss(req);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(bootstrapHtml());
      return;
    }

    handle(req, res, parse(raw, true));
  });

  if (typeof PhusionPassenger !== "undefined") {
    server.listen("passenger");
  } else {
    server.listen(port);
  }
});
