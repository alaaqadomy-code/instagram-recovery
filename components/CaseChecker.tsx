"use client";

import { useState } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/lib/site";

type SymptomId = "disabled" | "banned" | "deleted" | "stolen" | "locked" | "nocode";
type DurationId = "day" | "week" | "month" | "months" | "halfyear";
type AccessId = "yes" | "no" | "unknown";
type AccountTypeId = "personal" | "business" | "creator";

type Option<T extends string> = { id: T; label: string };

const symptomOptions: Option<SymptomId>[] = [
  { id: "disabled", label: "رسالة تعطيل أو تعليق للحساب" },
  { id: "banned", label: "رسالة حظر أو تقييد لبعض الميزات" },
  { id: "deleted", label: "«المستخدم غير موجود» أو حذفته بنفسي" },
  { id: "stolen", label: "تغيّر البريد أو الرقم دون علمي" },
  { id: "locked", label: "قفل مؤقت أو طلب تأكيد الهوية" },
  { id: "nocode", label: "يطلب كود تحقق لا يصلني" },
];

const durationOptions: Option<DurationId>[] = [
  { id: "day", label: "أقل من يوم" },
  { id: "week", label: "أقل من أسبوع" },
  { id: "month", label: "أقل من شهر" },
  { id: "months", label: "أكثر من شهر" },
  { id: "halfyear", label: "أكثر من 6 أشهر" },
];

const accessOptions: Option<AccessId>[] = [
  { id: "yes", label: "نعم، ما زال بيدي" },
  { id: "no", label: "لا، فقدته أو تغيّر" },
  { id: "unknown", label: "لا أعرف" },
];

const accountTypeOptions: Option<AccountTypeId>[] = [
  { id: "personal", label: "حساب شخصي" },
  { id: "business", label: "متجر أو حساب تجاري" },
  { id: "creator", label: "مؤثر أو حساب موثق" },
];

type Chance = "مرتفعة" | "متوسطة" | "ضعيفة";

type CaseInfo = {
  title: string;
  service: string;
  serviceLabel: string;
};

const caseInfo: Record<SymptomId, CaseInfo> = {
  disabled: {
    title: "حساب معطّل أو معلّق",
    service: "/services/استرجاع-حساب-انستقرام-معطل",
    serviceLabel: "خدمة استرجاع الحساب المعطّل",
  },
  banned: {
    title: "حساب مبند أو مقيّد الميزات",
    service: "/services/استرجاع-حساب-انستقرام-مبند",
    serviceLabel: "خدمة استرجاع الحساب المبند",
  },
  deleted: {
    title: "حساب محذوف",
    service: "/services/استرجاع-حساب-انستقرام-محذوف",
    serviceLabel: "خدمة استرجاع الحساب المحذوف",
  },
  stolen: {
    title: "حساب مسروق أو مخترق",
    service: "/services/استرجاع-حساب-انستقرام-مسروق",
    serviceLabel: "خدمة استرجاع الحساب المسروق",
  },
  locked: {
    title: "حساب مغلق مؤقتاً أو بانتظار تأكيد الهوية",
    service: "/services/استرجاع-حساب-انستقرام-مغلق",
    serviceLabel: "خدمة استرجاع الحساب المغلق",
  },
  nocode: {
    title: "لا يصل كود التحقق",
    service: "/services/استرجاع-حساب-انستقرام-بدون-كود-التحقق",
    serviceLabel: "خدمة الاسترجاع بدون كود التحقق",
  },
};

const durationRank: Record<DurationId, number> = { day: 0, week: 1, month: 2, months: 3, halfyear: 4 };

function estimateChance(symptom: SymptomId, duration: DurationId, access: AccessId): Chance {
  const rank = durationRank[duration];

  switch (symptom) {
    case "deleted":
      // الحذف الذاتي له مهلة محدودة لدى ميتا؛ بعد شهر تضعف الفرص كثيراً.
      if (rank >= 3) return "ضعيفة";
      if (rank === 2) return "متوسطة";
      return access === "no" ? "متوسطة" : "مرتفعة";
    case "disabled":
      if (rank === 4) return "ضعيفة";
      if (rank === 3) return "متوسطة";
      return access === "no" ? "متوسطة" : "مرتفعة";
    case "stolen":
      if (rank === 0) return "مرتفعة";
      if (rank <= 2) return access === "yes" ? "مرتفعة" : "متوسطة";
      return access === "yes" ? "متوسطة" : "ضعيفة";
    case "banned":
      if (rank === 4) return "متوسطة";
      return "مرتفعة";
    case "locked":
      if (access === "yes") return "مرتفعة";
      return rank >= 3 ? "ضعيفة" : "متوسطة";
    case "nocode":
      if (access === "yes") return "مرتفعة";
      if (access === "unknown") return "متوسطة";
      return rank >= 3 ? "ضعيفة" : "متوسطة";
  }
}

