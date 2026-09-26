"use client";

import { useEffect, useRef, useState } from "react";

const completedClients = 1480;

export function CompletedClientsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(completedClients);
      return;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const duration = 1600;

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(eased * completedClients));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-[#e6dcc8] bg-[#142033] text-[#f6f1e8]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-bold text-[#fdba74]">سجل الملفات</p>
          <p className="mt-2 text-2xl font-extrabold">عملاء أُنجز العمل لهم</p>
        </div>
        <p className="text-5xl font-extrabold tabular-nums tracking-tight sm:text-6xl">
          {value.toLocaleString("en-US")}
        </p>
      </div>
    </section>
  );
}
