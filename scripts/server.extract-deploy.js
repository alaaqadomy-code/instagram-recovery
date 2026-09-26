const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const next = require("next");

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const tarball = path.join(__dirname, "next-deploy.tgz");
const logFile = path.join(__dirname, "tmp", "extract-log.txt");
function log(msg) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, new Date().toISOString() + " " + msg + "\n");
  } catch (_) {}
}

if (fs.existsSync(tarball)) {
  try {
    log("extract start");
    execSync("tar -xzf next-deploy.tgz", {
      cwd: __dirname,
      stdio: "pipe",
      timeout: 300000,
    });
    fs.unlinkSync(tarball);
    log("extract ok, tarball removed");
  } catch (e) {
    log("extract FAIL: " + (e && e.message ? e.message : String(e)));
    try {
      fs.writeFileSync(
        path.join(__dirname, "tmp", "extract-error.txt"),
        String(e && e.stderr ? e.stderr.toString() : e)
      );
    } catch (_) {}
  }
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

function isErrorDoc(pathOnly) {
  return pathOnly === "/403.shtml" || pathOnly === "/404.shtml";
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

    if (isErrorDoc(pathOnly)) {
      const fromCookie = readCookie(req, COOKIE);
      if (fromCookie && fromCookie.startsWith("/") && !isErrorDoc(fromCookie.split("?")[0])) {
        res.setHeader("Set-Cookie", COOKIE + "=; Path=/; Max-Age=0; SameSite=Lax");
        req.url = fromCookie;
        return handle(req, res, parse(fromCookie, true));
      }

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
