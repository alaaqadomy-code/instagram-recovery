import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { steps } from "@/lib/content";
import { gulfPages } from "@/lib/gulf-pages";
import { servicePages } from "@/lib/service-pages";

export const metadata: Metadata = {
  title: { absolute: "خدمات استرجاع حسابات انستقرام — معطل، مبند، محذوف، مسروق، مغلق | Unlock Accounts" },
  description:
    "خدمات استرجاع حساب انستقرام لكل حالة: معطل، مبند أو محظور، محذوف، مسروق أو مخترق، مغلق، وبدون كود التحقق. فحص مجاني عبر واتساب، بلا كلمة مرور، والسعر حسب الحالة.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "خدمات استرجاع حسابات انستقرام",
    description: "خدمة متخصصة لكل حالة: معطل، مبند، محذوف، مسروق، مغلق، وبدون كود التحقق. فحص مجاني والسعر حسب الحالة.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <p className="text-xs font-bold tracking-widest text-[#9a3412]">خدمات الاسترجاع · فحص مجاني · السعر حسب الحالة</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">خدمات استرجاع حسابات انستقرام لكل حالة</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          لكل مشكلة مسار رسمي مختلف لدى ميتا، ولهذا قسمنا الخدمة إلى ست حالات. اختر الأقرب لما تراه على شاشتك، أو أرسل
          لقطة الشاشة عبر واتساب ونحدد الحالة لك مجاناً. لا نطلب كلمة المرور، ولا نضمن قرار المنصة، ونقول صراحة إن كانت
          الفرص ضعيفة.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((page) => (
            <article key={page.slug} className="flex flex-col rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <p className="text-xs font-bold text-[#9a3412]">{page.label}</p>
              <h2 className="mt-2 text-xl font-extrabold leading-8">
                <Link href={`/services/${page.slug}`} className="hover:text-[#9a3412]">
                  {page.h1}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#57534e]">{page.answer.text.slice(0, 180)}…</p>
              <ul className="mt-4 space-y-1 text-xs text-[#78716c]">
                {page.signals.slice(0, 2).map((s) => (
                  <li key={s}>▸ {s}</li>
                ))}
              </ul>
              <Link href={`/services/${page.slug}`} className="mt-5 text-sm font-bold text-[#9a3412] underline underline-offset-4">
                تفاصيل الخدمة والخطوات ←
              </Link>
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold">استرجاع حسابات انستقرام في دول الخليج</h2>
        <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">صفحات مخصصة لكل بلد: أنواع الحسابات الشائعة فيه، الجهات الرسمية للإبلاغ، وطريقة التواصل والدفع.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gulfPages.map((page) => (
            <Link key={page.slug} href={`/services/${page.slug}`} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5 font-bold hover:border-[#9a3412]">
              {page.h1}
            </Link>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold">كيف تسير الخدمة من أول رسالة حتى عودة الحساب؟</h2>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-[#fbf7f0] p-5">
              <p className="text-2xl font-extrabold text-[#9a3412]">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">السعر حسب الحالة</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              لا سعر موحداً لأن جهد حالة الحذف خلال المهلة يختلف عن حالة سرقة غُيّرت فيها كل البيانات. نفحص مجاناً، ثم نحدد
              السعر والمدة المتوقعة قبل أي دفع، ولا رسوم مفاجئة في منتصف الطريق. وإن كان الحل خطوتين داخل التطبيق نكتبها لك
              مجاناً دون خدمة.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">ما الذي لا نفعله؟</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              لا نخترق حسابات، ولا ندّعي واسطة داخل انستقرام أو ميتا، ولا نطلب كلمة المرور أو رمز التحقق، ولا نضمن قرار
              المنصة، ولا نقبل طلباً يخص حساب غيرك. نقدم خبرة بالمسار الرسمي وصياغة الطلب والمتابعة.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
          <p className="text-xl font-extrabold">افحص حالة حسابك مجاناً الآن</p>
          <p className="mt-3 leading-7 text-[#d6d3d1]">أرسل لقطة الشاشة واسم المستخدم، ونرد بنوع الحالة والفرص والخطوة العاجلة.</p>
          <WhatsAppCta className="mt-6">تواصل عبر واتساب</WhatsAppCta>
        </div>
      </div>
    </div>
  );
}
