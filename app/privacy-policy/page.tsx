import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: `كيف يتعامل ${site.name} مع بيانات طلبات استرجاع حساب إنستغرام، وما لا نطلبه أبدًا.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 leading-8 sm:px-6">
      <h1 className="text-3xl font-extrabold">سياسة الخصوصية</h1>
      <p className="mt-2 text-sm text-slate-500">آخر تحديث: 24 سبتمبر 2026</p>
      <p className="mt-6 text-slate-700">
        يحترم {site.name} خصوصية الزوار. طبيعة العمل تتضمّن بيانات حسّاسة عن الحساب، لذلك نجمع الحد الأدنى فقط.
      </p>
      <h2 className="mt-8 text-2xl font-bold">1. البيانات التي قد نجمعها</h2>
      <p className="mt-3 text-slate-700">
        ما ترسله طوعًا: اسم المستخدم الظاهر، لقطات رسائل التعطيل، وصف الحالة، ووسيلة التواصل. وما يُجمع تلقائيًا بشكل
        محدود مثل نوع المتصفح والصفحات المزارة لتحسين الموقع.
      </p>
      <h2 className="mt-8 text-2xl font-bold">2. ما لا نطلبه</h2>
      <p className="mt-3 text-slate-700">
        لا نطلب كلمة مرور إنستغرام، ولا رمز التحقق الذي يصل إلى هاتفك، ولا بيانات بطاقات الدفع. إن احتاج الملف مستند
        هوية رسميًا سنشرح السبب قبل أن ترسله.
      </p>
      <h2 className="mt-8 text-2xl font-bold">3. كيف نستخدم البيانات</h2>
      <p className="mt-3 text-slate-700">
        لفحص الحالة، توجيهك للمسار الرسمي، التواصل بشأن التحديثات، وتحسين المحتوى. لا نبيع بياناتك ولا ننشر قصصًا تكشف
        هويتك دون إذن.
      </p>
      <h2 className="mt-8 text-2xl font-bold">4. ملفات الارتباط وأدوات التحليل</h2>
      <p className="mt-3 text-slate-700">
        قد نستخدم ملفات ارتباط لتحسين التصفح، وأدوات مثل تحليلات الزيارات. يمكنك رفضها من المتصفح مع احتمال تأثر بعض
        الوظائف.
      </p>
      <h2 className="mt-8 text-2xl font-bold">5. الاحتفاظ والحقوق</h2>
      <p className="mt-3 text-slate-700">
        لا نحتفظ بالمستندات الحسّاسة أطول مما يلزم لإتمام الإجراء. يمكنك طلب التصحيح أو الحذف عبر {site.email}.
      </p>
    </div>
  );
}
