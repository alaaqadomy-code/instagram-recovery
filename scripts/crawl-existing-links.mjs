// روابط <main> الحالية في كل صفحة مفهرسة على الموقع الحي (قبل التعديل)
import { readFileSync, writeFileSync } from "node:fs";
const [BASE, IJ, OUT] = process.argv.slice(2);
const I = JSON.parse(readFileSync(IJ, "utf8"));
const key = u => { const x = new URL(u); return decodeURIComponent(x.pathname).replace(/\/$/, "") || "/"; };
const idx = I.rows.filter(r => r.v === "PASS").map(r => key(r.u));
const res = {};
for (const k of idx) {
  const u = BASE + encodeURI(k) + "?v=" + Date.now();
  const h = await (await fetch(u)).text();
  const main = (h.match(/<main[\s\S]*?<\/main>/i) || [h])[0];
  res[k] = [...new Set([...main.matchAll(/href=["']([^"'#]+)["']/gi)].map(m => { try { return key(new URL(m[1], u).href) } catch { return null } }).filter(Boolean))];
  await new Promise(r => setTimeout(r, 800));
}
writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log(Object.values(res).map(v => v.length).join(","));
