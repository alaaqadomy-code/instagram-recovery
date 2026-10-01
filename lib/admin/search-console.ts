import { articleRedirects } from "@/lib/article-redirects";
import { cached, REPORT_TTL_MS } from "@/lib/admin/cache";
import { googleJson, googleServiceAccount } from "@/lib/admin/google-auth";
import type { DateWindow } from "@/lib/admin/ranges";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export type SourceState =
  | { state: "not_connected" }
  | { state: "error"; message: string; refreshedAt?: string }
  | { state: "ok"; refreshedAt: string };

export type QueryRow = {
  query: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type Opportunity = QueryRow & { suggestedAction: string; rule: string };

type AnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type AnalyticsResponse = { rows?: AnalyticsRow[] };

export type GscData = {
  status: SourceState;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  queries: QueryRow[];
  pages: QueryRow[];
  countries: QueryRow[];
  zeroClickQueries: QueryRow[];
  zeroClickPages: QueryRow[];
  opportunities: Opportunity[];
  sitemapSubmitted: string | null;
  sitemapStatus: string | null;
  indexedFromSitemap: number | null;
};

function siteUrl(): string {
  return process.env.GSC_SITE_URL?.trim() ?? "";
}

export function gscConfigured(): boolean {
  const site = siteUrl();
  return Boolean(googleServiceAccount() && (site.startsWith("sc-domain:") || site.startsWith("https://")));
}

const countryName: Record<string, string> = {
  sau: "السعودية",
  are: "الإمارات",
  jor: "الأردن",
  egy: "مصر",
  kwt: "الكويت",
  qat: "قطر",
  bhr: "البحرين",
  omn: "عُمان",
  irq: "العراق",
  mar: "المغرب",
  dza: "الجزائر",
  tun: "تونس",
  lby: "ليبيا",
  yem: "اليمن",
  pse: "فلسطين",
  lbn: "لبنان",
  syr: "سوريا",
  sdn: "السودان",
  usa: "الولايات المتحدة",
  gbr: "بريطانيا",
  deu: "ألمانيا",
  fra: "فرنسا",
  tur: "تركيا",
  ind: "الهند",
};

const legacyRedirects = [
  "/articles/istirja-instagram-android-iphone",
  "/blog/istirja-instagram-android-iphone",
  "/articles/hisab-muattal-huquq-nashr",
  "/blog/hisab-muattal-huquq-nashr",
  "/articles/baad-al-hasr-madha-tafal",
  "/blog/baad-al-hasr-madha-tafal",
];

const redirectedPaths = new Set([
  ...articleRedirects.flatMap((item) => [item.source, item.source.replace("/articles/", "/blog/")]),
  ...legacyRedirects,
]);

function toRow(row: AnalyticsRow): QueryRow {
  return {
    query: row.keys?.[0] ?? "",
    page: row.keys?.[0],
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

function byImpressions(rows: QueryRow[]): QueryRow[] {
  return [...rows].sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks).slice(0, 25);
}

function countryLabel(code: string): string {
  const name = countryName[code.toLowerCase()];
  const upper = code.toUpperCase();
  return name ? `${name} (${upper})` : upper;
}

function isRedirectedPage(url: string): boolean {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "") || "/";
    return redirectedPaths.has(path);
  } catch {
    return false;
  }
}

async function query(window: Pick<DateWindow, "start" | "end">, dimensions: string[]): Promise<QueryRow[]> {
  const encoded = encodeURIComponent(siteUrl());
  const response = await googleJson<AnalyticsResponse>(
    `https://www.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    SCOPE,
    {
      method: "POST",
      body: JSON.stringify({
        startDate: window.start,
        endDate: window.end,
        dimensions,
        rowLimit: 50,
      }),
    },
  );
  return (response.rows ?? []).map((row) => toRow(row));
}

async function siteTotals(window: Pick<DateWindow, "start" | "end">): Promise<AnalyticsRow> {
  const encoded = encodeURIComponent(siteUrl());
  const response = await googleJson<AnalyticsResponse>(
    `https://www.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    SCOPE,
    {
      method: "POST",
      body: JSON.stringify({ startDate: window.start, endDate: window.end, rowLimit: 1 }),
    },
  );
  return response.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

async function loadGsc(window: DateWindow): Promise<GscData> {
  const [currentQuery, currentPage, currentCountry, totalRow] = await Promise.all([
    query(window, ["query"]),
    query(window, ["page"]),
    query(window, ["country"]),
    siteTotals(window),
  ]);
  const queries = byImpressions(currentQuery);
  const pages = byImpressions(
    currentPage
      .filter((row) => row.page && !isRedirectedPage(row.page))
      .map((row) => ({ ...row, query: row.page ?? "", page: row.page })),
  );
  const countries = byImpressions(currentCountry.map((row) => ({ ...row, query: countryLabel(row.query) })));
  return {
    status: { state: "ok", refreshedAt: new Date().toISOString() },
    totals: {
      clicks: totalRow.clicks ?? 0,
      impressions: totalRow.impressions ?? 0,
      ctr: totalRow.ctr ?? 0,
      position: totalRow.position ?? 0,
    },
    queries,
    pages,
    countries,
    zeroClickQueries: [],
    zeroClickPages: [],
    opportunities: [],
    sitemapSubmitted: null,
    sitemapStatus: null,
    indexedFromSitemap: null,
  };
}

const lastGood = new Map<string, GscData>();

export async function getGsc(window: DateWindow): Promise<GscData | { status: SourceState }> {
  if (!gscConfigured()) return { status: { state: "not_connected" } };
  const key = `gsc:${siteUrl()}:${window.start}:${window.end}`;
  try {
    const data = await cached(key, REPORT_TTL_MS, () => loadGsc(window));
    lastGood.set(key, data);
    return data;
  } catch {
    const previous = lastGood.get(key);
    const refreshedAt = previous?.status.state === "ok" ? previous.status.refreshedAt : undefined;
    if (previous && refreshedAt) {
      return {
        ...previous,
        status: {
          state: "error",
          message: "بحث جوجل غير متاح مؤقتاً. الأرقام أدناه من آخر جلب ناجح.",
          refreshedAt,
        },
      };
    }
    return { status: { state: "error", message: "بحث جوجل غير متاح مؤقتاً." } };
  }
}
