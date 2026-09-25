import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: `شروط استخدام موقع ${site.name} لخدمات المساعدة في استرجاع حسابات إنستغرام.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 leading-8 sm:px-6">
      <h1 className="text-3xl font-extrabold">شروط الاستخدام</h1>
      <p className="mt-6 text-slate-700">
        الخدمة إرشادية وتنظيمية. إنستغرام وميتا يقرران قبول المراجعة أو رفضها. لا نضمن فتح الحساب ولا مدة محددة لكل
        الحالات.
      </p>
      <p className="mt-4 text-slate-700">
        يُسمح بطلب المساعدة لحساب تملكه أو تملك تفويضًا قانونيًا عنه فقط. يُحظر استخدام الموقع للوصول إلى حسابات الغير أو
        لانتحال صفة الدعم الرسمي.
      </p>
      <p className="mt-4 text-slate-700">
        الموقع غير تابع لميتا بلاتفورمز. العلامات التجارية المذكورة تخص أصحابها وتُذكر لوصف الخدمة فقط.
      </p>
      <p className="mt-4 text-slate-700">
        بالتواصل معنا عبر واتساب أو البريد فإنك تؤكد أنك المالك أو المفوّض، وأنك لن ترسل كلمة مرور أو رمز تحقق لطرف غير
        المنصة الرسمية.
      </p>
    </div>
  );
}
