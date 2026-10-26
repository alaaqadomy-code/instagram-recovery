import { site, whatsappUrl } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: site.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
        description: site.description,
        ...(site.email ? { email: site.email } : {}),
        telephone: `+${site.whatsapp}`,
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "IQ"],
        inLanguage: "ar",
        sameAs: [whatsappUrl],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: `+${site.whatsapp}`,
          availableLanguage: ["ar"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: site.name,
        url: absoluteUrl("/"),
        inLanguage: "ar",
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
