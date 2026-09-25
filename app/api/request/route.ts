import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

type Payload = {
  username?: string;
  email?: string;
  phone?: string;
  issue?: string;
  details?: string;
  owner?: string;
};

const hits = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function persist(entry: unknown) {
  const dirs = [path.join(process.cwd(), "data"), path.join("/tmp", "instagram-recovery")];
  for (const dir of dirs) {
    try {
      await mkdir(dir, { recursive: true });
      const file = path.join(dir, "requests.json");
      let list: unknown[] = [];
      try {
        list = JSON.parse(await readFile(file, "utf8")) as unknown[];
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
      list.push(entry);
      await writeFile(file, JSON.stringify(list, null, 2), "utf8");
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const username = String(body.username || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const issue = String(body.issue || "").trim();
  const details = String(body.details || "").trim();

  if (!username || !email || !phone || !issue || !details || body.owner !== "yes") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || username.length > 80 || phone.length > 40 || details.length > 4000) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    username,
    email,
    phone,
    issue,
    details,
  };

  const saved = await persist(entry);
  if (!saved) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
