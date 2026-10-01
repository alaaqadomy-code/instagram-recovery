import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const keyFile = readdirSync(path.join(root, "public")).find((name) => /^[a-f0-9]{32}\.txt$/.test(name));
if (!keyFile) {
  console.log("indexnow_key_missing");
  process.exit(1);
}
const key = readFileSync(path.join(root, "public", keyFile), "utf8").trim();
const host = "unlockaccounts.com";
const keyLocation = `https://${host}/${keyFile}`;
const live = await fetch(keyLocation);
const liveText = (await live.text()).trim();
if (live.status !== 200 || liveText !== key) {
  console.log("key_live_mismatch", live.status);
  process.exit(1);
}

const sitemap = await fetch(`https://${host}/sitemap.xml`);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});
console.log("sitemap_urls", urls.length);
console.log("indexnow_status", res.status);
if (!res.ok) console.log("indexnow_body", (await res.text()).slice(0, 300));
