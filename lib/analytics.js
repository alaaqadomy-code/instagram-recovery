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
    CREATE TABLE IF NOT EXISTS req_status (
      id INTEGER PRIMARY KEY,
      ts INTEGER NOT NULL,
      path TEXT NOT NULL,
      status INTEGER NOT NULL,
      ms INTEGER,
      html INTEGER NOT NULL DEFAULT 0,
      chain_hit INTEGER NOT NULL DEFAULT 0,
      loop_hit INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS req_status_ts ON req_status(ts);
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
  const botCols = db.prepare("PRAGMA table_info(bot_hits)").all();
  if (!botCols.some((col) => col.name === "status")) {
    db.exec("ALTER TABLE bot_hits ADD COLUMN status INTEGER");
  }
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

const ASSET_EXT = new Set([
  ".js",
  ".css",
  ".map",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp4",
  ".webm",
  ".webmanifest",
]);
const NAMED_BOTS = [
  "Googlebot",
  "Google Inspection",
  "Bingbot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
];
const recentRedirects = [];
let lastStatusPurge = 0;

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function headerValue(res, name) {
  if (!res || !res.getHeader) return "";
  const value = res.getHeader(name);
  if (Array.isArray(value)) return value.length ? String(value[0]) : "";
  return value == null ? "" : String(value);
}

function formatTs(ts) {
  if (!ts) return "";
  const local = new Date((num(ts) + TZ_OFFSET_SEC) * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())} ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`;
}

function sameSitePath(raw, host) {
  if (!raw) return "";
  let url;
  try {
    url = new URL(String(raw));
  } catch (_) {
    return "";
  }
  const name = url.hostname.replace(/^www\./, "").toLowerCase();
  const self = String(host || "").replace(/^www\./, "").split(":")[0].toLowerCase();
  if (name !== self && name !== "unlockaccounts.com" && !name.endsWith(".unlockaccounts.com")) return "";
  return safePathname(url.pathname);
}

function locationPath(raw, host) {
  const text = String(raw || "").trim();
  if (!text) return "";
  if (text.startsWith("/")) return safePathname(text);
  return sameSitePath(text, host);
}

function isNoise(req) {
  const purpose = String((req.headers && (req.headers.purpose || req.headers["sec-purpose"])) || "");
  if (purpose.includes("prefetch") || (req.headers && req.headers["next-router-prefetch"])) return true;
  if (req.headers && req.headers.rsc) return true;
  return false;
}

function classifyRedirect(path, locPath, referer, host, ts) {
  const cutoff = ts - 30;
  while (recentRedirects.length && recentRedirects[0].ts < cutoff) recentRedirects.shift();
  const refPath = sameSitePath(referer, host);
  let chain = 0;
  let loop = 0;
  if (locPath && locPath === path) loop = 1;
  if (refPath) {
    const prev = recentRedirects.find((row) => row.path === refPath && row.location === path);
    if (prev) {
      chain = 1;
      if (locPath && locPath === refPath) loop = 1;
    }
  }
  if (locPath) {
    recentRedirects.push({ path, location: locPath, ts });
    if (recentRedirects.length > 100) recentRedirects.shift();
  }
  return { chain, loop };
}

function maybePurgeStatus(database, ts) {
  if (ts - lastStatusPurge < 3600) return;
  lastStatusPurge = ts;
  database.prepare("DELETE FROM req_status WHERE ts < ?").run(ts - 40 * 86400);
}

function observeStatus(req, res, rawUrl) {
  if (!req || !res || !res.once) return;
  if (req.method !== "GET" && req.method !== "HEAD") return;
  const pathname = safePathname(rawUrl || req.url || "/");
  if (pathname.startsWith("/_next") || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
  if (isNoise(req)) return;
  const started = process.hrtime.bigint();
  res.once("finish", () => {
    try {
      const status = num(res.statusCode);
      const html = headerValue(res, "content-type").includes("text/html");
      const asset = ASSET_EXT.has(path.extname(pathname).toLowerCase());
      const redirect = status === 301 || status === 308;
      const serverError = status >= 500 && status < 600;
      if (asset && !redirect && !serverError) return;
      const missing = status === 404;
      const pageOk = status === 200 && html;
      if (!redirect && !missing && !serverError && !pageOk) return;
      const ts = nowSec();
      const ms = pageOk ? Math.max(0, Math.round(Number(process.hrtime.bigint() - started) / 1e6)) : null;
      let chain = 0;
      let loop = 0;
      if (redirect) {
        const flags = classifyRedirect(pathname, locationPath(headerValue(res, "location"), req.headers.host), req.headers.referer || req.headers.referrer || "", req.headers.host, ts);
        chain = flags.chain;
        loop = flags.loop;
      }
      const database = getDb();
      database
        .prepare("INSERT INTO req_status (ts, path, status, ms, html, chain_hit, loop_hit) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(ts, pathname, status, ms, pageOk ? 1 : html ? 1 : 0, chain, loop);
      maybePurgeStatus(database, ts);
    } catch (_) {}
  });
}

function track(req, res, rawUrl) {
  try {
    observeStatus(req, res, rawUrl);
  } catch (_) {}
  const pathname = safePathname(rawUrl || req.url || "/");
  const bot = crawlerName(req.headers["user-agent"]);
  if (bot) {
    if (shouldTrackBot(req, pathname)) {
      const info = getDb().prepare("INSERT INTO bot_hits (ts, path, bot) VALUES (?, ?, ?)").run(nowSec(), pathname, bot);
      const id = info && info.lastInsertRowid;
      if (res && res.once && id != null) {
        res.once("finish", () => {
          try {
            getDb().prepare("UPDATE bot_hits SET status = ? WHERE id = ?").run(num(res.statusCode), id);
          } catch (_) {}
        });
      }
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

function topPath(rows) {
  let bestPath = "";
  let bestCount = 0;
  for (const row of rows) {
    const count = num(row.n);
    if (count > bestCount || (count === bestCount && row.path < bestPath)) {
      bestPath = row.path;
      bestCount = count;
    }
  }
  return bestPath;
}

function crawlerDetails(from) {
  const database = getDb();
  const counts = database.prepare("SELECT bot, COUNT(*) AS n, MAX(ts) AS last_ts FROM bot_hits WHERE ts >= ? GROUP BY bot").all(from);
  const tops = database.prepare("SELECT bot, path, COUNT(*) AS n FROM bot_hits WHERE ts >= ? GROUP BY bot, path").all(from);
  const named = new Set(NAMED_BOTS);
  const byBot = new Map();
  let otherCount = 0;
  let otherLast = 0;
  for (const row of counts) {
    if (named.has(row.bot)) byBot.set(row.bot, row);
    else {
      otherCount += num(row.n);
      otherLast = Math.max(otherLast, num(row.last_ts));
    }
  }
  const paths = new Map();
  const otherPaths = new Map();
  for (const row of tops) {
    if (named.has(row.bot)) {
      const list = paths.get(row.bot) || [];
      list.push(row);
      paths.set(row.bot, list);
    } else {
      otherPaths.set(row.path, (otherPaths.get(row.path) || 0) + num(row.n));
    }
  }
  const list = NAMED_BOTS.map((label) => {
    const row = byBot.get(label);
    return {
      label,
      count: row ? num(row.n) : 0,
      lastVisit: row ? formatTs(row.last_ts) : "",
      topUrl: topPath(paths.get(label) || []),
    };
  });
  list.push({
    label: "Other Bots",
    count: otherCount,
    lastVisit: formatTs(otherLast),
    topUrl: topPath([...otherPaths.entries()].map(([path, n]) => ({ path, n }))),
  });
  return list;
}

function recentCrawls(from) {
  return getDb()
    .prepare("SELECT bot, path, status, ts FROM bot_hits WHERE ts >= ? ORDER BY id DESC LIMIT 10")
    .all(from)
    .map((row) => ({
      bot: row.bot,
      url: row.path,
      status: row.status == null ? null : num(row.status),
      time: formatTs(row.ts),
    }));
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))];
}

function statusReport(from) {
  const database = getDb();
  const rows = database.prepare("SELECT status, COUNT(*) AS n FROM req_status WHERE ts >= ? GROUP BY status").all(from);
  let ok = 0;
  let moved = 0;
  let permanent = 0;
  let notFound = 0;
  let serverError = 0;
  for (const row of rows) {
    const status = num(row.status);
    const count = num(row.n);
    if (status === 200) ok += count;
    else if (status === 301) moved += count;
    else if (status === 308) permanent += count;
    else if (status === 404) notFound += count;
    else if (status >= 500 && status < 600) serverError += count;
  }
  const flags = database
    .prepare("SELECT COALESCE(SUM(chain_hit), 0) AS chains, COALESCE(SUM(loop_hit), 0) AS loops FROM req_status WHERE ts >= ? AND status IN (301, 308)")
    .get(from);
  const missing = database
    .prepare("SELECT path, COUNT(*) AS n FROM req_status WHERE ts >= ? AND status = 404 GROUP BY path ORDER BY n DESC LIMIT 8")
    .all(from);
  const samples = database
    .prepare("SELECT ms FROM req_status WHERE ts >= ? AND status = 200 AND html = 1 AND ms IS NOT NULL ORDER BY ts DESC LIMIT 5000")
    .all(from)
    .map((row) => num(row.ms));
  const avgMs = samples.length ? Math.round(samples.reduce((sum, ms) => sum + ms, 0) / samples.length) : null;
  return {
    http: {
      ok,
      redirects: moved + permanent,
      notFound,
      serverError,
      notFoundUrls: withPercent(missing.map((row) => ({ label: row.path, count: num(row.n) }))),
    },
    redirects: {
      moved,
      permanent,
      chains: flags ? num(flags.chains) : 0,
      loops: flags ? num(flags.loops) : 0,
    },
    performance: {
      avgMs,
      p95Ms: percentile(samples, 95),
      samples: samples.length,
    },
  };
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

const ARAB_COUNTRIES = ["JO", "SA", "EG", "AE", "KW", "QA", "BH", "OM", "IQ", "YE", "SY", "LB", "PS", "MA", "DZ", "TN", "LY", "SD"];

function getAdminReport(rangeInput) {
  const report = getDashboard(rangeInput);
  const today = startOfToday();
  const days = report.range === "today" ? 1 : report.range === "30" ? 30 : 7;
  const from = report.range === "today" ? today : today - (days - 1) * 86400;
  const prevFrom = from - days * 86400;
  const database = getDb();
  const prevVisitsRow = database.prepare("SELECT COUNT(*) AS n FROM hits WHERE ts >= ? AND ts < ?").get(prevFrom, from);
  const prevVisitorsRow = database.prepare("SELECT COUNT(DISTINCT visitor) AS n FROM hits WHERE ts >= ? AND ts < ?").get(prevFrom, from);
  const articleHits = database
    .prepare(
      "SELECT path, COUNT(*) AS visits, COUNT(DISTINCT visitor) AS visitors FROM hits WHERE ts >= ? AND path LIKE '/articles/%' GROUP BY path ORDER BY visits DESC",
    )
    .all(from)
    .map((row) => ({ path: row.path, visits: num(row.visits), visitors: num(row.visitors) }));
  const arabList = ARAB_COUNTRIES.map((code) => `'${code}'`).join(",");
  const arabRow = database.prepare(`SELECT COUNT(DISTINCT visitor) AS n FROM hits WHERE ts >= ? AND country IN (${arabList})`).get(from);
  const jordanRow = database.prepare("SELECT COUNT(DISTINCT visitor) AS n FROM hits WHERE ts >= ? AND country = 'JO'").get(from);
  return {
    ...report,
    previousVisits: prevVisitsRow ? num(prevVisitsRow.n) : 0,
    previousVisitors: prevVisitorsRow ? num(prevVisitorsRow.n) : 0,
    articleHits,
    jordanVisitors: jordanRow ? num(jordanRow.n) : 0,
    arabVisitors: arabRow ? num(arabRow.n) : 0,
  };
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
  const status = statusReport(from);

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
    crawlers: crawlerDetails(from),
    crawlUrls: recentCrawls(from),
    http: status.http,
    redirects: status.redirects,
    performance: status.performance,
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
  getAdminReport,
  createSession,
  readSession,
  destroySession,
};
