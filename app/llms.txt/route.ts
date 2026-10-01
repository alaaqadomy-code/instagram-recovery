import { clusterSupport } from "@/lib/article-clusters";
import { articlePublicSlug, articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const featured = Object.keys(clusterSupport);

function link(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return "";
  return `- [${article.title}](${absoluteUrl(`/articles/${articlePublicSlug(article)}`)}): ${article.description}`;
}

export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.name} خدمة عربية مستقلة تساعد مالك حساب إنستغرام على فهم رسالة الشاشة، ثم تقديم طلب مراجعة عبر نماذج ميتا الرسمية. لا نطلب كلمة المرور ولسنا تابعين لميتا. هذا الفهرس يوجّه أنظمة الذكاء إلى الصفحات الأساسية والمدونة.`,
    "",
    "## الصفحات الأساسية",
    "",
    `- [الرئيسية](${absoluteUrl("/")}): تشخيص الحالة والبدء عبر واتساب`,
    `- [خدمات الاسترجاع](${absoluteUrl("/services")}): أنواع الحالات التي نساعد فيها`,
    `- [الأسئلة الشائعة](${absoluteUrl("/faq")}): المدة والتكلفة وما لا نطلبه`,
    `- [المصطلحات](${absoluteUrl("/glossary")}): معنى التعطيل والباند والتعليق والحذف`,
    `- [من نحن](${absoluteUrl("/about")}): حدود الخدمة والمسارات الرسمية`,
    `- [تواصل معنا](${absoluteUrl("/contact")}): فحص الحالة عبر واتساب`,
    `- [المدونة](${absoluteUrl("/articles")}): شروحات الحالات`,
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
