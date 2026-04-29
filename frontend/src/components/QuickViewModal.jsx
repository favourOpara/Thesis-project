import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

const ChevronIcon = ({ dir }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left"
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

const QuickViewModal = ({ product, onClose }) => {
  const allImages = [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...(product.images?.map(i => i.image_url) || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const images = allImages.length > 0 ? allImages : ["/OIP.png"];
  const [activeImg, setActiveImg] = useState(0);

  const hasStock = product.quantity !== undefined && product.quantity !== null;
  const inStock = product.quantity > 0;
  const categoryLabel = product.sub_category || product.category;

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg(i => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg(i => (i + 1) % images.length);
  };

  return createPortal(
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* X close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px",
            width: "32px", height: "32px",
            background: "#f1f5f9", border: "none", borderRadius: "50%",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", color: "#64748b", zIndex: 2,
            fontWeight: 300, lineHeight: 1,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
          aria-label="Close quick view"
        >
          ×
        </button>

        {/* ── Left: Image panel ── */}
        <div style={{
          flex: "0 0 280px",
          minWidth: "240px",
          background: "#f8fafc",
          borderRadius: "18px 0 0 18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Main image with prev/next arrows */}
          <div style={{ position: "relative", height: "280px", overflow: "hidden", flexShrink: 0 }}>
            <img
              src={images[activeImg]}
              alt={product.name}
              onError={e => { e.target.src = "/OIP.png"; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.2s" }}
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImg} style={{
                  position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  <ChevronIcon dir="left" />
                </button>
                <button onClick={nextImg} style={{
                  position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  <ChevronIcon dir="right" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "6px", padding: "10px 10px 12px", flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: "44px", height: "44px", borderRadius: "8px",
                    overflow: "hidden", cursor: "pointer", flexShrink: 0,
                    border: i === activeImg ? "2px solid #2563eb" : "2px solid transparent",
                    transition: "border-color 0.15s",
                  }}
                >
                  <img
                    src={img} alt=""
                    onError={e => { e.target.src = "/OIP.png"; }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Info panel ── */}
        <div style={{
          flex: 1,
          minWidth: "200px",
          padding: "28px 36px 28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          {/* Category pill */}
          {categoryLabel && (
            <div style={{
              display: "inline-block", alignSelf: "flex-start",
              background: "#f1f5f9", color: "#64748b",
              borderRadius: "999px", padding: "3px 12px",
              fontSize: "11px", fontWeight: 600,
            }}>
              {categoryLabel}
            </div>
          )}

          {/* Name */}
          <h3 style={{
            fontWeight: 800, fontSize: "17px", color: "#0f172a",
            margin: 0, lineHeight: 1.35,
          }}>
            {product.name}
          </h3>

          {/* Price */}
          <div style={{ fontWeight: 800, fontSize: "22px", color: "#2563eb" }}>
            {product.price ? fmtPrice(product.price) : "N/A"}
          </div>

          {/* Stock badge */}
          {hasStock && (
            <div>
              {inStock ? (
                <span style={{
                  fontSize: "12px", color: "#16a34a", fontWeight: 600,
                  background: "#dcfce7", padding: "4px 12px", borderRadius: "999px",
                }}>
                  ✓ In stock
                </span>
              ) : (
                <span style={{
                  fontSize: "12px", color: "#b91c1c", fontWeight: 600,
                  background: "#fee2e2", padding: "4px 12px", borderRadius: "999px",
                }}>
                  Out of stock
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p style={{
              fontSize: "13px", color: "#64748b",
              lineHeight: 1.65, margin: 0,
            }}>
              {product.description.length > 220
                ? product.description.slice(0, 220) + "…"
                : product.description}
            </p>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* CTA */}
          <Link
            to={`/product/${product.id}`}
            onClick={onClose}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px",
              background: "#0f172a", color: "#fff",
              padding: "12px 22px", borderRadius: "10px",
              fontWeight: 700, fontSize: "13.5px",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; }}
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QuickViewModal;
