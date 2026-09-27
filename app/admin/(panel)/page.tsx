import { getDashboard, type RangeKey } from "@/lib/analytics.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ranges: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7", label: "7 Days" },
  { key: "30", label: "30 Days" },
];

function rangeLabel(range: RangeKey) {
  if (range === "today") return "Today";
  if (range === "30") return "30 Days";
  return "7 Days";
}

function Bars({ points }: { points: { label: string; visits: number }[] }) {
  const max = Math.max(1, ...points.map((point) => point.visits));
  return (
    <div className="flex h-48 items-end gap-1">
      {points.map((point) => (
        <div key={point.label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
          <div
            className="rounded-t bg-[#1d4ed8]"
            style={{ height: `${Math.max(point.visits ? 4 : 0, (point.visits / max) * 100)}%` }}
            title={`${point.label}: ${point.visits}`}
          />
          <span className="mt-1 truncate text-center text-[10px] text-slate-500">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: [string, string, string];
  rows: { label: string; count: number; percent: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="py-2 font-semibold">{headers[0]}</th>
            <th className="py-2 font-semibold">{headers[1]}</th>
            <th className="py-2 text-right font-semibold">{headers[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="py-4 text-slate-500" colSpan={3}>
                No visits in this range.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100">
                <td className="py-2.5 font-semibold">{row.label}</td>
                <td className="py-2.5">{row.count}</td>
                <td className="py-2.5 text-right">{row.percent}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const query = await searchParams;
  const data = getDashboard(query.range);
  const cards = [
    { label: "Visitors Today", value: data.visitorsToday },
    { label: "Visitors 7 Days", value: data.visitors7 },
    { label: "Visitors 30 Days", value: data.visitors30 },
    { label: "Live Now", value: data.live },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Unlock Accounts</p>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
        </div>
        <a className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold" href="/admin/logout">
          Log out
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{card.value}</p>
            {card.label === "Live Now" ? <p className="mt-1 text-xs text-slate-500">Active in the last 2 minutes</p> : null}
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Visitors</h2>
          <p className="text-sm text-slate-500">Total visits: {data.totalVisits}</p>
        </div>
        <dl className="mt-4 divide-y divide-slate-100 text-sm">
          {[
            ["Today", data.visitorsToday],
            ["Last 7 days", data.visitors7],
            ["Last 30 days", data.visitors30],
            ["Total visits", data.totalVisits],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <dt className="font-semibold">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Visits</h2>
          <div className="flex gap-2">
            {ranges.map((item) => (
              <a
                key={item.key}
                href={`/admin?range=${item.key}`}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${data.range === item.key ? "bg-[#1d4ed8] text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <Bars points={data.series} />
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold">Traffic Sources</h2>
          <p className="text-sm text-slate-500">{rangeLabel(data.range)}</p>
          <Table headers={["Source", "Visits", "%"]} rows={data.sources} />
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold">Countries</h2>
          <p className="text-sm text-slate-500">{rangeLabel(data.range)}</p>
          <Table headers={["Country", "Visitors", "%"]} rows={data.countries} />
        </section>
      </div>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold">Top Pages</h2>
        <p className="text-sm text-slate-500">{rangeLabel(data.range)}</p>
        <Table headers={["URL", "Visits", "%"]} rows={data.pages} />
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Crawlers</h2>
          <p className="text-sm text-slate-500">All crawler visits: {data.crawlerTotal}</p>
        </div>
        <dl className="mt-4 divide-y divide-slate-100 text-sm">
          {[
            ["Googlebot today", data.googlebotToday],
            ["Googlebot 7 days", data.googlebot7],
            ["Googlebot 30 days", data.googlebot30],
            ["Googlebot total", data.googlebotTotal],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <dt className="font-semibold">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4">
          <p className="text-sm text-slate-500">{rangeLabel(data.range)}</p>
          <Table headers={["Crawler", "Visits", "%"]} rows={data.crawlers} />
        </div>
      </section>
    </div>
  );
}
