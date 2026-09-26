import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="mt-4 text-slate-600">تحقق من الرابط أو عد إلى المدونة.</p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link href="/" className="font-bold text-[#1d4ed8]">
          الرئيسية
        </Link>
        <Link href="/articles" className="text-sm font-semibold text-slate-600">
          المدونة
        </Link>
        <WhatsAppCta>تواصل عبر واتساب</WhatsAppCta>
      </div>
    </div>
  );
}
