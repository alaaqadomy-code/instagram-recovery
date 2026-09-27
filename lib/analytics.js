const fs = require("fs");
const http = require("http");
const path = require("path");
const crypto = require("crypto");

const TZ_OFFSET_SEC = 3 * 3600;
const LIVE_SEC = 120;
const VID = "ua_vid";
const ADMIN_COOKIE = "ua_admin";
const SOURCE_ORDER = ["google", "direct", "social", "referral", "other"];
const SOURCE_LABEL = {
  google: "Google",
  direct: "Direct",
  social: "Social",
  referral: "Referral",
  other: "Other",
};
const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "l.facebook.com",
  "lm.facebook.com",
  "t.co",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "tiktok.com",
  "youtube.com",
  "youtu.be",
  "wa.me",
  "whatsapp.com",
  "web.whatsapp.com",
  "telegram.org",
  "t.me",
  "snapchat.com",
  "pinterest.com",
  "reddit.com",
  "threads.net",
];

const regionNames = new Intl.DisplayNames(["ar"], { type: "region" });
const loginFails = new Map();
let db;
let geoBusy = false;
const geoQueue = [];

function dbFile() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "analytics.sqlite");
}

function loadSqlite() {
  const load = eval("require");
  return load("node:sqlite");
}

function getDb() {
  if (db) return db;
  const { DatabaseSync } = loadSqlite();
  db = new DatabaseSync(dbFile());
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS hits (
      id INTEGER PRIMARY KEY,
      ts INTEGER NOT NULL,
      path TEXT NOT NULL,
      source TEXT NOT NULL,
      country TEXT NOT NULL,
      visitor TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS hits_ts ON hits(ts);
    CREATE TABLE IF NOT EXISTS bot_hits (
      id INTEGER PRIMARY KEY,
      ts INTEGER NOT NULL,
      path TEXT NOT NULL,
      bot TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS bot_hits_ts ON bot_hits(ts);
    CREATE TABLE IF NOT EXISTS presence (
      visitor TEXT PRIMARY KEY,
      last_seen INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS geo_cache (
      net TEXT PRIMARY KEY,
      country TEXT NOT NULL,
      updated INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      expires INTEGER NOT NULL
    );
  `);
  db.prepare("DELETE FROM hits WHERE path LIKE '/.%' OR path LIKE '%/.%' OR path = '/__dbg'").run();
  return db;
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function startOfToday() {
  const local = nowSec() + TZ_OFFSET_SEC;
  return Math.floor(local / 86400) * 86400 - TZ_OFFSET_SEC;
}

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";");
  for (const part of parts) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidates = [...forwarded, String(req.headers["x-real-ip"] || "").trim()];
  const socketIp = req.socket && req.socket.remoteAddress ? String(req.socket.remoteAddress) : "";
  if (socketIp) candidates.push(socketIp);
  for (const ip of candidates) {
    if (ip && ip !== "unknown") return ip.replace(/^::ffff:/, "");
  }
  return "";
}

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "0.0.0.0") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("169.254.")) return true;
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1]);
    if (second >= 16 && second <= 31) return true;
  }
  const lower = ip.toLowerCase();
  if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) return true;
  return false;
}

function networkKey(ip) {
  let prefix = ip;
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) prefix = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  } else if (ip.includes(":")) {
    prefix = ip.split(":").slice(0, 4).join(":");
  }
  const pepper = process.env.ADMIN_SECRET || "ua-analytics-v1";
  return crypto.createHash("sha256").update(`${pepper}:${prefix}`).digest("hex").slice(0, 32);
}

const CRAWLERS = [
  ["Googlebot", /googlebot/i],
  ["Google Inspection", /google-inspectiontool|googleother|storebot-google|adsbot-google|mediapartners-google|feedfetcher-google/i],
  ["Bingbot", /bingbot/i],
  ["DuckDuckBot", /duckduckbot/i],
  ["YandexBot", /yandex/i],
  ["Baiduspider", /baiduspider/i],
  ["Applebot", /applebot/i],
  ["GPTBot", /gptbot/i],
  ["ChatGPT-User", /chatgpt-user/i],
  ["ClaudeBot", /claudebot|claude-web|anthropic-ai/i],
  ["PerplexityBot", /perplexitybot/i],
  ["Amazonbot", /amazonbot/i],
  ["Bytespider", /bytespider/i],
  ["AhrefsBot", /ahrefs/i],
  ["SemrushBot", /semrush/i],
  ["DotBot", /dotbot/i],
  ["PetalBot", /petalbot/i],
  ["Facebook", /facebookexternalhit|facebot/i],
  ["Twitterbot", /twitterbot/i],
  ["LinkedInBot", /linkedinbot/i],
  ["Sogou", /sogou/i],
  ["Slurp", /slurp/i],
];

function crawlerName(ua) {
  const text = String(ua || "");
  if (!text || /headless|preview/i.test(text)) return "";
  for (const [name, pattern] of CRAWLERS) {
    if (pattern.test(text)) return name;
  }
  if (/bot|spider|crawler/i.test(text)) return "Other crawler";
  return "";
}

function shouldTrackBot(req, pathname) {
  if (!req || req.method !== "GET") return false;
  if (!pathname || !pathname.startsWith("/")) return false;
  if (pathname.startsWith("/.") || pathname.includes("/.")) return false;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/admin")) return false;
  if (pathname === "/favicon.ico" || pathname === "/icon.svg" || pathname === "/manifest.webmanifest") return false;
  const ext = path.extname(pathname);
  if (ext && ext !== ".html" && ext !== ".xml" && ext !== ".txt") return false;
  return true;
}

function shouldTrack(req, pathname) {
  if (!req || req.method !== "GET") return false;
  if (!pathname || !pathname.startsWith("/")) return false;
  if (pathname.startsWith("/.") || pathname.includes("/.")) return false;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/llms-full.txt" ||
    pathname === "/manifest.webmanifest"
  ) {
    return false;
  }
  const ext = path.extname(pathname);
  if (ext && ext !== ".html") return false;
  const purpose = String(req.headers["purpose"] || req.headers["sec-purpose"] || "");
  if (purpose.includes("prefetch") || req.headers["next-router-prefetch"]) return false;
  const ua = String(req.headers["user-agent"] || "");
  if (/bot|spider|crawler|slurp|bingbot|googlebot|facebookexternalhit|petalbot|ahrefs|semrush|dotbot|bytespider|gptbot|claudebot|perplexity|amazonbot|duckduck|yandex|baiduspider|sogou|applebot|headless|preview/i.test(ua)) {
    return false;
  }
  if (req.headers["rsc"]) return true;
  const dest = String(req.headers["sec-fetch-dest"] || "");
  if (dest && dest !== "document") return false;
  return true;
}

function classifySource(referer, host) {
  if (!referer) return "direct";
  let url;
  try {
    url = new URL(referer);
  } catch (_) {
    return "other";
  }
  const name = url.hostname.replace(/^www\./, "").toLowerCase();
  const self = String(host || "").replace(/^www\./, "").split(":")[0].toLowerCase();
  if (!name || name === self || name === "unlockaccounts.com" || name.endsWith(".unlockaccounts.com")) return "direct";
  if (name === "google.com" || name.startsWith("google.") || name.includes(".google.")) return "google";
  if (SOCIAL_HOSTS.some((hostName) => name === hostName || name.endsWith(`.${hostName}`))) return "social";
  return "referral";
}

function safePathname(raw) {
  try {
    const url = new URL(raw || "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname || "/");
    if (!pathname.startsWith("/") || pathname.startsWith("//") || pathname.includes("\\") || pathname.includes("\0")) {
      return "/";
    }
    if (pathname.length > 180) pathname = pathname.slice(0, 180);
    return pathname;
  } catch (_) {
    return "/";
  }
}

function cookieList(value) {
  if (value == null) return [];
  return (Array.isArray(value) ? value : [value]).map(String);
}

function rememberCookie(res, visitor, secure) {
  const cookie = `${VID}=${visitor}; Path=/; Max-Age=34560000; SameSite=Lax; HttpOnly${secure ? "; Secure" : ""}`;
  const append = res.appendHeader ? res.appendHeader.bind(res) : null;
  const set = res.setHeader.bind(res);
  res.setHeader = function (name, value) {
    if (String(name).toLowerCase() === "set-cookie") {
      const list = cookieList(value);
      for (const item of cookieList(res.getHeader("Set-Cookie"))) {
        const key = item.split("=")[0];
        if (!list.some((entry) => entry.startsWith(`${key}=`))) list.push(item);
      }
      if (!list.some((item) => item.startsWith(`${VID}=`))) list.push(cookie);
      return set("Set-Cookie", list);
    }
    return set(name, value);
  };
  if (append) append("Set-Cookie", cookie);
  else set("Set-Cookie", cookieList(res.getHeader("Set-Cookie")).concat(cookie));
}

function cachedCountry(ip) {
  if (isPrivateIp(ip)) return "LO";
  const row = getDb().prepare("SELECT country FROM geo_cache WHERE net = ?").get(networkKey(ip));
  return row && row.country ? row.country : "XX";
}

function lookupCountry(ip) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: "ip-api.com",
        path: `/json/${encodeURIComponent(ip)}?fields=status,countryCode`,
        timeout: 800,
        headers: { "User-Agent": "unlockaccounts-analytics" },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
          if (body.length > 300) res.destroy();
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            if (json.status === "success" && /^[A-Z]{2}$/.test(json.countryCode)) resolve(json.countryCode);
            else resolve("");
          } catch (_) {
            resolve("");
          }
        });
      },
    );
    req.on("timeout", () => {
      req.destroy();
      resolve("");
    });
    req.on("error", () => resolve(""));
  });
}

function drainGeo() {
  if (geoBusy || geoQueue.length === 0) return;
  const job = geoQueue.shift();
  geoBusy = true;
  lookupCountry(job.ip)
    .then((code) => {
      if (!code) return;
      const database = getDb();
      const ts = nowSec();
      database
        .prepare(
          "INSERT INTO geo_cache (net, country, updated) VALUES (?, ?, ?) ON CONFLICT(net) DO UPDATE SET country = excluded.country, updated = excluded.updated",
        )
        .run(networkKey(job.ip), code, ts);
      database
        .prepare("UPDATE hits SET country = ? WHERE visitor = ? AND ts = ? AND country = 'XX'")
        .run(code, job.visitor, job.ts);
    })
    .catch(() => {})
    .finally(() => {
      geoBusy = false;
      drainGeo();
    });
}

function enqueueGeo(ip, visitor, ts) {
  if (isPrivateIp(ip)) return;
  geoQueue.push({ ip, visitor, ts });
  if (geoQueue.length > 30) geoQueue.shift();
  drainGeo();
}

function track(req, res, rawUrl) {
  const pathname = safePathname(rawUrl || req.url || "/");
  const bot = crawlerName(req.headers["user-agent"]);
  if (bot) {
    if (shouldTrackBot(req, pathname)) {
      getDb().prepare("INSERT INTO bot_hits (ts, path, bot) VALUES (?, ?, ?)").run(nowSec(), pathname, bot);
    }
    return;
  }
  if (!shouldTrack(req, pathname)) return;
  const database = getDb();
  const ts = nowSec();
  let visitor = readCookie(req, VID);
  if (!/^[a-f0-9]{32}$/.test(visitor)) visitor = crypto.randomBytes(16).toString("hex");
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https");
  rememberCookie(res, visitor, secure);
  const ip = clientIp(req);
  const country = cachedCountry(ip);
  const source = classifySource(req.headers.referer || req.headers.referrer || "", req.headers.host);
  database.prepare("INSERT INTO hits (ts, path, source, country, visitor) VALUES (?, ?, ?, ?, ?)").run(ts, pathname, source, country, visitor);
  database.prepare("INSERT INTO presence (visitor, last_seen) VALUES (?, ?) ON CONFLICT(visitor) DO UPDATE SET last_seen = excluded.last_seen").run(visitor, ts);
  database.prepare("DELETE FROM presence WHERE last_seen < ?").run(ts - 600);
  if (country === "XX") enqueueGeo(ip, visitor, ts);
}

function countryName(code) {
  if (!code || code === "XX") return "غير معروف";
  if (code === "LO") return "شبكة محلية";
  try {
    return regionNames.of(code) || code;
  } catch (_) {
    return code;
  }
}

function withPercent(rows) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return rows.map((row) => ({
    label: row.label,
    count: row.count,
    percent: total ? Math.round((row.count / total) * 1000) / 10 : 0,
  }));
}

function countBots(from, googleOnly) {
  const sql = googleOnly
    ? "SELECT COUNT(*) AS n FROM bot_hits WHERE ts >= ? AND bot = 'Googlebot'"
    : "SELECT COUNT(*) AS n FROM bot_hits WHERE ts >= ?";
  const row = getDb().prepare(sql).get(from);
  return row ? row.n : 0;
}

function crawlerRows(from) {
  const rows = getDb().prepare("SELECT bot, COUNT(*) AS n FROM bot_hits WHERE ts >= ? GROUP BY bot").all(from);
  const counts = new Map(rows.map((row) => [row.bot, row.n]));
  if (!counts.has("Googlebot")) counts.set("Googlebot", 0);
  const list = [...counts.entries()].map(([label, count]) => ({ label, count }));
  list.sort((a, b) => {
    if (a.label === "Googlebot") return -1;
    if (b.label === "Googlebot") return 1;
    return b.count - a.count || a.label.localeCompare(b.label);
  });
  return withPercent(list);
}

function countDistinct(from) {
  const row = getDb().prepare("SELECT COUNT(DISTINCT visitor) AS n FROM hits WHERE ts >= ?").get(from);
  return row ? row.n : 0;
}

function seriesFor(range, from) {
  const points = [];
  if (range === "today") {
    for (let hour = 0; hour < 24; hour += 1) {
      points.push({ start: from + hour * 3600, label: String(hour).padStart(2, "0"), visits: 0 });
    }
  } else {
    const days = range === "30" ? 30 : 7;
    for (let i = 0; i < days; i += 1) {
      const start = from + i * 86400;
      const local = new Date((start + TZ_OFFSET_SEC) * 1000);
      points.push({
        start,
        label: `${local.getUTCDate()}/${local.getUTCMonth() + 1}`,
        visits: 0,
      });
    }
  }
  const rows = getDb().prepare("SELECT ts FROM hits WHERE ts >= ?").all(from);
  for (const row of rows) {
    const index = Math.floor((row.ts - from) / (range === "today" ? 3600 : 86400));
    if (points[index]) points[index].visits += 1;
  }
  return points.map(({ label, visits }) => ({ label, visits }));
}

function getDashboard(rangeInput) {
  const range = rangeInput === "today" || rangeInput === "30" ? rangeInput : "7";
  const today = startOfToday();
  const from = range === "today" ? today : today - (range === "30" ? 29 : 6) * 86400;
  const database = getDb();
  const totalRow = database.prepare("SELECT COUNT(*) AS n FROM hits").get();
  const liveRow = database.prepare("SELECT COUNT(*) AS n FROM presence WHERE last_seen >= ?").get(nowSec() - LIVE_SEC);
  const sourceRows = database.prepare("SELECT source, COUNT(*) AS n FROM hits WHERE ts >= ? GROUP BY source").all(from);
  const sourceMap = new Map(sourceRows.map((row) => [row.source, row.n]));
  const countryRows = database
    .prepare("SELECT country, COUNT(DISTINCT visitor) AS n FROM hits WHERE ts >= ? GROUP BY country ORDER BY n DESC")
    .all(from);
  const pageRows = database
    .prepare("SELECT path, COUNT(*) AS n FROM hits WHERE ts >= ? GROUP BY path ORDER BY n DESC LIMIT 20")
    .all(from);
  const visitRow = database.prepare("SELECT COUNT(*) AS n FROM hits WHERE ts >= ?").get(from);
  const visitTotal = visitRow ? visitRow.n : 0;

  return {
    visitorsToday: countDistinct(today),
    visitors7: countDistinct(today - 6 * 86400),
    visitors30: countDistinct(today - 29 * 86400),
    totalVisits: totalRow ? totalRow.n : 0,
    live: liveRow ? liveRow.n : 0,
    range,
    rangeVisits: visitTotal,
    series: seriesFor(range, from),
    sources: withPercent(SOURCE_ORDER.map((key) => ({ label: SOURCE_LABEL[key], count: sourceMap.get(key) || 0 }))),
    countries: withPercent(countryRows.map((row) => ({ label: countryName(row.country), count: row.n }))),
    pages: withPercent(pageRows.map((row) => ({ label: row.path, count: row.n }))),
    googlebotToday: countBots(today, true),
    googlebot7: countBots(today - 6 * 86400, true),
    googlebot30: countBots(today - 29 * 86400, true),
    googlebotTotal: countBots(0, true),
    crawlerTotal: countBots(0, false),
    crawlers: crawlerRows(from),
  };
}

function passwordOk(input) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (expected.length < 8) return false;
  const a = crypto.createHash("sha256").update(String(input), "utf8").digest();
  const b = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(a, b);
}

function failKey(ip) {
  const pepper = process.env.ADMIN_SECRET || "ua-analytics-v1";
  return crypto.createHash("sha256").update(`${pepper}:login:${ip || "unknown"}`).digest("hex").slice(0, 24);
}

function limited(ip) {
  const key = failKey(ip);
  const now = Date.now();
  const recent = (loginFails.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  loginFails.set(key, recent);
  return recent.length >= 8;
}

function markFail(ip) {
  const key = failKey(ip);
  const recent = loginFails.get(key) || [];
  recent.push(Date.now());
  loginFails.set(key, recent);
}

function createSession(password, ip) {
  if (limited(ip) || !passwordOk(password)) {
    markFail(ip);
    return "";
  }
  const database = getDb();
  const ts = nowSec();
  database.prepare("DELETE FROM sessions WHERE expires < ?").run(ts);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  database.prepare("INSERT INTO sessions (token_hash, expires) VALUES (?, ?)").run(tokenHash, ts + 7 * 86400);
  return token;
}

function readSession(token) {
  if (!/^[a-f0-9]{64}$/.test(token || "")) return false;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const row = getDb().prepare("SELECT expires FROM sessions WHERE token_hash = ?").get(tokenHash);
  return Boolean(row && row.expires >= nowSec());
}

function destroySession(token) {
  if (!/^[a-f0-9]{64}$/.test(token || "")) return;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}

module.exports = {
  ADMIN_COOKIE,
  track,
  getDashboard,
  createSession,
  readSession,
  destroySession,
};
