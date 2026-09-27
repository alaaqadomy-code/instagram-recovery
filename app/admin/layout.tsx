import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header,
        body > footer,
        a[aria-label="تواصل معنا عبر واتساب"] { display: none !important; }
        body { background: #f8fafc; }
      `}</style>
      <div dir="ltr" className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </div>
    </>
  );
}
