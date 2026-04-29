import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const image =
    product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");
  const hasStock = product.quantity !== undefined && product.quantity !== null;
  const inStock = product.quantity > 0;
  const categoryLabel = product.sub_category || product.category;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", minWidth: 0, overflow: "hidden" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: 0,
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
          {/* Hover overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,23,42,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.22s",
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
          {/* Category tag */}
          {categoryLabel && (
            <div style={{
              position: "absolute", top: "8px", left: "8px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(6px)",
              borderRadius: "999px", padding: "2px 9px",
              fontSize: "10px", fontWeight: 600, color: "#374151",
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
            }}>
              ★ Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "10px 12px" }}>
          <p style={{
            fontWeight: 700, fontSize: "13px", color: "#0f172a",
            margin: "0 0 6px", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {product.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
            <span style={{ color: "#2563eb", fontWeight: 800, fontSize: "14px" }}>
              {product.price ? fmtPrice(product.price) : "N/A"}
            </span>
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
        </div>
      </div>
    </Link>
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
  }).isRequired,
};

export default ProductCard;
