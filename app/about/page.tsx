import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/Cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: `${site.name} فريق عربي يساعد أصحاب الحسابات على استرداد إنستغرام عبر المسارات الرسمية، بفحص صريح وبدون طلب كلمة المرور.`,
  alternates: { canonical: "/about" },
};

const values = [
  { title: "التشخيص أولًا", text: "لا نتحرّك قبل معرفة نوع الحالة، لأن المسار الخاطئ يضيع الفرصة." },
  { title: "مسارات رسمية", text: "نماذج إنستغرام وميتا فقط. لا اختراق ولا التفاف على الحماية." },
  { title: "السرّية", text: "تفاصيل كل ملف تبقى بيننا وبين صاحب الحساب." },
  { title: "الصراحة", text: "نقول تقدير الفرص حتى لو كان ذلك ضد بيع الخدمة." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold text-[#1d4ed8]">من نحن</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">{site.name} — نعيد ترتيب ملف حسابك</h1>
      <p className="mt-4 leading-8 text-slate-600">
        فريق يتعامل يوميًا مع حالات يظن أصحابها أنها انتهت: تعطيل، اختراق، حذف، أو ضياع وسائل الدخول. نعمل عن بُعد
        بالعربية لأصحاب الحسابات في الخليج والمشرق والمغرب، ومن الجوال على أندرويد وآيفون.
      </p>
      <h2 className="mt-10 text-2xl font-extrabold">كيف بدأت الفكرة</h2>
      <p className="mt-3 leading-8 text-slate-600">
        لاحظنا أن الناس يضيعون بين شروحات قديمة ووسطاء يطلبون كلمة السر. أردنا بديلًا يقول الحقيقة ويعرف أي نموذج يفتح
        لأي رسالة تظهر على الشاشة.
      </p>
      <h2 className="mt-10 text-2xl font-extrabold">ما الذي نفعله</h2>
      <p className="mt-3 leading-8 text-slate-600">
        نفحص الحالة، نجمع إثبات الملكية الذي تختاره، نختار المسار الرسمي، نصوغ الطلب، ونتابع الرد. بعد العودة نمرّ على
        خطوات التأمين حتى لا تتكرر الثغرة.
      </p>
      <h2 className="mt-10 text-2xl font-extrabold">حدودنا</h2>
      <p className="mt-3 leading-8 text-slate-600">
        لا نضمن قرار ميتا، ولا نملك واسطة، ولا نقبل حسابًا لا يخص صاحب الطلب. إن كانت الفرصة شبه معدومة نخبرك قبل أخذ أي
        مقابل.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {values.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <WhatsAppCta>احكِ لنا ما حدث لحسابك</WhatsAppCta>
      </div>
    </div>
  );
}
