import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-[22px] font-extrabold tracking-tight text-white">
        {site.logoLetters}
      </span>
      {compact ? (
        <span className="sr-only">{site.name}</span>
      ) : (
        <span className="flex flex-col leading-tight">
          <span className="text-xl font-extrabold text-slate-900">{site.name}</span>
          <span className="text-xs text-slate-500">استرجاع حسابات انستقرام</span>
        </span>
      )}
    </Link>
  );
}
