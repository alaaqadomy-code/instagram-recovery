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

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 20000) {
        resolve("");
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", () => resolve(""));
  });
}

function originOf(req) {
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https");
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "unlockaccounts.com").split(",")[0].trim();
  return (secure ? "https" : "http") + "://" + host;
}

function readGate(req) {
  const header = req.headers["x-admin-password"];
  if (typeof header === "string" && header) return { kind: "login", password: header };
  const cookie = readCookie(req, "ua_gate");
  if (cookie === "logout") return { kind: "logout" };
  if (cookie && cookie.indexOf("p:") === 0) return { kind: "login", password: cookie.slice(2) };
  return null;
}

function refererPath(req) {
  try {
    return new URL(req.headers.referer || req.headers.referrer || "http://localhost/").pathname;
  } catch (_) {
    return "";
  }
}

function loginHtml(failed) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Dashboard</title></head>
<body style="margin:0;background:#f8fafc;color:#0f172a;font-family:Segoe UI,Tahoma,sans-serif">
<div style="max-width:28rem;margin:0 auto;min-height:100vh;display:flex;align-items:center;padding:1.25rem">
<form id="f" style="width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:1.5rem;padding:2rem;box-shadow:0 1px 2px rgba(15,23,42,.06)">
<p style="margin:0;font-size:.875rem;font-weight:600;color:#64748b">Unlock Accounts</p>
<h1 style="margin:.5rem 0 0;font-size:1.5rem">Dashboard</h1>
<label for="password" style="display:block;margin-top:1.5rem;font-size:.875rem;font-weight:600">Admin password</label>
<input id="password" type="password" autocomplete="current-password" required style="margin-top:.5rem;height:3rem;width:100%;border:1px solid #cbd5e1;border-radius:1rem;padding:0 1rem;font-size:1rem">
${failed ? '<p style="margin:.75rem 0 0;color:#b91c1c;font-size:.875rem;font-weight:600">كلمة المرور غير صحيحة.</p>' : ""}
<button type="submit" style="margin-top:1.25rem;height:3rem;width:100%;border:0;border-radius:1rem;background:#1d4ed8;color:#fff;font-weight:700">دخول</button>
</form></div>
<script>
document.getElementById("f").addEventListener("submit", function (e) {
  e.preventDefault();
  var password = document.getElementById("password").value;
  document.cookie = "ua_gate=" + encodeURIComponent("p:" + password) + "; Path=/; Max-Age=60; SameSite=Lax";
  location.href = "/admin/session";
});
</script>
</body></html>`;
}

function handleAdminSession(req, res, action) {
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https");
  const cookies = [
    COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax",
    "ua_gate=; Path=/; Max-Age=0; SameSite=Lax",
  ];
  function finish(location, token, maxAge) {
    cookies.push(
      (analytics.ADMIN_COOKIE || "ua_admin") +
        "=" +
        (token || "") +
        "; Path=/admin; Max-Age=" +
        maxAge +
        "; SameSite=Lax; HttpOnly" +
        (secure ? "; Secure" : ""),
    );
    res.statusCode = 303;
    res.setHeader("Set-Cookie", cookies);
    res.setHeader("Location", originOf(req) + location);
    res.setHeader("Cache-Control", "private, no-store");
    res.end();
  }
  if (!action || action.kind === "logout") {
    try {
      analytics.destroySession(readCookie(req, analytics.ADMIN_COOKIE || "ua_admin"));
    } catch (_) {}
    return finish("/admin/login", "", 0);
  }
  let token = "";
  try {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    token = analytics.createSession(action.password || "", ip) || "";
  } catch (_) {
    token = "";
  }
  if (!token) return finish("/admin/login?e=1", "", 0);
  return finish("/admin", token, 60 * 60 * 24 * 7);
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const raw = req.url || "/";
    const pathOnly = raw.split("?")[0];
    const restored = isErrorDoc(pathOnly) ? originalPath(req) : null;
    const target = restored || raw;
    const effective = target.split("?")[0];
    const search = target.indexOf("?") === -1 ? "" : target.slice(target.indexOf("?") + 1);

    if (effective === "/admin/login") {
      let authed = false;
      try {
        authed = analytics.readSession(readCookie(req, analytics.ADMIN_COOKIE || "ua_admin"));
      } catch (_) {}
      if (authed) {
        res.statusCode = 303;
        res.setHeader("Location", originOf(req) + "/admin");
        res.setHeader("Set-Cookie", COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax");
        res.setHeader("Cache-Control", "private, no-store");
        res.end();
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("Set-Cookie", COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax");
      res.end(loginHtml(search.indexOf("e=1") !== -1));
      return;
    }

    if (effective === "/admin/session" || effective === "/admin/logout") {
      const action = readGate(req);
      const intent = new URLSearchParams(search).get("intent");
      if (effective === "/admin/logout" || intent === "logout" || (action && action.kind === "logout")) {
        try {
          handleAdminSession(req, res, { kind: "logout" });
        } catch (_) {
          res.statusCode = 500;
          res.end();
        }
        return;
      }
      if (action && action.kind === "login") {
        try {
          handleAdminSession(req, res, action);
        } catch (_) {
          res.statusCode = 500;
          res.end();
        }
        return;
      }
      if (req.method === "POST") {
        readBody(req).then((body) => {
          try {
            const params = new URLSearchParams(body || "");
            if (params.get("intent") === "logout") handleAdminSession(req, res, { kind: "logout" });
            else handleAdminSession(req, res, { kind: "login", password: params.get("password") || "" });
          } catch (_) {
            res.statusCode = 500;
            res.end();
          }
        });
        return;
      }
      let authed = false;
      try {
        authed = analytics.readSession(readCookie(req, analytics.ADMIN_COOKIE || "ua_admin"));
      } catch (_) {}
      if (authed && refererPath(req) === "/admin") {
        try {
          handleAdminSession(req, res, { kind: "logout" });
        } catch (_) {
          res.statusCode = 500;
          res.end();
        }
        return;
      }
      res.statusCode = 303;
      res.setHeader("Location", originOf(req) + "/admin/login");
      res.setHeader("Set-Cookie", COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax");
      res.setHeader("Cache-Control", "private, no-store");
      res.end();
      return;
    }

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
