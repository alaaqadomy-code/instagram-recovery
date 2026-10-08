import type { Article, ArticleSection } from "./articles/types";
import { titleToPublicSlug } from "./arabic-slug";
import { mergedSlugToFinal } from "./article-redirects";
import { rewriteAdditions } from "./articles/rewrite-additions";
import { rewriteSlugs } from "./rewrite-slugs";

const pairs = [...mergedSlugToFinal.entries()].sort((a, b) => b[0].length - a[0].length);

export function remapArticleLinks(text: string) {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(new RegExp(`/articles/${from}(?![a-z0-9-])`, "g"), `/articles/${to}`);
  }
  return out;
}

function remapPublicLinks(text: string, publicPairs: readonly (readonly [string, string])[]) {
  let out = remapArticleLinks(text);
  for (const [from, to] of publicPairs) {
    out = out.replace(new RegExp(`/articles/${from}(?![a-z0-9-])`, "g"), `/articles/${to}`);
  }
  return out;
}

function norm(value: string) {
  return value
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value: string) {
  return norm(value).split(" ").filter((word) => word.length > 2);
}

function overlap(left: string, right: string) {
  const rightWords = new Set(words(right));
  const leftWords = words(left);
  if (!leftWords.length || !rightWords.size) return 0;
  let hits = 0;
  for (const word of leftWords) if (rightWords.has(word)) hits += 1;
  return hits / leftWords.length;
}

