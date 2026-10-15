"use client";

import { useEffect } from "react";

export function WhatsAppClick() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      const href = link?.getAttribute("href") ?? "";
      if (!/wa\.me|api\.whatsapp\.com|whatsapp\.com\/send/i.test(href)) return;
      const pagePath = window.location.pathname;
      const analytics = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
      if (typeof analytics.gtag === "function") analytics.gtag("event", "whatsapp_click", { page_path: pagePath });
      else if (Array.isArray(analytics.dataLayer)) analytics.dataLayer.push({ event: "whatsapp_click", page_path: pagePath });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
