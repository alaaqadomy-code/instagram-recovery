import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const featured = [
  "istirja-hisab-instagram-muattal",
  "fak-band-instagram",
  "istirja-hisab-muallaq",
  "istirja-hisab-mahdhuf",
  "farq-muattal-mahdhuf",
  "asbab-taattil-instagram",
  "istirja-hisab-mukhtaraq",
  "taghyir-email-instagram",
  "himayat-al-hisab-baad-alikhtiraq",
  "intihal-shakhsiya-instagram",
  "nseet-kalimat-sirr",
  "video-selfie-instagram",
  "ithbat-milkiya-instagram",
  "challenge-required-instagram",
  "istinaf-hisab-instagram",
  "rafd-istinaf-instagram",
  "hisab-tijari-muattal",
  "istirja-hisab-muwathaq",
  "fak-shadowban-instagram",
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
    `> ${site.name} خدمة عربية مستقلة تساعد مالك حساب إنستغرام على فهم رسالة التعطيل أو الاختراق أو الحذف، ثم تقديم طلب مراجعة عبر نماذج ميتا الرسمية. لا نطلب كلمة المرور ولسنا تابعين لميتا. هذا الفهرس يوجّه أنظمة الذكاء إلى الصفحات الأساسية والأدلّة.`,
    "",
    "## الصفحات الأساسية",
    "",
    `- [الرئيسية](${absoluteUrl("/")}): تشخيص الحالة والبدء عبر واتساب`,
    `- [خدمات الاسترجاع](${absoluteUrl("/services")}): أنواع الحالات التي نساعد فيها`,
    `- [الأسئلة الشائعة](${absoluteUrl("/faq")}): المدة والتكلفة وما لا نطلبه`,
    `- [المصطلحات](${absoluteUrl("/glossary")}): معنى التعطيل والباند والتعليق والحذف`,
    `- [من نحن](${absoluteUrl("/about")}): حدود الخدمة والمسارات الرسمية`,
    `- [تواصل معنا](${absoluteUrl("/contact")}): فحص الحالة عبر واتساب`,
    `- [فهرس الأدلّة](${absoluteUrl("/articles")}): كل شروحات الاسترجاع`,
    `- [النص الكامل للأدلّة](${absoluteUrl("/llms-full.txt")}): محتوى الأدلّة في ملف واحد للأنظمة اللغوية`,
    "",
    "## أدلّة مختارة",
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