function urgentStep(symptom: SymptomId, access: AccessId): string {
  switch (symptom) {
    case "disabled":
      return "التقط صورة لرسالة التعطيل كاملة، ولا تحاول إنشاء حساب جديد بنفس البيانات قبل انتهاء المراجعة.";
    case "banned":
      return "توقف فوراً عن أي نشاط مكثف (متابعة، إعجابات، تعليقات) واحتفظ بلقطة رسالة التقييد.";
    case "deleted":
      return "جرّب تسجيل الدخول اليوم من التطبيق نفسه؛ المهلة محدودة، وكل يوم تأخير يقلل الفرصة.";
    case "stolen":
      return access === "yes"
        ? "افتح البريد المرتبط وابحث عن رسالة «تغيير البريد» من انستقرام واضغط رابط التراجع فوراً."
        : "لا تتواصل مع المخترق ولا تدفع له؛ احتفظ بأي رسائل تحمل اسم حسابك وبريدك القديم.";
    case "locked":
      return "جهّز بطاقة هوية واضحة باسمك الحقيقي وصورة سيلفي بإضاءة جيدة قبل بدء التأكيد.";
    case "nocode":
      return "تحقق من أن شريحة الرقم القديم ما زالت فعّالة، وتجنّب طلب الكود عدة مرات متتالية كي لا يُقفل الطلب.";
  }
}

function chanceStyle(chance: Chance) {
  if (chance === "مرتفعة") return "bg-[#dcfce7] text-[#166534] border-[#86efac]";
  if (chance === "متوسطة") return "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]";
  return "bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]";
}

function labelOf<T extends string>(options: Option<T>[], id: T) {
  return options.find((o) => o.id === id)?.label ?? "";
}

type Answers = {
  symptom?: SymptomId;
  duration?: DurationId;
  access?: AccessId;
  accountType?: AccountTypeId;
};

const stepTitles = [
  "ماذا ترى عند محاولة الدخول؟",
  "منذ متى بدأت المشكلة؟",
  "هل البريد أو الرقم المرتبط ما زال بيدك؟",
  "ما نوع الحساب؟",
];

