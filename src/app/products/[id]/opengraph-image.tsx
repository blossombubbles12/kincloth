import { ImageResponse } from "next/og";
import { getProductById } from "@/app/actions";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  const name = product?.name ?? "Premium Product";
  const price = product?.price ?? 0;
  const image = product?.thumbnail_url ?? null;

  return new ImageResponse(
    (
      <div style={{
        height: "100%", width: "100%", display: "flex",
        background: "#0a0a0a", fontFamily: "system-ui, sans-serif",
        position: "relative", overflow: "hidden",
      }}>
        {/* Left: Product image */}
        {image && (
          <div style={{
            width: "48%", height: "100%", position: "relative",
            background: "#111",
          }}>
            <img src={image} alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
            />
            {/* Gradient fade to right */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, transparent 60%, #0a0a0a 100%)",
            }} />
          </div>
        )}

        {/* Right: Product info */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "48px 56px",
          position: "relative",
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: -100, right: -100,
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>SC</span>
            </div>
            <span style={{ color: "#71717a", fontSize: 16, fontWeight: 700, letterSpacing: "-0.5px" }}>
              SCROLLCOMMERCE
            </span>
          </div>

          {/* Badge */}
          <div style={{
            display: "flex", width: "fit-content",
            padding: "6px 16px", borderRadius: 100, marginBottom: 20,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
          }}>
            <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Premium Product
            </span>
          </div>

          {/* Product name */}
          <h1 style={{
            fontSize: name.length > 30 ? 36 : 44, fontWeight: 900,
            color: "#ffffff", margin: "0 0 20px",
            lineHeight: 1.1, letterSpacing: "-1.5px",
          }}>
            {name}
          </h1>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: "#ffffff" }}>
              ${price.toFixed(2)}
            </span>
            <div style={{
              padding: "4px 12px", borderRadius: 8,
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
            }}>
              <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 900 }}>IN STOCK</span>
            </div>
          </div>

          {/* CTA hint */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 24px", borderRadius: 16, width: "fit-content",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 900, letterSpacing: "0.05em" }}>
              SHOP NOW →
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
