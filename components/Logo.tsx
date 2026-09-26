import Link from "next/link";
import { site } from "@/lib/site";

export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`${className} shrink-0`} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#142033" />
      <rect x="12" y="13" width="40" height="38" rx="6" fill="#f6f1e8" />
      <rect x="30" y="23" width="16" height="3" rx="1.5" fill="#142033" fillOpacity="0.28" />
      <rect x="22" y="30.5" width="24" height="3.2" rx="1.6" fill="#9a3412" />
      <rect x="34" y="38" width="12" height="3" rx="1.5" fill="#142033" fillOpacity="0.28" />
    </svg>
  );
}

export function Logo({ compact = false, tone = "dark" }: { compact?: boolean; tone?: "dark" | "light" }) {
  const title = tone === "light" ? "text-white" : "text-slate-900";
  const subtitle = tone === "light" ? "text-slate-400" : "text-slate-500";

  return (
    <Link href="/" className="flex items-center gap-3">
      <LogoMark />
      {compact ? (
        <span className="sr-only">{site.name}</span>
      ) : (
        <span className="flex flex-col leading-tight">
          <span className={`text-xl font-extrabold ${title}`}>{site.name}</span>
          <span className={`text-xs ${subtitle}`}>استرجاع حسابات انستقرام</span>
        </span>
      )}
    </Link>
  );
}