function wordCount(sections: ArticleSection[]) {
  return sections
    .flatMap((section) => section.paragraphs)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function boilerplateSet(articles: Article[]) {
  const freq = new Map<string, number>();
  for (const article of articles) {
    const seen = new Set<string>();
    for (const section of article.sections) {
      for (const paragraph of section.paragraphs) {
        const key = norm(paragraph);
        if (key.length < 40 || seen.has(key)) continue;
        seen.add(key);
        freq.set(key, (freq.get(key) || 0) + 1);
      }
    }
  }
  return new Set([...freq.entries()].filter(([, count]) => count >= 3).map(([key]) => key));
}

function absorb(raw: Article[], boilerplate: Set<string>) {
  const bySlug = new Map(raw.map((article) => [article.slug, article]));
  const pool = new Map<string, string>();
  const extra = new Map<string, ArticleSection[]>();

  for (const [from, to] of mergedSlugToFinal) {
    const target = bySlug.get(to);
    const source = bySlug.get(from);
    if (!target || !source) throw new Error(`Missing merge body: ${from} -> ${to}`);
    if (!pool.has(to)) pool.set(to, target.sections.flatMap((section) => section.paragraphs).join("\n"));
    const targetWords = wordCount(target.sections);
    const limit = targetWords < 450 ? 0.5 : targetWords < 800 ? 0.36 : 0.28;
    const grouped = new Map<string, string[]>();

    for (const section of source.sections) {
      if (section.heading && /الانتظار|خطة عملية|الساعات الأولى/.test(section.heading)) continue;
      for (const paragraph of section.paragraphs) {
        const key = norm(paragraph);
        if (key.length < 80 || boilerplate.has(key) || /في Unlock Accounts/.test(paragraph)) continue;
        if (overlap(paragraph, pool.get(to) || "") >= limit) continue;
        const heading = section.heading || "تفاصيل إضافية للحالة نفسها";
        const list = grouped.get(heading) ?? [];
        list.push(remapArticleLinks(paragraph));
        grouped.set(heading, list);
        pool.set(to, `${pool.get(to)}\n${paragraph}`);
      }
    }

    if (!grouped.size) continue;
    const sections = extra.get(to) ?? [];
    for (const [heading, paragraphs] of grouped) {
      const existing = sections.find((section) => section.heading === heading);
      if (existing) existing.paragraphs.push(...paragraphs);
      else sections.push({ heading, paragraphs });
    }
    extra.set(to, sections);
  }

  return extra;
}

function fence(slug: string): ArticleSection | null {
  const lines: Record<string, string> = {
    "istirja-hisab-instagram":
      "هذا الدليل للحالة التي لم تتضح بعد: الشاشة لا تقول تعطيلاً ولا حظراً ولا حذفاً. إن ظهر نص التعطيل فانتقل إلى [استرجاع الحساب المعطل](/articles/istirja-hisab-instagram-muattal). الصفحة الرئيسية لمكتب التشخيص، و[صفحة الخدمات](/services) لطلب المساعدة.",
    "istirja-majjanan":
      "هذه الصفحة تشرح ماذا يشمل الفحص المجاني قبل أي اتفاق. خطوات فتح الحساب نفسه في [استرجاع حساب انستقرام](/articles/istirja-hisab-instagram)، وطلب التنفيذ في [الخدمات](/services).",
    "khidma-mawthuqa":
      "هذه الصفحة تعلّمك كيف تقارن أي جهة استرجاع، بما فيها Unlock Accounts. عرض أعمال المكتب نفسه في [الخدمات](/services).",
    "istirja-hisab-muallaq":
      "التعليق هنا إشعار بمهلة اعتراض، والحساب قد يبقى ظاهراً. إن منعتك الشاشة من الدخول ونصّت على انتهاك الشروط فهذا تعطيل، ومساره [الحساب المعطل](/articles/istirja-hisab-instagram-muattal).",
    "hisab-tijari-muattal":
      "هذه الصفحة لحساب تجاري أو احترافي: الإعلانات، مدير الأعمال، وإثبات النشاط. قالب الاستئناف العام في [استئناف الحساب](/articles/istinaf-hisab-instagram)، ومسار التعطيل الشخصي في [الحساب المعطل](/articles/istirja-hisab-instagram-muattal).",
    "istinaf-hisab-instagram":
      "صياغة طلب المراجعة تُكتب هنا. تشخيص التعطيل نفسه في [الحساب المعطل](/articles/istirja-hisab-instagram-muattal)، ولا تُنسخ هذه الصفحة كدليل ثانٍ لنفس الحالة.",
    "video-selfie-instagram":
      "هذه الصفحة لتصوير فيديو السيلفي عندما تطلبه الشاشة. متى يُطلب إثبات الهوية أصلاً مشروح في [إثبات الهوية](/articles/ithbat-alhuiya-instagram).",
    "challenge-required-instagram":
      "Challenge required نص خطأ بعينه أثناء التحقق. دليل القفل الاحترازي الأوسع في [الحساب المقفل](/articles/istirja-hisab-mughlaq).",
    "taklifat-istirja-instagram":
      "هذه الصفحة عن تكلفة المساعدة وما يُحسب قبل الدفع. ليست دليلاً لخطوات فتح الحساب؛ تلك في [استرجاع حساب انستقرام](/articles/istirja-hisab-instagram).",
    "baramij-istirja-instagram":
      "هذه الصفحة عن تطبيقات تعد بفتح الحساب وما الذي تثبّته وما الذي تتركه. المسار الرسمي للحالة غير الواضحة في [استرجاع حساب انستقرام](/articles/istirja-hisab-instagram).",
    "ihtial-istirja-instagram":
      "هذه الصفحة عن الاحتيال باسم الاسترجاع: من يطلب كلمة السر أو الرمز. ليست شرحاً لخطوات النموذج الرسمي.",
  };
  const text = lines[slug];
  if (!text) return null;
  return { heading: "حد هذه الصفحة", paragraphs: [text] };
}

/** Raw articles before merged slugs are unpublished.
 *  Dropping or double-spreading a source file changes the live site without a type error,
 *  so the build pins this count. Bump it only when an article is added or removed on purpose.
 *  The slug set check stops a duplicate from hiding a missing article at the same count.
 */
const EXPECTED_RAW_ARTICLES = 172;

export function publishArticles(raw: Article[]): Article[] {
  if (raw.length !== EXPECTED_RAW_ARTICLES) {
    throw new Error(`Expected ${EXPECTED_RAW_ARTICLES} articles before unpublishing merges, got ${raw.length}`);
  }
  const seenSlugs = new Set<string>();
  for (const article of raw) {
    if (seenSlugs.has(article.slug)) throw new Error(`Duplicate raw article slug: ${article.slug}`);
    seenSlugs.add(article.slug);
  }
  const boilerplate = boilerplateSet(raw);
  const absorbed = absorb(raw, boilerplate);
  const published = raw.filter((article) => !mergedSlugToFinal.has(article.slug));
  const publicPairs = published
    .map((article) => [article.slug, titleToPublicSlug(article.title)] as const)
    .sort((a, b) => b[0].length - a[0].length);

  return published.map((article) => {
    const rewrite = rewriteSlugs.has(article.slug);
    const sections = article.sections
      .map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs.map(remapArticleLinks),
      }))
      .filter((section) => {
        if (!rewrite || !section.heading || !/الانتظار|خطة عملية|الساعات الأولى/.test(section.heading)) return true;
        return section.paragraphs.some((paragraph) => !boilerplate.has(norm(paragraph)));
      });

    const absorbedSections = absorbed.get(article.slug) ?? [];
    const addition = rewrite ? (rewriteAdditions[article.slug] ?? []) : [];
    const boundary = rewrite ? fence(article.slug) : null;
    const nextSections = [...sections, ...absorbedSections, ...addition];
    if (boundary) nextSections.push(boundary);

    const keywords =
      article.slug === "istirja-hisab-instagram"
        ? article.keywords.filter((keyword) => !/معطل|معطّل/.test(keyword))
        : article.keywords;

    const sectionsWithPublicLinks = nextSections.map((section) => ({
      ...section,
      paragraphs: section.paragraphs.map((paragraph) => remapPublicLinks(paragraph, publicPairs)),
    }));
    const count = wordCount(sectionsWithPublicLinks);
    return {
      ...article,
      keywords,
      sections: sectionsWithPublicLinks,
      updated: rewrite ? (article.updated > "2026-09-27" ? article.updated : "2026-09-27") : article.updated,
      readMinutes: Math.max(1, Math.min(16, Math.round(count / 160) || 1)),
    };
  });
}
