import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { navLinks } from "@/lib/nav";
import { site, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#0b1220] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="brightness-110">
            <span className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-[22px] font-extrabold text-white">
                {site.logoLetters}
              </span>
              <span className="text-[17px] font-extrabold text-white">{site.name}</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">{site.tagline}</p>
          <WhatsAppCta className="mt-5">تواصل عبر واتساب</WhatsAppCta>
        </div>
        <div>
          <p className="font-bold text-white">روابط</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">أدلّة سريعة</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/articles/istirja-hisab-instagram-muattal" className="hover:text-white">
                حساب معطّل
              </Link>
            </li>
            <li>
              <Link href="/articles/istirja-hisab-mukhtaraq" className="hover:text-white">
                حساب مخترق
              </Link>
            </li>
            <li>
              <Link href="/articles/istirja-hisab-mahdhuf" className="hover:text-white">
                حساب محذوف
              </Link>
            </li>
            <li>
              <Link href="/articles/hisab-tijari-muattal" className="hover:text-white">
                حساب تجاري
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">تنبيه مهم</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            لا نطلب كلمة مرور إنستغرام ولا رمز التحقق. نساعد مالك الحساب عبر النماذج الرسمية فقط.
          </p>
          <p className="mt-4 text-sm">
            <a className="hover:text-white" href={`mailto:${site.email}`} dir="ltr">
              {site.email}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a className="hover:text-white" href={whatsappUrl} dir="ltr">
              {site.whatsappDisplay}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 pb-24 text-center text-xs text-slate-500 sm:pb-4">
        <p>© 2026 {site.name}. غير تابع لإنستغرام أو ميتا.</p>
        <p className="mt-2 flex justify-center gap-4">
          <Link href="/glossary" className="hover:text-white">
            المصطلحات
          </Link>
          <Link href="/privacy-policy" className="hover:text-white">
            سياسة الخصوصية
          </Link>
          <Link href="/terms" className="hover:text-white">
            الشروط
          </Link>
        </p>
      </div>
    </footer>
  );
}
