const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });
  if (typeof PhusionPassenger !== "undefined") {
    server.listen("passenger");
  } else {
    server.listen(port);
  }
});
