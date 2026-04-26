import React from "react";
import { Link } from "react-router-dom";

const BANNER_GRADIENTS = [
  "linear-gradient(135deg,#3b7bf8,#7c3aed)",
  "linear-gradient(135deg,#0ea5e9,#2563eb)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#f97316,#eab308)",
];

const gradientFor = (name = "") =>
  BANNER_GRADIENTS[name.charCodeAt(0) % BANNER_GRADIENTS.length];

const ShopCard = ({ shop }) => {
  const previews = shop.preview_images || [];
  const categories = shop.categories || [];

  return (
    <Link
      to={`/shop/${shop.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.07)",
          border: "1px solid rgba(0,0,0,0.06)",
          transition: "transform 0.22s, box-shadow 0.22s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow =
            "0 16px 48px rgba(59,123,248,0.18), 0 2px 8px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.07)";
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: "80px",
            background: shop.banner_url
              ? `url(${shop.banner_url}) center/cover`
              : gradientFor(shop.name),
            flexShrink: 0,
          }}
        />

        {/* Avatar + name row */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginTop: "-26px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                border: "3px solid white",
                background: shop.logo_url ? "white" : "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 800,
                color: "#3b7bf8",
                boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {shop.logo_url ? (
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                shop.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Visit count badge aligned bottom of banner */}
            <div style={{ paddingBottom: "2px", marginLeft: "auto" }}>
              <span
                style={{
                  background: "rgba(0,0,0,0.07)",
                  borderRadius: "999px",
                  padding: "3px 9px",
                  fontSize: "11px",
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                {(shop.visit_count || 0).toLocaleString()} visits
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "10px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
          <h6
            style={{
              fontWeight: 700,
              fontSize: "15px",
              margin: "0 0 4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#111827",
            }}
          >
            {shop.name}
          </h6>

          {shop.description && (
            <p
              style={{
                fontSize: "12.5px",
                color: "#6b7280",
                margin: "0 0 10px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.55,
              }}
            >
              {shop.description}
            </p>
          )}

          {/* Category pills */}
          {categories.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
              {categories.map((cat, i) => (
                <span
                  key={i}
                  style={{
                    background: "#eff6ff",
                    color: "#3b7bf8",
                    borderRadius: "999px",
                    padding: "2px 9px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Product count */}
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
            {shop.product_count} product{shop.product_count !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Product thumbnail strip */}
        {previews.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${previews.length}, 1fr)`,
              height: "90px",
              borderTop: "1px solid #f3f4f6",
              overflow: "hidden",
            }}
          >
            {previews.map((img, i) => (
              <div
                key={i}
                style={{
                  background: `url(${img}) center/cover no-repeat #f8faff`,
                  borderLeft: i > 0 ? "1px solid #f3f4f6" : "none",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              height: "90px",
              borderTop: "1px solid #f3f4f6",
              background: "#f8faff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "12px", color: "#d1d5db" }}>No products yet</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ShopCard;
