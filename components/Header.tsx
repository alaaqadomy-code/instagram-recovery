import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import { navLinks } from "@/lib/nav";
import { whatsappChatUrl } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[70px] max-w-[1180px] items-center justify-between gap-3 px-5 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 text-[15px] font-semibold text-slate-600 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 hover:bg-slate-50 hover:text-[#1d4ed8]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2 inline-flex items-center rounded-2xl bg-[#075E54] px-5 py-2.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(7,94,84,0.3)] hover:bg-[#054c44]"
          >
            افحص حالة حسابك
          </a>
        </nav>

        <div className="flex items-center lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
