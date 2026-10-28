// جرد الفقرات المكررة حرفياً أو شبه حرفياً (>=90%) بين المقالات الخام.
// الاستعمال: node scripts/audit-duplicate-paragraphs.cjs <root> [planner-b] > تقرير
const path = require("path");
const root = process.argv[2] || process.cwd();
const onlyFile = process.argv[3] || "";
const jiti = require(path.join(root, "node_modules/jiti"))(root + "/", { alias: { "@": root } });
const A = jiti("./lib/articles.ts");
const files = {
  "planner-a": jiti("./lib/articles/planner-a.ts").plannerArticlesA,
  "planner-b": jiti("./lib/articles/planner-b.ts").plannerArticlesB,
  "planner-c": jiti("./lib/articles/planner-c.ts").plannerArticlesC,
  "planner-d": jiti("./lib/articles/planner-d.ts").plannerArticlesD,
};
const fileOf = new Map();
for (const [f, arr] of Object.entries(files)) for (const a of arr) fileOf.set(a.slug, f);
const norm = (v) => v.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, " ").trim();
const paras = [];
for (const a of A.rawArticles) {
  a.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => {
    const k = norm(p);
    if (k.length < 60) return;
    paras.push({ slug: a.slug, file: fileOf.get(a.slug) || "other", si, heading: s.heading || "(مقدمة)", pi, key: k, words: k.split(" "), text: p });
  }));
}
// فهرس بالكلمات الثلاثية للتسريع
function shingles(ws) { const s = new Set(); for (let i = 0; i + 2 < ws.length; i++) s.add(ws[i] + " " + ws[i + 1] + " " + ws[i + 2]); return s; }
for (const p of paras) p.sh = shingles(p.words);
const groups = new Map(); // key -> list
for (const p of paras) { const l = groups.get(p.key) || []; l.push(p); groups.set(p.key, l); }
const exact = [...groups.values()].filter((l) => new Set(l.map((x) => x.slug)).size >= 2);
const near = [];
const seenPair = new Set();
for (let i = 0; i < paras.length; i++) {
  const a = paras[i];
  if (onlyFile && a.file !== onlyFile) continue;
  for (let j = 0; j < paras.length; j++) {
    if (i === j) continue;
    const b = paras[j];
    if (a.slug === b.slug || a.key === b.key) continue;
    if (Math.abs(a.words.length - b.words.length) / Math.max(a.words.length, b.words.length) > 0.15) continue;
    let inter = 0; for (const s of a.sh) if (b.sh.has(s)) inter++;
    const sim = inter / Math.max(1, Math.min(a.sh.size, b.sh.size));
    if (sim >= 0.9) { const id = [a.slug + "#" + a.si + "." + a.pi, b.slug + "#" + b.si + "." + b.pi].sort().join("|"); if (!seenPair.has(id)) { seenPair.add(id); near.push({ a, b, sim }); } }
  }
}
const out = [];
out.push(`# فقرات مكررة حرفياً (${exact.length} مجموعة)`);
for (const l of exact.sort((x, y) => y.length - x.length)) {
  if (onlyFile && !l.some((p) => p.file === onlyFile)) continue;
  out.push(`\n## ${l.length} مرات — «${l[0].text.slice(0, 90)}…»`);
  for (const p of l) out.push(`- ${p.file}/${p.slug} §${p.si} «${p.heading}» ف${p.pi} (${p.words.length} كلمة)`);
}
out.push(`\n# فقرات شبه حرفية ≥90% (${near.length} زوج)`);
for (const { a, b, sim } of near) out.push(`- ${(sim * 100).toFixed(0)}% ${a.file}/${a.slug} §${a.si} «${a.heading}» ف${a.pi} ↔ ${b.file}/${b.slug} §${b.si} «${b.heading}» ف${b.pi}`);
// عدد الكلمات لكل مقال planner-b (خام ومنشور)
if (onlyFile) {
  out.push(`\n# كلمات مقالات ${onlyFile} (خام → منشور)`);
  const pub = new Map(A.articles.map((a) => [a.slug, a]));
  const wc = (a) => a.sections.flatMap((s) => s.paragraphs).join(" ").split(/\s+/).filter(Boolean).length;
  for (const a of files[onlyFile]) { const p = pub.get(a.slug); out.push(`- ${a.slug}: ${wc(a)} → ${p ? wc(p) + " /articles/" + A.articlePublicSlug(p) : "غير منشور (مدموج)"}`); }
}
console.log(out.join("\n"));
