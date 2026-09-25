function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelHost = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL)
    ?.trim()
    .replace(/^https?:\/\//, "");
  if (vercelHost) return `https://${vercelHost}`;

  return "http://127.0.0.1:3000";
}

export const site = {
  name: "استرجاع انستا",
  nameEn: "Instarja",
  logoLetters: "RI",
  tagline: "استرجاع حسابات إنستغرام المعطّلة والمسروقة والمحذوفة عبر المسارات الرسمية",
  description:
    "خدمة عربية مستقلة تساعد مالك الحساب على استرجاع حساب إنستغرام المعطّل أو المخترق أو المحذوف. نفحص الحالة مجانًا، ونوجّهك لاستخدام نماذج ميتا وإنستغرام الرسمية، ونتابع معك من الجوال على أندرويد وآيفون. لا نطلب كلمة المرور ولسنا تابعين لميتا.",
  url: resolveSiteUrl(),
  locale: "ar_SA",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "962795827790",
  whatsappDisplay: "+962 79 582 7790",
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() || "",
  keywords: [
    "استرجاع حساب انستقرام معطل",
    "استرجاع حساب انستغرام",
    "فك باند انستقرام",
    "حساب انستقرام مخترق",
    "استرجاع حساب انستقرام محذوف",
    "استئناف انستقرام",
    "استرجاع انستقرام من الجوال",
  ],
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsapp}` as const;
