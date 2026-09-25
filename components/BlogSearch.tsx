"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function BlogSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/articles?q=${encodeURIComponent(q)}` : "/articles");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="q" className="sr-only">
        ابحث في الأدلّة
      </label>
      <input
        id="q"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="مثال: استرجاع حساب انستقرام معطل"
        className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-base"
      />
      <button type="submit" className="h-12 rounded-full bg-[#1d4ed8] px-6 font-bold text-white hover:bg-[#1e3a8a]">
        بحث
      </button>
    </form>
  );
}
