import Link from "next/link";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

type Props = {
  children: string;
  className?: string;
};

export function WhatsAppCta({ children, className = "", icon = false }: Props & { icon?: boolean }) {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#075E54] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(7,94,84,0.3)] transition hover:bg-[#054c44] ${className}`}
    >
      {icon ? <WhatsAppIcon className="h-5 w-5" /> : null}
      {children}
    </a>
  );
}

export function GhostCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const classNameFull = `inline-flex h-12 items-center justify-center rounded-2xl border-2 border-[#2563eb] bg-white px-6 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#eff6ff] ${className}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classNameFull}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classNameFull}>
      {children}
    </a>
  );
}

export function BrandCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const classNameFull = `inline-flex h-12 items-center justify-center rounded-2xl bg-[#1d4ed8] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(29,78,216,0.28)] transition hover:bg-[#1e3a8a] ${className}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classNameFull}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classNameFull}>
      {children}
    </a>
  );
}
