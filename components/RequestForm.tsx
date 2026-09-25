"use client";

import { FormEvent, useState } from "react";

const issues = [
  "حساب معطّل بالكامل",
  "تعليق مؤقت أو تقييد ميزات",
  "بلاغ حقوق نشر أو علامة تجارية",
  "فقدان البريد أو كلمة السر",
  "حساب تجاري / إعلانات",
  "أخرى",
];

export function RequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("تعذّر إرسال الطلب. تحقّق من الحقول وحاول مرة أخرى.");
      return;
    }

    setStatus("ok");
    setMessage("وصل طلبك. سنتواصل عبر البريد أو واتساب خلال ساعات العمل.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-semibold">
          اسم مستخدم إنستغرام
        </label>
        <input
          id="username"
          name="username"
          required
          dir="ltr"
          placeholder="@username"
          className="h-12 w-full rounded-xl border border-zinc-300 px-3 text-base"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 w-full rounded-xl border border-zinc-300 px-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
            واتساب / الجوال
          </label>
          <input
            id="phone"
            name="phone"
            required
            dir="ltr"
            inputMode="tel"
            className="h-12 w-full rounded-xl border border-zinc-300 px-3 text-base"
          />
        </div>
      </div>
      <div>
        <label htmlFor="issue" className="mb-1 block text-sm font-semibold">
          نوع المشكلة
        </label>
        <select id="issue" name="issue" required className="h-12 w-full rounded-xl border border-zinc-300 px-3 text-base">
          <option value="">اختر...</option>
          {issues.map((issue) => (
            <option key={issue} value={issue}>
              {issue}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="details" className="mb-1 block text-sm font-semibold">
          تفاصيل رسالة التعطيل
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          className="w-full rounded-xl border border-zinc-300 px-3 py-3 text-base"
          placeholder="انسخ نص الرسالة إن أمكن، ومتى حدث التعطيل، وهل الحساب تجاري."
        />
      </div>
      <label className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
        <input type="checkbox" name="owner" value="yes" required className="mt-1 h-4 w-4" />
        أؤكد أنني مالك هذا الحساب أو مفوّض قانونياً عنه، ولن أرسل كلمة المرور أو رمز التحقق.
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-full bg-zinc-900 text-base font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "جارٍ الإرسال..." : "إرسال طلب المساعدة"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "ok" ? "text-emerald-700" : "text-rose-700"}`}>{message}</p>
      ) : null}
    </form>
  );
}
