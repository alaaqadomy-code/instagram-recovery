import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/Cta";
import { services, steps } from "@/lib/content";

export const metadata: Metadata = {
  title: "خدمات استرجاع حسابات إنستغرام",
  description:
    "حزمة مساعدة تغطّي تعطيل الحساب، الباند، الاختراق، الحذف، مشاكل الدخول، والحسابات التجارية عبر المسارات الرسمية فقط.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold text-[#1d4ed8]">خدمات الاسترجاع</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">خدمات استرجاع واسترداد حسابات إنستغرام</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        نغطّي حالات فقدان الحساب من التعطيل إلى الاختراق وحسابات الأعمال. العمل عبر نماذج ميتا وإنستغرام فقط. لا اختراق
        ولا طلب لكلمة المرور.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{service.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
              {service.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-extrabold">كيف تسير الخدمة؟</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="text-sm font-extrabold text-[#1d4ed8]">0{index + 1}</p>
            <h3 className="mt-2 font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-extrabold">ما الذي لا نفعله؟</h2>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        لا نخترق حسابات، ولا ندّعي واسطة داخل إنستغرام، ولا نضمن قرار المنصة، ولا نقبل طلبًا يخص حساب غيرك. نقدّم خبرة
        بالمسار الرسمي وصياغة الطلب والمتابعة.
      </p>
      <div className="mt-10 rounded-3xl bg-[#0b1220] p-8 text-white">
        <p className="text-xl font-extrabold">افحص حالة حسابك مجانًا</p>
        <p className="mt-3 leading-7 text-slate-300">نحدّد النوع والفرص والتقدير قبل أي التزام.</p>
        <WhatsAppCta className="mt-6">تواصل عبر واتساب</WhatsAppCta>
      </div>
    </div>
  );
}
