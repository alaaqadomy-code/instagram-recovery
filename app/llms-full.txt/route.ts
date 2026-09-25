import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const parts = [
    `# ${site.name} — النص الكامل للأدلّة`,
    `Source: ${absoluteUrl("/")}`,
    `Pages: ${articles.length}`,
    "",
  ];

  for (const article of articles) {
    parts.push("---");
    parts.push(`# ${article.title}`);
    parts.push(`URL: ${absoluteUrl(`/articles/${article.slug}`)}`);
    parts.push("");
    parts.push(article.description);
    parts.push("");
    for (const section of article.sections) {
      if (section.heading) {
        parts.push(`## ${section.heading}`);
        parts.push("");
      }
      for (const paragraph of section.paragraphs) {
        parts.push(paragraph);
        parts.push("");
      }
    }
    if (article.faqs.length) {
      parts.push("## أسئلة شائعة");
      parts.push("");
      for (const faq of article.faqs) {
        parts.push(`### ${faq.q}`);
        parts.push(faq.a);
        parts.push("");
      }
    }
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
