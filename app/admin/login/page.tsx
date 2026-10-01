import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, readSession } from "@/lib/analytics.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const jar = await cookies();
  if (readSession(jar.get(ADMIN_COOKIE)?.value || "")) redirect("/admin");
  const query = await searchParams;
  const failed = query.e === "1";

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <form action="/admin/session" method="post" className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Unlock Accounts</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#1e3a8a]">لوحة التحليلات</h1>
        <label className="mt-6 block text-sm font-semibold" htmlFor="password">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4 outline-none focus:border-[#1d4ed8]"
        />
        {failed ? <p className="mt-3 text-sm font-semibold text-red-700">كلمة المرور غير صحيحة.</p> : null}
        <button className="mt-5 h-12 w-full rounded-2xl bg-[#1d4ed8] text-sm font-bold text-white" type="submit">
          دخول
        </button>
      </form>
    </div>
  );
}
