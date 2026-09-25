import { ImageResponse } from "next/og";

export const alt = "استرجاع انستا — استرجاع حساب إنستغرام";
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
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b1220 0%, #1d4ed8 70%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 22,
            background: "white",
            color: "#1d4ed8",
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          RI
        </div>
        <div style={{ marginTop: 36, fontSize: 56, fontWeight: 800, lineHeight: 1.2 }}>Instarja</div>
        <div style={{ marginTop: 18, fontSize: 28, opacity: 0.92, maxWidth: 900 }}>
          Instagram account recovery — disabled, hacked, or deleted
        </div>
      </div>
    ),
    size,
  );
}
