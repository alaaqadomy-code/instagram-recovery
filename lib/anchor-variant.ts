// نص الرابط يتنوّع بثبات حسب الصفحة المصدر، فلا يتكرر عنوان واحد على كل روابط الهدف (بصمة تحسين مفرط).
const uniq = (options: readonly (string | undefined)[]) => [...new Set(options.map((s) => s?.trim()).filter((s): s is string => Boolean(s)))];
const hash = (key: string) => {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
};

export function pickAnchor(key: string, options: readonly (string | undefined)[]): string {
  const list = uniq(options);
  return list[hash(key) % list.length];
}

/** تدوير منتظم: ترتيب المصدر بين كل مصادر الهدف يحدد الصيغة، فتتوزع الصيغ بالتساوي على روابط الهدف. */
export function rotateAnchor(target: string, source: string, sources: readonly string[], options: readonly (string | undefined)[]): string {
  const list = uniq(options);
  const i = sources.indexOf(source);
  if (i < 0) return list[hash(source + target) % list.length];
  return list[(i + hash(target)) % list.length];
}

/** صيغ مقال: العنوان ثم حتى أربع كلمات مفتاحية (بلا اسم العلامة). */
export function articleAnchors(a: { title: string; keywords: readonly string[] }): string[] {
  return [a.title, ...a.keywords.filter((k) => !/unlock/i.test(k) && k.split(/\s+/).length >= 2).slice(0, 5)];
}

/** صيغ صفحة خدمة أو بلد: العنوان الظاهر، والكلمة المستهدفة، وصيغ قصيرة. */
export function serviceAnchors(p: { h1: string; keyword: string; label: string }, country = false): string[] {
  return country
    ? [p.h1, p.keyword, `حسابات انستقرام في ${p.label}`, p.label, `خدمتنا في ${p.label}`]
    : [p.h1, p.keyword, p.label, `خدمة ${p.label}`];
}
