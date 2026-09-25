import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { WhatsAppCta } from "@/components/Cta";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة عن استرجاع حساب إنستغرام",
  description:
    "إجابات واضحة عن المدة والتكلفة وكلمة السر والاختراق والحذف، بلا مبالغة وبلا ضمان كاذب.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <FaqJsonLd />
      <p className="text-sm font-bold text-[#1d4ed8]">الأسئلة الشائعة</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">كل ما تريد معرفته عن استرجاع الحساب</h1>
      <p className="mt-4 leading-8 text-slate-600">
        جمعنا الأسئلة المتكررة من أصحاب الحسابات المعطّلة والمسروقة والمحذوفة. المصدر الرسمي يبقى مركز مساعدة إنستغرام.
      </p>
      <div className="mt-8 space-y-3">
        {faqs.map((item) => (
          <details key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-bold">{item.q}</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <p className="font-extrabold">لم تجد إجابتك؟</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">اسأل مباشرة عبر واتساب دون إرسال كلمة السر.</p>
        <WhatsAppCta className="mt-4">تواصل عبر واتساب</WhatsAppCta>
      </div>
    </div>
  );
}
