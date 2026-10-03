"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { navLinks } from "@/lib/nav";
import { whatsappChatUrl } from "@/lib/site";

export function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center bg-transparent"
        aria-label="القائمة"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
          <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
          <span className="block h-[3px] w-[26px] rounded-sm bg-slate-900" />
        </span>
      </button>
      {open ? (
        <nav className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(92vw,20rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex flex-col text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-slate-800 hover:bg-slate-50"
                onClick={(event) => {
                  event.preventDefault();
                  go(link.href);
                }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#075E54] px-3 py-3 text-white"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="h-4 w-4" />
              افحص حالة حسابك
            </a>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
