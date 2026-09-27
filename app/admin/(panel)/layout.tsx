import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, readSession } from "@/lib/analytics.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!readSession(jar.get(ADMIN_COOKIE)?.value || "")) redirect("/admin/login");
  return children;
}
