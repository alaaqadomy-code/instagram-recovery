import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/Cta";
import { needItems } from "@/lib/content";
import { site, whatsappChatUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع Unlock Accounts عبر واتساب لفحص حالة حساب إنستغرام مجانًا. لا نطلب كلمة المرور.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold text-[#1d4ed8]">تواصل معنا</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">احكِ لنا ما حدث لحسابك</h1>
      <p className="mt-4 leading-8 text-slate-600">
        الفحص الأولي مجاني ولا يلزمك بشيء. نرد بتشخيص واضح وتقدير صريح للفرص. الخدمة عن بُعد من أندرويد أو آيفون.
      </p>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold">الطريقة الأسرع: واتساب</h2>
        <p className="mt-3 leading-7 text-slate-600">رسالة واحدة تشرح ما حدث تكفي للبداية.</p>
        <WhatsAppCta className="mt-5">تواصل عبر واتساب</WhatsAppCta>
        <p className="mt-4 text-sm text-slate-600">
          البريد:{" "}
          <a className="font-semibold text-[#1d4ed8]" href={`mailto:${site.email}`} dir="ltr">
            {site.email}
          </a>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          الهاتف:{" "}
          <a className="font-semibold text-[#1d4ed8]" href={whatsappChatUrl} dir="ltr">
            {site.whatsappDisplay}
          </a>
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-extrabold">ماذا نحتاج في أول رسالة؟</h2>
      <ul className="mt-4 space-y-2 text-slate-700">
        {needItems.map((item) => (
          <li key={item} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 leading-8 text-slate-600">
        لا نطلب كلمة سر إنستغرام ولا بيانات بطاقة ولا رمز التحقق الذي يصل إلى هاتفك. أي جهة تطلب الرمز تحاول الاستيلاء
        على ما تبقّى لديك.
      </p>

      <h2 className="mt-10 text-2xl font-extrabold">ماذا يحدث بعد أن ترسل رسالتك؟</h2>
      <p className="mt-4 leading-8 text-slate-600">
        نقرأ ما كتبته ونطلب لقطة الشاشة التي تظهر عند محاولة الدخول، لأن نص تلك الشاشة هو ما يحدد الحالة: تعطيل، أو
        حذف ما زال داخل مهلته، أو قفل احترازي يطلب تحققاً، أو اختراق غيّر البريد والرقم. كل حالة من هذه لها مسار
        مختلف ونموذج مختلف، والخلط بينها هو أكثر ما يضيّع الوقت على أصحاب الحسابات.
      </p>
      <p className="mt-4 leading-8 text-slate-600">
        بعد التشخيص نقول لك رأينا بصراحة: هل الحالة قابلة للمحاولة، وما المسار المناسب، وما الأدلة التي ستحتاجها.
        وإن كانت حالتك مما تستطيع إنهاءه بنفسك مجاناً خلال دقائق، فسنقول لك ذلك ونشرح لك الخطوات، ولن نعرض عليك
        خدمة لا تحتاجها.
      </p>

      <h2 className="mt-10 text-2xl font-extrabold">متى نرد؟</h2>
      <p className="mt-4 leading-8 text-slate-600">
        نرد على رسائل واتساب خلال ساعات العمل عادة، وقد يتأخر الرد في أوقات الذروة أو خارج أوقات العمل. إن لم يصلك
        رد خلال يوم، فأعد إرسال الرسالة نفسها مرة واحدة بدل فتح محادثة جديدة، فتكرار المحادثات يشتّت الملف ويؤخّر
        المتابعة.
      </p>
      <p className="mt-4 leading-8 text-slate-600">
        ولا تنتظر ردّنا لتبدأ. إن كانت حالتك عاجلة، مثل اختراق جارٍ غُيّر فيه البريد قبل دقائق، فافتح
        instagram.com/hacked فوراً وابدأ المسار الرسمي، فالوقت في الساعات الأولى أثمن من أي استشارة.
      </p>

      <h2 className="mt-10 text-2xl font-extrabold">ما لا نستطيع فعله</h2>
      <p className="mt-4 leading-8 text-slate-600">
        لا نملك قناة خاصة داخل ميتا ولا وسيلة لتسريع المراجعة، ولا أحد يملك ذلك. القرار النهائي بيد فرق المراجعة في
        ميتا وحدها، ونحن نساعدك في التشخيص وفي بناء الطلب بأفضل صورة ممكنة. من يَعِدك بنتيجة مضمونة أو بمدة محددة
        فهو يبيعك وهماً.
      </p>
      <p className="mt-4 leading-8 text-slate-600">
        ولا نتعامل مع طلبات الوصول إلى حساب لا تملكه مهما كان السبب، ولا نبيع حسابات ولا متابعين، ولا نقدّم أي
        خدمة تخالف شروط إنستغرام.
      </p>
    </div>
  );
}
