import type { AdminReport, RangeKey } from "@/lib/analytics.js";
import type { GscData, QueryRow, SourceState } from "@/lib/admin/search-console";

export type ArticleStat = {
  title: string;
  path: string;
  published: string;
  category: string;
  visits: number;
  visitors: number;
};

const ranges: { key: RangeKey; label: string }[] = [
  { key: "today", label: "اليوم" },
  { key: "7", label: "7 أيام" },
  { key: "30", label: "30 يوماً" },
];

const nav = [
  ["نظرة عامة", "#overview"],
  ["المصادر", "#sources"],
  ["الصفحات", "#pages"],
  ["المقالات", "#articles"],
  ["بحث جوجل", "#search"],
  ["الزحف", "#crawlers"],
  ["الحالة", "#health"],
  ["الدول", "#audience"],
];

function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("ar").format(value);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${new Intl.NumberFormat("ar", { maximumFractionDigits: 1 }).format(value * 100)}%`;
}

function formatPosition(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value === 0) return "—";
  return new Intl.NumberFormat("ar", { maximumFractionDigits: 1 }).format(value);
}

function changeLabel(current: number, previous: number): string {
  if (!previous) return current ? "جديد" : "0%";
  const pct = Math.round(((current - previous) / previous) * 1000) / 10;
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

function rangeTitle(range: RangeKey): string {
  if (range === "today") return "اليوم";
  if (range === "30") return "آخر 30 يوماً";
  return "آخر 7 أيام";
}

function previousTitle(range: RangeKey): string {
  if (range === "today") return "أمس";
  if (range === "30") return "الأيام الثلاثون السابقة";
  return "الأيام السبعة السابقة";
}

function href(range: RangeKey, hash = ""): string {
  return `/admin?range=${range}${hash}`;
}

function sourceLabel(status: SourceState): string {
  if (status.state === "ok") return "متصل";
  if (status.state === "error") return "خطأ في المزامنة";
  return "غير مربوط";
}

function syncTime(status: SourceState): string {
  if (status.state === "ok") return status.refreshedAt.replace("T", " ").slice(0, 16);
  if (status.state === "error" && status.refreshedAt) return status.refreshedAt.replace("T", " ").slice(0, 16);
  return "—";
}

function TrafficChart({ points }: { points: { label: string; visits: number }[] }) {
  const width = 640;
  const height = 160;
  const max = Math.max(...points.map((point) => point.visits), 1);
  const step = points.length > 1 ? width / (points.length - 1) : 0;
  const line = points
    .map((point, index) => {
      const x = points.length === 1 ? width / 2 : index * step;
      const y = height - 16 - (point.visits / max) * (height - 28);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="الزيارات عبر الوقت" className="mt-4 h-40 w-full">
      <path d={line} fill="none" stroke="#1d4ed8" strokeWidth="2.5" />
    </svg>
  );
}

function Metric({ label, value, previous }: { label: string; value: number; previous?: number }) {
  return (
    <article className="border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1e3a8a]">{formatNumber(value)}</p>
      {previous == null ? null : (
        <p className="mt-2 text-sm text-slate-500">
          الفترة السابقة: {formatNumber(previous)} · التغيير: {changeLabel(value, previous)}
        </p>
      )}
    </article>
  );
}

function Badge({ status }: { status: SourceState }) {
  const tone = status.state === "ok" ? "bg-[#1e3a8a] text-white" : status.state === "error" ? "bg-red-800 text-white" : "bg-slate-200 text-slate-700";
  return <span className={`inline-flex px-2 py-1 text-xs font-semibold ${tone}`}>{sourceLabel(status)}</span>;
}

function QueryTable({ title, rows, mode }: { title: string; rows: QueryRow[] | null; mode: "query" | "page" | "country" }) {
  if (!rows) return null;
  const heading = mode === "query" ? "العبارة" : mode === "country" ? "الدولة" : "الرابط";
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-[#1e3a8a]">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm">لا صفوف في هذه الفترة.</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-start text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 font-medium">{heading}</th>
                <th className="py-2 font-medium">نقرات</th>
                <th className="py-2 font-medium">ظهور</th>
                <th className="py-2 font-medium">نسبة النقر</th>
                <th className="py-2 font-medium">متوسط الترتيب</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${mode}-${row.query}-${row.page ?? ""}`} className="border-b border-slate-100">
                  <td className="py-2 break-all">{mode === "page" ? row.page : row.query}</td>
                  <td className="py-2">{formatNumber(row.clicks)}</td>
                  <td className="py-2">{formatNumber(row.impressions)}</td>
                  <td className="py-2">{formatPercent(row.ctr)}</td>
                  <td className="py-2">{formatPosition(row.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Dashboard({
  report,
  articles,
  publishedCount,
  gsc,
  searchLabel,
}: {
  report: AdminReport;
  articles: ArticleStat[];
  publishedCount: number;
  gsc: GscData | { status: SourceState };
  searchLabel: string;
}) {
  const gscData = "totals" in gsc ? gsc : null;
  const visitedArticles = articles.filter((item) => item.visits > 0);
  const topArticle = visitedArticles[0] ?? null;
  const quiet = publishedCount - visitedArticles.length;
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[14rem_1fr]">
      <aside className="bg-[#1e3a8a] text-white lg:min-h-screen">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block">
          <p className="text-sm font-semibold">لوحة التحليلات</p>
          <a href="/admin/logout" className="text-sm text-blue-100">
            خروج
          </a>
        </div>
        <nav className="flex gap-3 overflow-x-auto px-4 pb-4 lg:grid lg:gap-2 lg:overflow-visible">
          {nav.map(([label, hash]) => (
            <a key={hash} href={hash} className="shrink-0 text-sm text-blue-100 hover:text-white">
              {label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Unlock Accounts</p>
            <h1 className="text-2xl font-bold text-[#1e3a8a]">تحليلات الموقع</h1>
            <p className="mt-1 text-sm text-slate-500">سجل السيرفر منفصل عن Google Search Console. زحف Googlebot ليس نقرات البحث.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ranges.map((item) => (
              <a
                key={item.key}
                href={href(item.key)}
                className={item.key === report.range ? "bg-[#1d4ed8] px-3 py-2 text-sm font-semibold text-white" : "border border-[#1e3a8a] px-3 py-2 text-sm font-semibold text-[#1e3a8a]"}
              >
                {item.label}
              </a>
            ))}
          </div>
        </header>

        <section className="mt-6 border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4" aria-label="مصادر البيانات">
          <h2 className="text-lg font-semibold text-[#1e3a8a]">مصادر البيانات</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">سجل السيرفر</dt>
              <dd className="mt-1">
                <Badge status={{ state: "ok", refreshedAt: "" }} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Google Search Console</dt>
              <dd className="mt-1">
                <Badge status={gsc.status} />
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-slate-500">
            آخر مزامنة ناجحة لبحث جوجل: {syncTime(gsc.status)}
          </p>
          {gsc.status.state === "error" ? <p className="mt-2 text-sm text-red-800">{gsc.status.message}</p> : null}
        </section>

        <section id="overview" className="mt-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">نظرة عامة</h2>
          <p className="mt-1 text-sm text-slate-500">
            {rangeTitle(report.range)}. الفترة السابقة: {previousTitle(report.range)}.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="الزوار" value={report.range === "today" ? report.visitorsToday : report.range === "30" ? report.visitors30 : report.visitors7} previous={report.previousVisitors} />
            <Metric label="الزيارات" value={report.rangeVisits} previous={report.previousVisits} />
            <Metric label="الآن" value={report.live} />
            <Metric label="زحف Googlebot" value={report.range === "today" ? report.googlebotToday : report.range === "30" ? report.googlebot30 : report.googlebot7} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <article className="border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">زوار اليوم / 7 أيام / 30 يوماً</p>
              <p className="mt-2 font-semibold text-[#1e3a8a]">
                {formatNumber(report.visitorsToday)} / {formatNumber(report.visitors7)} / {formatNumber(report.visitors30)}
              </p>
            </article>
            <article className="border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">مجموع الزيارات</p>
              <p className="mt-2 font-semibold text-[#1e3a8a]">{formatNumber(report.totalVisits)}</p>
            </article>
            <article className="border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">زوار الأردن / الدول العربية</p>
              <p className="mt-2 font-semibold text-[#1e3a8a]">
                {formatNumber(report.jordanVisitors)} / {formatNumber(report.arabVisitors)}
              </p>
            </article>
          </div>
          <p className="mt-2 text-xs text-slate-500">«الآن» يعني زائراً نشطاً خلال الدقيقتين الأخيرتين.</p>
        </section>

        <section id="sources" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">مصادر الزيارات</h2>
          <p className="mt-1 text-sm text-slate-500">التصنيف من المُحيل. زيارة جوجل هنا تختلف عن نقرة نتيجة البحث.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">المصدر</th>
                  <th className="py-2 font-medium">الزيارات</th>
                  <th className="py-2 font-medium">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {report.sources.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{formatNumber(row.count)}</td>
                    <td className="py-2">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.series.length > 0 ? <TrafficChart points={report.series} /> : null}
          <p className="mt-2 text-xs text-slate-500">{report.series.map((point) => `${point.label}: ${point.visits}`).join(" · ")}</p>
        </section>

        <section id="pages" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">أعلى الصفحات</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">الصفحة</th>
                  <th className="py-2 font-medium">الزيارات</th>
                  <th className="py-2 font-medium">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {report.pages.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2 break-all">{row.label}</td>
                    <td className="py-2">{formatNumber(row.count)}</td>
                    <td className="py-2">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="articles" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">أداء المقالات</h2>
          <p className="mt-1 text-sm text-slate-500">
            المنشور {formatNumber(publishedCount)}. وصلته زيارة: {formatNumber(visitedArticles.length)}. بلا زيارة: {formatNumber(quiet)}.
          </p>
          {topArticle ? <p className="mt-2 text-sm">أعلى مقال: {topArticle.title}</p> : <p className="mt-2 text-sm">لا مقال استقبل زيارة في هذه الفترة.</p>}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">المقال</th>
                  <th className="py-2 font-medium">التصنيف</th>
                  <th className="py-2 font-medium">آخر تحديث</th>
                  <th className="py-2 font-medium">الزيارات</th>
                  <th className="py-2 font-medium">الزوار</th>
                </tr>
              </thead>
              <tbody>
                {visitedArticles.slice(0, 40).map((row) => (
                  <tr key={row.path} className="border-b border-slate-100">
                    <td className="py-2">
                      {row.title}
                      <span className="mt-1 block text-slate-500">{row.path}</span>
                    </td>
                    <td className="py-2">{row.category}</td>
                    <td className="py-2">{row.published}</td>
                    <td className="py-2">{formatNumber(row.visits)}</td>
                    <td className="py-2">{formatNumber(row.visitors)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="search" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">Google Search</h2>
          <p className="mt-1 text-sm text-slate-500">
            نقرات وظهور بحث جوجل للفترة {searchLabel}. Search Console يتأخر نحو ثلاثة أيام، لذلك «اليوم» هنا آخر يوم نشرته جوجل.
          </p>
          <p className="mt-2 text-sm">
            الحالة: {sourceLabel(gsc.status)}. آخر مزامنة ناجحة: {syncTime(gsc.status)}.
          </p>
          {gsc.status.state === "not_connected" ? (
            <p className="mt-4 text-sm">غير مربوط. أضف GSC_SITE_URL وحساب الخدمة في بيئة السيرفر، وامنح الحساب صلاحية قراءة على خاصية Search Console.</p>
          ) : null}
          {gsc.status.state === "error" ? <p className="mt-4 text-sm text-red-800">{gsc.status.message}</p> : null}
          {gscData ? (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4">
                  <p className="text-sm text-slate-500">النقرات</p>
                  <p className="mt-2 text-2xl font-bold text-[#1e3a8a]">{formatNumber(gscData.totals.clicks)}</p>
                </article>
                <article className="border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4">
                  <p className="text-sm text-slate-500">الظهور</p>
                  <p className="mt-2 text-2xl font-bold text-[#1e3a8a]">{formatNumber(gscData.totals.impressions)}</p>
                </article>
                <article className="border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4">
                  <p className="text-sm text-slate-500">نسبة النقر</p>
                  <p className="mt-2 text-2xl font-bold text-[#1e3a8a]">{formatPercent(gscData.totals.ctr)}</p>
                </article>
                <article className="border border-slate-200 border-t-2 border-t-[#1d4ed8] bg-white p-4">
                  <p className="text-sm text-slate-500">متوسط الترتيب</p>
                  <p className="mt-2 text-2xl font-bold text-[#1e3a8a]">{formatPosition(gscData.totals.position)}</p>
                </article>
              </div>
              <QueryTable title="أهم عبارات البحث" rows={gscData.queries} mode="query" />
              <QueryTable title="أعلى الصفحات من بحث جوجل" rows={gscData.pages} mode="page" />
              <QueryTable title="أعلى الدول" rows={gscData.countries} mode="country" />
            </>
          ) : null}
        </section>

        <section id="crawlers" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">الزحف</h2>
          <p className="mt-1 text-sm text-slate-500">
            طلبات الزحف من سجل السيرفر: {formatNumber(report.crawlerTotal)}. Googlebot وGoogle Inspection هنا زحف، وليسا نقرات البحث.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">العنكبوت</th>
                  <th className="py-2 font-medium">الطلبات</th>
                  <th className="py-2 font-medium">آخر زيارة</th>
                  <th className="py-2 font-medium">أعلى عنوان</th>
                </tr>
              </thead>
              <tbody>
                {report.crawlers.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{formatNumber(row.count)}</td>
                    <td className="py-2">{row.lastVisit || "—"}</td>
                    <td className="py-2 break-all">{row.topUrl || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 font-semibold text-[#1e3a8a]">آخر طلبات الزحف</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">العنكبوت</th>
                  <th className="py-2 font-medium">العنوان</th>
                  <th className="py-2 font-medium">الحالة</th>
                  <th className="py-2 font-medium">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {report.crawlUrls.length === 0 ? (
                  <tr>
                    <td className="py-3 text-slate-500" colSpan={4}>
                      لا طلبات زحف في هذه الفترة.
                    </td>
                  </tr>
                ) : (
                  report.crawlUrls.map((row, index) => (
                    <tr key={`${row.time}-${row.bot}-${index}`} className="border-b border-slate-100">
                      <td className="py-2">{row.bot}</td>
                      <td className="py-2 break-all">{row.url}</td>
                      <td className="py-2">{row.status == null ? "—" : row.status}</td>
                      <td className="py-2">{row.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="health" className="mt-10">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">حالة الردود والسرعة</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="200" value={report.http.ok} />
            <Metric label="301 / 308" value={report.http.redirects} />
            <Metric label="404" value={report.http.notFound} />
            <Metric label="5xx" value={report.http.serverError} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <article className="border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">سلاسل التحويل / الحلقات</p>
              <p className="mt-2 font-semibold text-[#1e3a8a]">
                {formatNumber(report.redirects.chains)} / {formatNumber(report.redirects.loops)}
              </p>
            </article>
            <article className="border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">سرعة صفحات HTML</p>
              <p className="mt-2 font-semibold text-[#1e3a8a]">
                المتوسط {report.performance.avgMs == null ? "—" : `${formatNumber(report.performance.avgMs)} مللي ثانية`} · P95{" "}
                {report.performance.p95Ms == null ? "—" : `${formatNumber(report.performance.p95Ms)} مللي ثانية`} · العينات {formatNumber(report.performance.samples)}
              </p>
            </article>
          </div>
          <h3 className="mt-6 font-semibold text-[#1e3a8a]">عناوين 404</h3>
          {report.http.notFoundUrls.length === 0 ? (
            <p className="mt-2 text-sm">لا ردود 404 في هذه الفترة.</p>
          ) : (
            <table className="mt-2 w-full text-start text-sm">
              <tbody>
                {report.http.notFoundUrls.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2 break-all">{row.label}</td>
                    <td className="py-2">{formatNumber(row.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section id="audience" className="mt-10 mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a]">الدول</h2>
          <p className="mt-1 text-sm text-slate-500">
            الأردن: {formatNumber(report.jordanVisitors)} زائر. الدول العربية معاً: {formatNumber(report.arabVisitors)}.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-start text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">الدولة</th>
                  <th className="py-2 font-medium">الزوار</th>
                  <th className="py-2 font-medium">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {report.countries.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{formatNumber(row.count)}</td>
                    <td className="py-2">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
