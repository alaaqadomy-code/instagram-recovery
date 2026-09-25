import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { navLinks } from "@/lib/nav";
import { whatsappUrl } from "@/lib/site";

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
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2 inline-flex items-center rounded-2xl bg-[#25D366] px-5 py-2.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1ebe57]"
          >
            افحص حالة حسابك
          </a>
        </nav>

        <div className="flex items-center lg:hidden">
          <details className="mobile-nav relative">
            <summary
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center bg-transparent"
              aria-label="القائمة"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
                <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
                <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
              </span>
            </summary>
            <nav className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(92vw,20rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex flex-col text-sm font-semibold">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl px-3 py-3 text-slate-800 hover:bg-slate-50">
                    {link.label}
                  </Link>
                ))}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  افحص حالة حسابك
                </a>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
