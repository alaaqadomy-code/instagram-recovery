import type { RangeKey } from "@/lib/analytics.js";

export const gscPeriods = [7, 28, 90] as const;
export type GscPeriod = (typeof gscPeriods)[number];

const SEARCH_LAG_DAYS = 3;

export type DateWindow = {
  label: string;
  start: string;
  end: string;
  previousStart: string;
  previousEnd: string;
};

function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseGscPeriod(value: string | undefined): GscPeriod {
  const parsed = Number(value);
  return gscPeriods.find((period) => period === parsed) ?? 28;
}

export function resolveSearchWindow(range: RangeKey, now = new Date()): DateWindow {
  const end = addDays(utcDay(now), -SEARCH_LAG_DAYS);
  const length = range === "30" ? 30 : range === "7" ? 7 : 1;
  const start = addDays(end, -(length - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(length - 1));
  const label = length === 1 ? `آخر يوم متاح: ${iso(end)}` : `من ${iso(start)} إلى ${iso(end)}`;
  return {
    label,
    start: iso(start),
    end: iso(end),
    previousStart: iso(previousStart),
    previousEnd: iso(previousEnd),
  };
}

export function resolveGscWindow(days: GscPeriod, now = new Date()): DateWindow {
  const today = utcDay(now);
  const start = addDays(today, -(days - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(days - 1));
  return {
    label: `آخر ${days} يوماً`,
    start: iso(start),
    end: iso(today),
    previousStart: iso(previousStart),
    previousEnd: iso(previousEnd),
  };
}
