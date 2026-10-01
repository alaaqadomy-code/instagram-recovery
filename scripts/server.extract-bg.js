const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const root = __dirname;
const tmp = path.join(root, "tmp");
const tarball = path.join(root, "next-deploy.tgz");
const logFile = path.join(tmp, "extract-log.txt");
const lock = path.join(tmp, "extract-running");

function log(msg) {
  try {
    fs.mkdirSync(tmp, { recursive: true });
    fs.appendFileSync(logFile, new Date().toISOString() + " " + msg + "\n");
  } catch (_) {}
}

function startExtract() {
  try {
    fs.mkdirSync(tmp, { recursive: true });
    if (!fs.existsSync(tarball)) {
      log("bg skip no tarball");
      return;
    }
    const fd = fs.openSync(lock, "wx");
    fs.closeSync(fd);
    log("bg extract spawn");
    const out = fs.openSync(logFile, "a");
    const child = spawn(
      "/bin/bash",
      [
        "-c",
        "pkill -x tar || true; sleep 1; if [ -d .next ]; then mv .next .next.bak.$$ || true; fi; tar -xzf next-deploy.tgz; status=$?; if [ $status -eq 0 ]; then rm -f next-deploy.tgz; rm -f tmp/extract-running; echo EXTRACT_DONE >> tmp/extract-log.txt; rm -rf .next.bak.* >/dev/null 2>&1 & fi; exit $status",
      ],
      { cwd: root, detached: true, stdio: ["ignore", out, out] }
    );
    child.unref();
    log("bg pid " + child.pid);
  } catch (e) {
    log("bg fail " + (e && e.message ? e.message : String(e)));
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    "<!doctype html><meta charset=utf-8><title>Unlock Accounts</title><p>جاري تحديث الموقع.</p>"
  );
});

if (typeof PhusionPassenger !== "undefined") {
  server.listen("passenger");
} else {
  server.listen(3000);
}

setImmediate(startExtract);
