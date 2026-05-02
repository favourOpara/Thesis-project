import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import QuickViewModal from "./QuickViewModal";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const image =
    product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");
  const hasStock = product.quantity !== undefined && product.quantity !== null;
  const inStock = product.quantity > 0;
  const categoryLabel = product.sub_category || product.category;

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "flex", minWidth: 0, height: "100%" }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            minWidth: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #f1f5f9",
            boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.05)",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
            cursor: "pointer",
          }}
        >
          {/* Image */}
          <div style={{
            position: "relative",
            height: "150px",
            overflow: "hidden",
            background: "#f8fafc",
            flexShrink: 0,
          }}>
            <img
              src={image}
              alt={product.name}
              onError={e => { e.target.src = "/OIP.png"; }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            />

            {/* Discount badge */}
            {product.discount_percentage > 0 && (
              <div style={{
                position: "absolute", top: "8px", left: "8px",
                background: "#ef4444", color: "#fff",
                fontSize: "10px", fontWeight: 700,
                padding: "2px 7px", borderRadius: "999px",
                letterSpacing: "0.2px",
              }}>
                -{product.discount_percentage}%
              </div>
            )}

            {/* Hover overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(15,23,42,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.22s",
              pointerEvents: hovered ? "auto" : "none",
            }}>
              <span style={{
                background: "white", color: "#0f172a",
                padding: "7px 16px", borderRadius: "999px",
                fontWeight: 700, fontSize: "12px",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                View Product <ArrowIcon />
              </span>
            </div>

            {/* Eye / Quick-view button — always visible, bottom-right of image */}
            <button
              onClick={openQuickView}
              title="Quick view"
              style={{
                position: "absolute", bottom: "8px", right: "8px",
                width: "30px", height: "30px",
                background: "rgba(255,255,255,0.95)",
                border: "none", borderRadius: "50%",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#374151",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 2,
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <EyeIcon />
            </button>

            {/* Category tag */}
            {categoryLabel && (
              <div style={{
                position: "absolute", top: "8px", left: "8px",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(6px)",
                borderRadius: "999px", padding: "2px 9px",
                fontSize: "10px", fontWeight: 600, color: "#374151",
                zIndex: 1,
              }}>
                {categoryLabel}
              </div>
            )}

            {/* Featured badge */}
            {product.is_featured && (
              <div style={{
                position: "absolute", top: "8px", right: "8px",
                background: "#f59e0b",
                borderRadius: "999px", padding: "2px 8px",
                fontSize: "10px", fontWeight: 700, color: "#fff",
                zIndex: 1,
              }}>
                ★ Featured
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "10px 12px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
            <p style={{
              fontWeight: 700, fontSize: "13px", color: "#0f172a",
              margin: "0 0 6px", lineHeight: 1.3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "34px",
            }}>
              {product.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {product.discounted_price ? (
                  <>
                    <span style={{ color: "#2563eb", fontWeight: 800, fontSize: "14px" }}>
                      {fmtPrice(product.discounted_price)}
                    </span>
                    <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "11px", textDecoration: "line-through" }}>
                      {fmtPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#2563eb", fontWeight: 800, fontSize: "14px" }}>
                    {product.price ? fmtPrice(product.price) : "N/A"}
                  </span>
                )}
              </div>
              {hasStock && (
                inStock ? (
                  <span style={{
                    fontSize: "10px", color: "#16a34a", fontWeight: 600,
                    background: "#dcfce7", padding: "2px 7px", borderRadius: "999px", whiteSpace: "nowrap",
                  }}>
                    In stock
                  </span>
                ) : (
                  <span style={{
                    fontSize: "10px", color: "#b91c1c", fontWeight: 600,
                    background: "#fee2e2", padding: "2px 7px", borderRadius: "999px", whiteSpace: "nowrap",
                  }}>
                    Sold out
                  </span>
                )
              )}
            </div>

            {/* Size chips — show available sizes at a glance */}
            {product.variants?.length > 0 && (
              <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "3px", alignItems: "center" }}>
                {product.variants.slice(0, 5).map(v => (
                  <span key={v.size} style={{
                    fontSize: "10px",
                    color: v.qty > 0 ? "#475569" : "#cbd5e1",
                    background: v.qty > 0 ? "#f1f5f9" : "#f8fafc",
                    padding: "1px 7px", borderRadius: "5px", fontWeight: 600,
                    textDecoration: v.qty === 0 ? "line-through" : "none",
                  }}>
                    {v.size}
                  </span>
                ))}
                {product.variants.length > 5 && (
                  <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>
                    +{product.variants.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Quick-view modal — rendered via portal outside the Link */}
      {quickView && (
        <QuickViewModal product={product} onClose={() => setQuickView(false)} />
      )}
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    main_image_url: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({ image_url: PropTypes.string })),
    quantity: PropTypes.number,
    is_featured: PropTypes.bool,
    sub_category: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
