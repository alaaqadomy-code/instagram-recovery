import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const featured = [
  "istirja-hisab-instagram",
  "istirja-hisab-alinsta",
  "fath-hisabi-instagram",
  "rabit-istirja-hisab-instagram",
  "ikhtiraq-hisab-alinstagram",
  "istirja-hisab-alinstagram-almuattal",
  "istirja-bi-ism-almustakhdam-kw",
  "istirja-via-daam-fanni",
  "istirja-min-google-kw",
  "istirja-hisabi",
  "istirdad-hisab-alinsta",
  "istiada-hisab-alinstagram",
  "tam-ikhtiraq-hisabi-instagram",
  "tam-ilgha-tansheet-hisabi",
  "rabit-istirja-muattal",
  "surat-hisab-mubannad",
  "naseet-kalimat-sirr-lilinstagram",
  "istirja-alinsta-almuattal",
  "istirja-alinstagram-almahdhuf",
  "istirja-bi-raqm-alhatif",
  "istirja-mukhtaraq-kw",
  "istirja-muattal-nihaiyan",
  "markaz-almusaada-tam-taattil",
  "naseet-sirr-wa-email",
  "istirja-bi-ism-almustakhdam",
  "istirja-min-iphone",
  "istirja-min-android",
  "rabit-istirja-rasmi",
  "hisab-instagram-qadim",
  "istirja-majjanan",
  "taklifat-istirja-instagram",
  "nseet-ism-almustakhdam",
  "istirja-bil-barid",
  "la-yazhar-zar-istinaf",
  "taghyir-ism-wa-sura",
  "risalat-security-instagram",
  "baramij-istirja-instagram",
  "istirja-min-mutasaffih",
  "tarikh-almilad-instagram",
  "istirja-baad-30-yawm",
  "taattil-rasail-instagram",
  "hisab-yudakhilhu-shakhs",
  "namuthaj-murajaa-rasmi",
  "hisab-ihtirafi-muattal",
  "taattil-huquq-nashr",
  "taghyir-raqam-jawwal",
  "ihtial-istirja-instagram",
  "qufl-baad-safar",
  "hadhf-manshurat-instagram",
  "inha-jalasat-instagram",
  "istirja-hisab-instagram-muattal",
  "fak-band-instagram",
  "istirja-hisab-muallaq",
  "istirja-hisab-mahdhuf",
  "farq-muattal-mahdhuf",
  "asbab-taattil-instagram",
  "istirja-hisab-mukhtaraq",
  "nseet-kalimat-sirr",
  "istinaf-hisab-instagram",
  "khidma-mawthuqa",
];

function link(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return "";
  return `- [${article.title}](${absoluteUrl(`/articles/${article.slug}`)}): ${article.description}`;
}

export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.name} خدمة عربية مستقلة تساعد مالك حساب إنستغرام على فهم رسالة التعطيل أو الاختراق أو الحذف، ثم تقديم طلب مراجعة عبر نماذج ميتا الرسمية. لا نطلب كلمة المرور ولسنا تابعين لميتا. هذا الفهرس يوجّه أنظمة الذكاء إلى الصفحات الأساسية والمدونة.`,
    "",
    "## الصفحات الأساسية",
    "",
    `- [الرئيسية](${absoluteUrl("/")}): تشخيص الحالة والبدء عبر واتساب`,
    `- [خدمات الاسترجاع](${absoluteUrl("/services")}): أنواع الحالات التي نساعد فيها`,
    `- [الأسئلة الشائعة](${absoluteUrl("/faq")}): المدة والتكلفة وما لا نطلبه`,
    `- [المصطلحات](${absoluteUrl("/glossary")}): معنى التعطيل والباند والتعليق والحذف`,
    `- [من نحن](${absoluteUrl("/about")}): حدود الخدمة والمسارات الرسمية`,
    `- [تواصل معنا](${absoluteUrl("/contact")}): فحص الحالة عبر واتساب`,
    `- [المدونة](${absoluteUrl("/articles")}): كل شروحات الاسترجاع`,
    `- [النص الكامل للمدونة](${absoluteUrl("/llms-full.txt")}): محتوى المدونة في ملف واحد للأنظمة اللغوية`,
    "",
    "## من المدونة",
    "",
    ...featured.map(link).filter(Boolean),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
