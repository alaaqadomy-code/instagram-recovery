import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import {
  articles,
  articlePublicSlug,
  getArticleByPublicSlug,
} from "@/lib/articles";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: articlePublicSlug(article) }));
}

// Read TTF once per worker process at module init
let fontData: ArrayBuffer | null = null;
try {
  const buf = readFileSync(
    join(process.cwd(), "public", "fonts", "cairo-bold.ttf"),
  );
  fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
} catch {
  // font unavailable — will use English fallback
}

type Props = { params: Promise<{ slug: string }> };

export default async function ArticleOgImage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleByPublicSlug(slug);

  const title = article?.title ?? site.name;
  const description = article?.description?.slice(0, 80) ?? site.description;
  const category = article?.category ?? "";

  const arabicJsx = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: "#0b1220",
        color: "white",
        fontFamily: "Cairo",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "#1d4ed8",
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          UA
        </div>
        <span
          style={{ fontSize: 22, fontWeight: 700, color: "#93c5fd", fontFamily: "sans-serif" }}
        >
          {site.name}
        </span>
        {category ? (
          <span
            style={{
              marginRight: 8,
              padding: "4px 14px",
              background: "rgba(29,78,216,0.3)",
              border: "1px solid rgba(29,78,216,0.5)",
              borderRadius: 8,
              fontSize: 17,
              color: "#93c5fd",
              fontFamily: "Cairo",
            }}
          >
            {category}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: title.length > 30 ? 48 : 58,
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#f8fafc",
            direction: "rtl",
            fontFamily: "Cairo",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.55,
            direction: "rtl",
            maxWidth: 920,
            fontFamily: "Cairo",
          }}
        >
          {description}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#64748b",
          fontSize: 19,
          fontFamily: "sans-serif",
        }}
      >
        <span>unlockaccounts.com</span>
        <span>·</span>
        <span>Instagram Recovery</span>
      </div>
    </div>
  );

  const englishFallback = (
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
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#1d4ed8",
            color: "white",
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          UA
        </div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "#e2e8f0" }}>
          {site.name}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, color: "#f8fafc" }}>
          Instagram Account Recovery
        </div>
        <div style={{ fontSize: 26, color: "#94a3b8" }}>
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
  );

  if (!fontData) {
    return new ImageResponse(englishFallback, size);
  }

  try {
    const imgBuf = await new ImageResponse(arabicJsx, {
      ...size,
      fonts: [{ name: "Cairo", data: fontData, style: "normal", weight: 700 }],
    }).arrayBuffer();
    return new Response(imgBuf, { headers: { "Content-Type": "image/png" } });
  } catch {
    return new ImageResponse(englishFallback, size);
  }
}
