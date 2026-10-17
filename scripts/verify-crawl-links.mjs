// node verify.mjs <base> <inspect.json> <sitemap-source: base> — يعيد منطق خريطة الربط: روابط من الصفحات الـ17 المفهرسة داخل <main>
import { readFileSync } from "node:fs";
const [BASE, IJ, CONC="4"] = process.argv.slice(2);
const I = JSON.parse(readFileSync(IJ, "utf8"));
const key = u => { try { const x = new URL(u); let p = decodeURIComponent(x.pathname).replace(/\/$/, ""); return p || "/"; } catch { return null } };
const idx = I.rows.filter(r => r.v === "PASS").map(r => key(r.u));
const sm = await (await fetch(BASE + "/sitemap.xml?v=" + Date.now())).text();
const all = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => key(m[1]));
console.log("sitemap urls", all.length, "inspect urls", I.rows.length);
const inIdx = Object.fromEntries(all.map(k => [k, 0])), inMain = Object.fromEntries(all.map(k => [k, 0]));
const host = new URL(BASE).host;
const sizes = {};
for (const k of idx) {
  const u = BASE + encodeURI(k) + (k.includes("?") ? "&" : "?") + "v=" + Date.now();
  const r = await fetch(u); const h = await r.text(); sizes[k] = [r.status, h.length];
  const main = (h.match(/<main[\s\S]*?<\/main>/i) || [h])[0];
  const ext = s => new Set([...s.matchAll(/href=["']([^"'#]+)["']/gi)].map(m => { try { const x = new URL(m[1].replace(/&amp;/g, "&"), u); if (x.host !== host && x.hostname.replace(/^www\./,"") !== "unlockaccounts.com") return null; return key(x.href) } catch { return null } }).filter(Boolean));
  const a = ext(h), m = ext(main);
  for (const t of a) { if (t === k || !(t in inIdx)) continue; inIdx[t]++; if (m.has(t)) inMain[t]++; }
}
const ni = all.filter(k => !idx.includes(k));
console.log("indexed fetched:", Object.values(sizes).map(x => x[0]).join(","));
console.log("nonIndexed", ni.length, "orphans(0 from indexed)", ni.filter(k => inIdx[k] === 0).length, "main<1", ni.filter(k => inMain[k] < 1).length, "main<2", ni.filter(k => inMain[k] < 2).length);
const hubs = ["/articles", "/services"]; for (const h of hubs) console.log(h, "inMain", inMain[h]);
console.log("gulf/services min inMain", Math.min(...all.filter(k => k.startsWith("/services/")).map(k => inMain[k])));
console.log("still <2:", ni.filter(k => inMain[k] < 2).slice(0, 20));
