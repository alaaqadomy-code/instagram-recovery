export const ADMIN_COOKIE: string;

export type RangeKey = "today" | "7" | "30";

export type StatRow = {
  label: string;
  count: number;
  percent: number;
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
  crawlers: StatRow[];
};

export function track(req: unknown, res: unknown, rawUrl: string): void;
export function getDashboard(rangeInput?: string): Dashboard;
export function createSession(password: string, ip: string): string;
export function readSession(token: string): boolean;
export function destroySession(token: string): void;
