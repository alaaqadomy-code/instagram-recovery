import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Instagram Account Recovery`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b1220",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#1d4ed8",
              color: "white",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            UA
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#e2e8f0" }}>
            Unlock Accounts
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15, color: "#f8fafc" }}>
            Instagram Account Recovery
          </div>
          <div style={{ fontSize: 30, color: "#94a3b8", fontWeight: 400 }}>
            Disabled · Hacked · Deleted · No password needed
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Disabled", "Hacked", "Deleted"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 22px",
                background: "rgba(29,78,216,0.25)",
                borderRadius: 10,
                border: "1px solid rgba(29,78,216,0.5)",
                color: "#93c5fd",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

export const dynamic = "force-static";
