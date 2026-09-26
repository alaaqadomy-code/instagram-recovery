import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-[70] inline-flex items-center gap-2.5 rounded-full bg-[#075E54] p-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(7,94,84,0.4)] transition hover:-translate-y-0.5 hover:bg-[#054c44] sm:px-[18px] sm:py-3"
    >
      <WhatsAppIcon className="h-[30px] w-[30px] shrink-0" />
      <span className="hidden sm:inline">تواصل معنا</span>
    </a>
  );
}
