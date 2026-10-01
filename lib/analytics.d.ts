export const ADMIN_COOKIE: string;

export type RangeKey = "today" | "7" | "30";

export type StatRow = {
  label: string;
  count: number;
  percent: number;
};

export type CrawlerStat = {
  label: string;
  count: number;
  lastVisit: string;
  topUrl: string;
};

export type CrawlUrl = {
  bot: string;
  url: string;
  status: number | null;
  time: string;
};

export type Dashboard = {
  visitorsToday: number;
  visitors7: number;
  visitors30: number;
  totalVisits: number;
  live: number;
  range: RangeKey;
  rangeVisits: number;
  series: { label: string; visits: number }[];
  sources: StatRow[];
  countries: StatRow[];
  pages: StatRow[];
  googlebotToday: number;
  googlebot7: number;
  googlebot30: number;
  googlebotTotal: number;
  crawlerTotal: number;
  crawlers: CrawlerStat[];
  crawlUrls: CrawlUrl[];
  http: {
    ok: number;
    redirects: number;
    notFound: number;
    serverError: number;
    notFoundUrls: StatRow[];
  };
  redirects: {
    moved: number;
    permanent: number;
    chains: number;
    loops: number;
  };
  performance: {
    avgMs: number | null;
    p95Ms: number | null;
    samples: number;
  };
};

export type ArticleHit = {
  path: string;
  visits: number;
  visitors: number;
};

export type AdminReport = Dashboard & {
  previousVisits: number;
  previousVisitors: number;
  articleHits: ArticleHit[];
  jordanVisitors: number;
  arabVisitors: number;
};

export function track(req: unknown, res: unknown, rawUrl: string): void;
export function getDashboard(rangeInput?: string): Dashboard;
export function getAdminReport(rangeInput?: string): AdminReport;
export function createSession(password: string, ip: string): string;
export function readSession(token: string): boolean;
export function destroySession(token: string): void;