function OptionButtons<T extends string>({
  options,
  onPick,
}: {
  options: Option<T>[];
  onPick: (id: T) => void;
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onPick(o.id)}
          className="rounded-sm border border-[#e6dcc8] bg-[#f4efe6] px-4 py-3 text-right text-sm font-bold leading-7 text-[#142033] transition hover:border-[#9a3412] hover:bg-[#fbf7f0] hover:text-[#9a3412]"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CaseChecker() {
  const [answers, setAnswers] = useState<Answers>({});

  const step = !answers.symptom ? 0 : !answers.duration ? 1 : !answers.access ? 2 : !answers.accountType ? 3 : 4;

  const reset = () => setAnswers({});
  const back = () => {
    setAnswers((prev) => {
      if (prev.accountType) return { ...prev, accountType: undefined };
      if (prev.access) return { ...prev, access: undefined };
      if (prev.duration) return { ...prev, duration: undefined };
      return {};
    });
  };

  if (step < 4) {
    return (
      <section className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6 sm:p-8" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold tracking-widest text-[#9a3412]">
            الخطوة {step + 1} من {stepTitles.length}
          </p>
          {step > 0 ? (
            <button type="button" onClick={back} className="text-xs font-bold text-[#57534e] underline underline-offset-4 hover:text-[#142033]">
              رجوع
            </button>
          ) : null}
        </div>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {stepTitles.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-sm ${i <= step ? "bg-[#9a3412]" : "bg-[#e6dcc8]"}`} />
          ))}
        </div>
        <h2 className="mt-5 text-xl font-extrabold leading-8 text-[#142033] sm:text-2xl">{stepTitles[step]}</h2>

        {step === 0 ? (
          <OptionButtons options={symptomOptions} onPick={(id) => setAnswers({ ...answers, symptom: id })} />
        ) : null}
        {step === 1 ? (
          <OptionButtons options={durationOptions} onPick={(id) => setAnswers({ ...answers, duration: id })} />
        ) : null}
        {step === 2 ? (
          <OptionButtons options={accessOptions} onPick={(id) => setAnswers({ ...answers, access: id })} />
        ) : null}
        {step === 3 ? (
          <OptionButtons options={accountTypeOptions} onPick={(id) => setAnswers({ ...answers, accountType: id })} />
        ) : null}

        <p className="mt-6 text-xs leading-6 text-[#78716c]">
          لا نطلب كلمة المرور ولا أي بيانات دخول، ولا تُحفظ إجاباتك أو تُرسل إلى أي خادم؛ التشخيص يتم داخل متصفحك فقط.
        </p>
      </section>
    );
  }

  const symptom = answers.symptom!;
  const duration = answers.duration!;
  const access = answers.access!;
  const accountType = answers.accountType!;

  const info = caseInfo[symptom];
  const chance = estimateChance(symptom, duration, access);
  const step1 = urgentStep(symptom, access);

  const message = `السلام عليكم،
أتواصل معكم من أداة فحص الحالة في موقع Unlock Accounts بخصوص استرجاع حساب انستقرام.
ما أراه: ${labelOf(symptomOptions, symptom)}
منذ متى: ${labelOf(durationOptions, duration)}
البريد أو الرقم المرتبط: ${labelOf(accessOptions, access)}
نوع الحساب: ${labelOf(accountTypeOptions, accountType)}
التشخيص المبدئي: ${info.title} — الفرص ${chance}
اسم المستخدم:
سأرسل لقطة الشاشة الآن.`;

  const waHref = `${whatsappUrl}?text=${encodeURIComponent(message)}`;

  return (
    <section className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6 sm:p-8" aria-live="polite">
      <p className="text-xs font-bold tracking-widest text-[#9a3412]">نتيجة الفحص المبدئي</p>
      <h2 className="mt-3 text-2xl font-extrabold leading-9 text-[#142033]">{info.title}</h2>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-[#e6dcc8] bg-[#f4efe6] p-4">
          <dt className="text-xs font-bold text-[#78716c]">تقدير الفرص</dt>
          <dd className="mt-2">
            <span className={`inline-block rounded-sm border px-3 py-1 text-sm font-extrabold ${chanceStyle(chance)}`}>{chance}</span>
          </dd>
        </div>
        <div className="rounded-sm border border-[#e6dcc8] bg-[#f4efe6] p-4">
          <dt className="text-xs font-bold text-[#78716c]">نوع الحساب</dt>
          <dd className="mt-2 text-sm font-bold text-[#142033]">{labelOf(accountTypeOptions, accountType)}</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-sm border-r-4 border-[#9a3412] bg-[#f4efe6] p-4">
        <p className="text-xs font-bold text-[#9a3412]">الخطوة العاجلة الآن</p>
        <p className="mt-2 text-sm font-bold leading-7 text-[#142033]">{step1}</p>
      </div>

      <ul className="mt-5 space-y-1 text-xs leading-6 text-[#78716c]">
        <li>▸ ما أراه: {labelOf(symptomOptions, symptom)}</li>
        <li>▸ منذ: {labelOf(durationOptions, duration)}</li>
        <li>▸ البريد أو الرقم المرتبط: {labelOf(accessOptions, access)}</li>
      </ul>

      <p className="mt-5 text-xs leading-6 text-[#78716c]">
        هذا التقدير إرشادي يستند إلى إجاباتك فقط؛ القرار النهائي لميتا وحدها، ولا نضمن نتيجة. الفحص الدقيق يبدأ من لقطة
        الشاشة.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-[#142033] px-6 text-sm font-bold text-[#f6f1e8] transition hover:bg-[#1f2f4a]"
        >
          أرسل النتيجة عبر واتساب للفحص الدقيق
        </a>
        <Link
          href={info.service}
          className="inline-flex h-12 items-center justify-center rounded-sm border border-[#142033] px-6 text-sm font-bold text-[#142033] transition hover:bg-[#f4efe6]"
        >
          {info.serviceLabel} ←
        </Link>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center px-4 text-sm font-bold text-[#9a3412] underline underline-offset-4"
        >
          ابدأ من جديد
        </button>
      </div>
    </section>
  );
}
