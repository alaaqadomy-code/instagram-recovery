// روابط <main> الحالية في كل صفحة مفهرسة، دون قائمة «أدلة أخرى تهمك» المولَّدة (ul[data-crawl-list]).
// BASE إما الموقع الحي (https://...) وإما مجلد البناء المحلي (out).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const [BASE, IJ, OUT] = process.argv.slice(2);
const I = JSON.parse(readFileSync(IJ, "utf8"));
const key = u => { const x = new URL(u); return decodeURIComponent(x.pathname).replace(/\/$/, "") || "/"; };
const idx = I.rows.filter(r => r.v === "PASS").map(r => key(r.u));
const local = !/^https?:/.test(BASE);
const res = {};
for (const k of idx) {
  const u = "https://unlockaccounts.com" + encodeURI(k);
  let h;
  if (local) { const f = path.join(BASE, k === "/" ? "index.html" : k + ".html"); h = existsSync(f) ? readFileSync(f, "utf8") : ""; }
  else { h = await (await fetch(BASE + encodeURI(k) + "?v=" + Date.now())).text(); await new Promise(r => setTimeout(r, 800)); }
  const main = (h.match(/<main[\s\S]*?<\/main>/i) || [h])[0].replace(/<ul[^>]*data-crawl-list[\s\S]*?<\/ul>/gi, "");
  res[k] = [...new Set([...main.matchAll(/href=["']([^"'#]+)["']/gi)].map(m => { try { return key(new URL(m[1], u).href) } catch { return null } }).filter(Boolean))];
}
writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log(Object.values(res).map(v => v.length).join(","));
