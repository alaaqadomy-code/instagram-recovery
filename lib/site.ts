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
  name: "Unlock Accounts",
  nameEn: "Unlock Accounts",
  tagline: "استرجاع حسابات إنستغرام المعطّلة والمسروقة والمحذوفة عبر المسارات الرسمية",
  description:
    "مكتب يقرأ رسالة حساب إنستغرام ويطابقها بنموذج ميتا الرسمي. الفحص من لقطة الشاشة، بلا كلمة مرور، وغير تابعين لميتا.",
  url: resolveSiteUrl(),
  locale: "ar_SA",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "962795827790",
  whatsappDisplay: "+962 79 582 7790",
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() || "",
  keywords: [
    "تشخيص حساب إنستغرام",
    "فحص لقطة حساب إنستغرام",
    "مساعدة ملفات إنستغرام",
    "متابعة طلب مراجعة إنستغرام",
  ],
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsapp}` as const;

export const whatsappMessage = `السلام عليكم،
أتواصل معكم من موقع Unlock Accounts بخصوص استرجاع حساب إنستغرام.
نوع الحالة: معطّل أو مخترق أو محذوف.
اسم المستخدم:
عدد المتابعين:
متى بدأت المشكلة:
سأرسل لقطة شاشة عن التعطيل.`;

export const whatsappChatUrl = `${whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`;
