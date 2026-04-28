import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ScrollCommerce — Shop the Feed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "20%", left: "30%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
        }} />

        {/* Logo mark */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 80, height: 80, borderRadius: 20,
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          marginBottom: 32, boxShadow: "0 20px 60px rgba(124,58,237,0.5)",
        }}>
          <span style={{ color: "#fff", fontSize: 36, fontWeight: 900 }}>SC</span>
        </div>

        {/* Site name */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 0, marginBottom: 16 }}>
          <span style={{ fontSize: 64, fontWeight: 900, color: "#ffffff", letterSpacing: "-3px" }}>SCROLL</span>
          <span style={{ fontSize: 64, fontWeight: 900, color: "#71717a", letterSpacing: "-3px" }}>COMMERCE</span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 22, color: "rgba(255,255,255,0.6)",
          margin: 0, fontWeight: 500, letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Discover · Shop · Repeat
        </p>

        {/* Badges */}
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {["New Arrivals", "Free Shipping", "30-Day Returns"].map((b) => (
            <div key={b} style={{
              padding: "8px 20px", borderRadius: 100,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700,
            }}>
              {b}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
