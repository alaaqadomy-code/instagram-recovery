// يولّد lib/crawl-links.ts: توزيع موضوعي للمقالات غير المفهرسة على الصفحات المفهرسة
// node scripts/dump-articles-meta.cjs <root> <articles.json> ثم: node scripts/gen-crawl-links.mjs <articles.json> <inspect.json> <links.json> lib/crawl-links.ts
import { readFileSync, writeFileSync } from "node:fs";
const [AJ, IJ, LJ, OUT, EJ] = process.argv.slice(2); // EJ: روابط <main> الحالية لكل صفحة مفهرسة (existing.json)
const A = JSON.parse(readFileSync(AJ, "utf8"));
const I = JSON.parse(readFileSync(IJ, "utf8"));
const L = JSON.parse(readFileSync(LJ, "utf8"));
const E = EJ ? JSON.parse(readFileSync(EJ, "utf8")) : {};
const srcPath = s => s === "__home__" ? "/" : A.find(a => a.slug === s).path;
const already = (s, a) => (E[srcPath(s)] || []).includes(a.path);
const existingCount = a => Object.values(E).filter(l => l.includes(a.path)).length;
const key = u => (decodeURIComponent(new URL(u).pathname).replace(/\/$/, "") || "/");
const idx = new Set(I.rows.filter(r => r.v === "PASS").map(r => key(r.u)));
const byPath = new Map(A.map(a => [a.path, a]));
const sources = ["__home__", ...A.filter(a => idx.has(a.path)).map(a => a.slug)];
const srcArticle = s => A.find(a => a.slug === s);
const STOP = new Set(["انستقرام","انستغرام","انستا","instagram","حساب","حسابي","الحساب","استرجاع","كيف","طريقه","طريقة","عن","من","في","على","الى","إلى","او","أو","و","مع","بعد","بدون","بلا","هل","ما","لماذا","متى","كم","دليل","خطوه","2026","حل","مشكله","مشكلة","اسباب","أسباب","الحل","حلول","لا","تم"]);
const norm = w => w.replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[ًٌٍَُِّْـ]/g,"").replace(/^(وال|بال|كال|فال|لل|ال)/,"").toLowerCase();
const toks = a => { const t = new Set(); for (const w of `${a.title} ${a.keywords.join(" ")}`.split(/[\s\-—:،,؟?«»()\/]+/)) { if (!w) continue; const n = norm(w); if (n.length < 3 || STOP.has(w) || STOP.has(n)) continue; t.add(n); } return t; };
const T = new Map(A.map(a => [a.slug, toks(a)]));
const score = (src, a) => {
  if (src === "__home__") return 1; // الرئيسية عامة: أولوية منخفضة لكن سعة كبيرة
  const s = srcArticle(src); let sc = 0;
  for (const t of T.get(a.slug)) if (T.get(src).has(t)) sc += 2;
  if (s.category === a.category) sc += 3;
  return sc;
};
// المطلوب لكل مقال غير مفهرس: رابطان من صفحات مفهرسة داخل المحتوى (نحسب الموجود حالياً)
const targets = A.filter(a => !idx.has(a.path));
const need = new Map(targets.map(a => [a.slug, Math.max(1, 2 - (EJ ? existingCount(a) : Math.min(1, L.inIdxMain[a.path] || 0)))]));
// المطلوب = 2 ناقص الروابط الموجودة فعلاً (EJ)، وحد أدنى رابط جديد واحد لكل صفحة غير مفهرسة
const total = [...need.values()].reduce((x, y) => x + y, 0);
const HOME_CAP = 40;
const cap = new Map(sources.map(s => [s, s === "__home__" ? HOME_CAP : Math.ceil((total - HOME_CAP) / (sources.length - 1)) + 2]));
const out = new Map(sources.map(s => [s, []]));
// الأصعب أولاً: من له أقل تطابق موضوعي
const order = targets.filter(a => need.get(a.slug) > 0).map(a => ({ a, best: Math.max(...sources.map(s => score(s, a))) })).sort((x, y) => x.best - y.best);
for (const { a } of order) {
  let n = need.get(a.slug);
  const cands = sources.filter(s => s !== a.slug).map(s => ({ s, sc: score(s, a) - out.get(s).length / 50 })).sort((x, y) => y.sc - x.sc);
  for (const { s } of cands) {
    if (!n) break;
    if (out.get(s).length >= cap.get(s) || out.get(s).includes(a.slug) || already(s, a)) continue;
    out.get(s).push(a.slug); n--;
  }
  if (n) throw new Error("لا سعة لـ " + a.slug);
}
const obj = Object.fromEntries([...out].map(([s, l]) => [s, l]));
const ts = `/**
 * روابط الزحف التحريرية («أدلة أخرى تهمك») — درس 17 أكتوبر 2026: عزلة الزحف.
 * المصدر: الصفحات المفهرسة في Google (الرئيسية + ${sources.length - 1} مقالاً) وقت التوليد.
 * الهدف: كل صفحة غير مفهرسة يصلها رابطان على الأقل من صفحات مفهرسة داخل المحتوى.
 * مولَّد بـ scripts/gen-crawl-links.mjs — المفاتيح والقيم slugs داخلية للمقالات؛ "__home__" للرئيسية.
 * القاعدة: أي صفحة جديدة تُضاف هنا تحت صفحتين مفهرستين عند نشرها.
 */
export const crawlLinks: Record<string, readonly string[]> = ${JSON.stringify(obj, null, 2)};
`;
writeFileSync(OUT, ts);
console.log("sources", sources.length, "slots", total, "per source", [...out].map(([s, l]) => l.length).join(","));
const sizes = [...out].map(([s,l])=>l.length);
