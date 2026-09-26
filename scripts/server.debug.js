const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

const logFile = path.join(__dirname, "tmp", "req-debug.log");
function log(line) {
  try {
    fs.appendFileSync(logFile, new Date().toISOString() + " " + line + "\n");
  } catch (_) {}
}

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const port = parseInt(process.env.PORT || "3000", 10);
const dir = __dirname;
log("boot cwd=" + process.cwd() + " dir=" + dir + " node=" + process.version);
const app = next({ dev: false, dir });
const handle = app.getRequestHandler();

function resolveUrl(req) {
  const raw = req.url || "/";
  if (raw.split("?")[0] !== "/403.shtml" && raw.split("?")[0] !== "/404.shtml") {
    return raw;
  }
  const h = req.headers;
  const candidates = [
    h["x-original-uri"],
    h["x-original-url"],
    h["x-rewrite-url"],
    h["x-forwarded-uri"],
    h["redirect_uri"],
    h["referer"],
  ].filter(Boolean);
  log("error-doc headers=" + JSON.stringify(h));
  for (const c of candidates) {
    try {
      if (String(c).startsWith("http")) {
        const u = new URL(String(c));
        if (u.pathname && u.pathname !== "/403.shtml") return u.pathname + u.search;
      } else if (String(c).startsWith("/") && !String(c).includes("403.shtml")) {
        return String(c);
      }
    } catch (_) {}
  }
  return "/";
}

app.prepare()
  .then(() => {
    log("prepare-ok");
    const server = createServer((req, res) => {
      const url = resolveUrl(req);
      log("req " + req.method + " raw=" + (req.url || "") + " -> " + url);
      req.url = url;
      handle(req, res, parse(url, true));
    });
    if (typeof PhusionPassenger !== "undefined") {
      server.listen("passenger");
      log("listen-passenger");
    } else {
      server.listen(port);
      log("listen-port-" + port);
    }
  })
  .catch((err) => {
    log("prepare-fail " + String((err && err.stack) || err));
    throw err;
  });
