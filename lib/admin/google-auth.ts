import { createSign } from "crypto";

type TokenCache = { token: string; expiresAt: number };
const tokens = new Map<string, TokenCache>();

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function googleServiceAccount(): { email: string; privateKey: string } | null {
  const email = env("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  if (!email || !privateKey.includes("BEGIN PRIVATE KEY")) return null;
  return { email, privateKey };
}

function base64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

export async function googleAccessToken(scope: string): Promise<string> {
  const account = googleServiceAccount();
  if (!account) throw new Error("missing-service-account");
  const cached = tokens.get(`${account.email}:${scope}`);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(
    JSON.stringify({
      iss: account.email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(account.privateKey).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`google-auth-${response.status}`);
  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("google-auth-empty");
  tokens.set(`${account.email}:${scope}`, {
    token: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  });
  return payload.access_token;
}

export async function googleJson<T>(url: string, scope: string, init?: RequestInit): Promise<T> {
  const token = await googleAccessToken(scope);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`google-${response.status}`);
  return (await response.json()) as T;
}
