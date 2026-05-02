import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

const fmtDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
};

const ChevronIcon = ({ dir }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left"
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

/* Prevent wheel events on modal from reaching the body */
const stopWheelProp = (e) => e.stopPropagation();

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isSeller = user?.user_type === "seller";
  const [adding, setAdding] = useState(false);

  const allImages = [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...(product.images?.map(i => i.image_url) || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const images = allImages.length > 0 ? allImages : ["/OIP.png"];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const hasVariants = product.variants?.length > 0;
  const categoryLabel = product.sub_category || product.category;

  // Available qty for the selected size, or total if no variants
  const availableQty = hasVariants
    ? (selectedSize ? (product.variants.find(v => v.size === selectedSize)?.qty || 0) : 0)
    : (product.quantity || 0);
  const inStock = hasVariants ? product.quantity > 0 : product.quantity > 0;

  const handleSizeSelect = (size) => {
    setSelectedSize(prev => prev === size ? null : size);
  };

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
    <>
      {/* Inject responsive CSS once */}
      <style>{`
        .qv-overlay {
          position: fixed !important;
          inset: 0 !important;
          background: rgba(0,0,0,0.58);
          z-index: 10000;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px;
          backdrop-filter: blur(3px);
          overflow: hidden !important;
        }
        .qv-modal {
          background: #fff;
          border-radius: 18px;
          width: 100% !important;
          max-width: 780px !important;
          height: 86vh !important;
          max-height: 700px !important;
          min-height: 0 !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: row !important;
          flex-shrink: 0;
          box-shadow: 0 28px 90px rgba(0,0,0,0.28);
          position: relative;
        }
        .qv-img-panel {
          flex: 0 0 42% !important;
          width: 42% !important;
          min-width: 0 !important;
          min-height: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          background: #f1f5f9;
          overflow: hidden !important;
        }
        .qv-main-img {
          flex: 1 1 0 !important;
          min-height: 0 !important;
          height: 0 !important;
          position: relative;
          overflow: hidden !important;
        }
        .qv-main-img img {
          width: 100%;
          height: 100% !important;
          object-fit: cover;
          display: block;
        }
        .qv-thumb-strip {
          flex-shrink: 0 !important;
          display: flex;
          gap: 6px;
          padding: 8px 10px;
          background: #f1f5f9;
          flex-wrap: wrap;
          max-height: 68px;
          overflow: hidden;
        }
        .qv-info-panel {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          height: 0 !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          padding: 28px 28px 28px 24px;
          display: flex !important;
          flex-direction: column !important;
          gap: 0;
        }
        .qv-info-panel::-webkit-scrollbar {
          width: 4px;
        }
        .qv-info-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .qv-info-panel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .qv-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          background: rgba(241,245,249,0.95);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #64748b;
          z-index: 3;
          font-weight: 300;
          line-height: 1;
          transition: background 0.15s;
        }
        .qv-close-btn:hover {
          background: #e2e8f0;
        }
        .qv-char-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          align-items: flex-start;
          gap: 8px;
        }
        .qv-char-label {
          flex: 0 0 110px;
          color: #94a3b8;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          padding-top: 1px;
        }
        .qv-char-value {
          flex: 1;
          color: #1e293b;
          font-weight: 500;
          line-height: 1.5;
        }
        @media (max-width: 600px) {
          .qv-overlay {
            padding: 0 !important;
            align-items: flex-end !important;
          }
          .qv-modal {
            flex-direction: column !important;
            width: 100% !important;
            height: 92vh !important;
            max-height: 92vh !important;
            min-height: 92vh !important;
            border-radius: 18px 18px 0 0 !important;
          }
          .qv-img-panel {
            flex: 0 0 200px !important;
            width: 100% !important;
            min-height: 0 !important;
            height: 200px !important;
            max-height: 200px !important;
          }
          .qv-main-img {
            flex: 1 1 0 !important;
            height: 0 !important;
            min-height: 0 !important;
          }
          .qv-info-panel {
            flex: 1 1 0 !important;
            min-height: 0 !important;
            height: 0 !important;
            padding: 16px 18px 24px !important;
          }
          .qv-char-label {
            flex: 0 0 90px;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="qv-overlay" onClick={onClose}>
        {/* Modal */}
        <div className="qv-modal" onClick={e => e.stopPropagation()} onWheel={stopWheelProp}>

          {/* X button */}
          <button className="qv-close-btn" onClick={onClose} aria-label="Close">×</button>

          {/* ── Image panel ── */}
          <div className="qv-img-panel">
            {/* Main image — fills all remaining height */}
            <div className="qv-main-img">
              <img
                src={images[activeImg]}
                alt={product.name}
                onError={e => { e.target.src = "/OIP.png"; }}
              />
              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} style={{
                    position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 1,
                  }}>
                    <ChevronIcon dir="left" />
                  </button>
                  <button onClick={nextImg} style={{
                    position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 1,
                  }}>
                    <ChevronIcon dir="right" />
                  </button>
                  {/* Dot indicators */}
                  <div style={{
                    position: "absolute", bottom: "8px", left: 0, right: 0,
                    display: "flex", justifyContent: "center", gap: "5px",
                  }}>
                    {images.map((_, i) => (
                      <div key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); }} style={{
                        width: i === activeImg ? "18px" : "6px",
                        height: "6px", borderRadius: "3px",
                        background: i === activeImg ? "#fff" : "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="qv-thumb-strip">
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    width: "44px", height: "44px", borderRadius: "8px",
                    overflow: "hidden", cursor: "pointer", flexShrink: 0,
                    border: i === activeImg ? "2px solid #2563eb" : "2px solid transparent",
                    transition: "border-color 0.15s",
                  }}>
                    <img src={img} alt="" onError={e => { e.target.src = "/OIP.png"; }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel (scrollable) ── */}
          <div className="qv-info-panel">

            {/* Category pill */}
            {categoryLabel && (
              <div style={{
                display: "inline-block", alignSelf: "flex-start",
                background: "#f1f5f9", color: "#64748b",
                borderRadius: "999px", padding: "3px 12px",
                fontSize: "11px", fontWeight: 600,
                marginBottom: "10px",
              }}>
                {categoryLabel}
              </div>
            )}

            {/* Name */}
            <h3 style={{
              fontWeight: 800, fontSize: "18px", color: "#0f172a",
              margin: "0 0 10px", lineHeight: 1.35,
              paddingRight: "32px", /* avoid overlap with X button */
            }}>
              {product.name}
            </h3>

            {/* Price */}
            <div style={{ fontWeight: 800, fontSize: "24px", color: "#2563eb", marginBottom: "10px" }}>
              {product.price ? fmtPrice(product.price) : "N/A"}
            </div>

            {/* Stock */}
            <div style={{ marginBottom: "18px" }}>
              {inStock ? (
                <span style={{
                  fontSize: "12px", color: "#16a34a", fontWeight: 600,
                  background: "#dcfce7", padding: "4px 12px", borderRadius: "999px",
                }}>
                  {hasVariants
                    ? `✓ ${product.quantity} units · ${product.variants.filter(v => v.qty > 0).length} sizes available`
                    : `✓ In stock (${product.quantity} available)`}
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

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{
                  fontSize: "12px", fontWeight: 700, color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px",
                }}>
                  Description
                </p>
                <p style={{
                  fontSize: "13.5px", color: "#334155", lineHeight: 1.7, margin: 0,
                }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Characteristics */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{
                fontSize: "12px", fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px",
              }}>
                Product Details
              </p>

              {product.category && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Category</span>
                  <span className="qv-char-value">{product.category}</span>
                </div>
              )}

              {product.sub_category && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Sub-category</span>
                  <span className="qv-char-value">{product.sub_category}</span>
                </div>
              )}

              {product.brand && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Brand</span>
                  <span className="qv-char-value">{product.brand}</span>
                </div>
              )}

              {product.material_type && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Material</span>
                  <span className="qv-char-value">{product.material_type}</span>
                </div>
              )}

              {/* Extra fields (category-specific: storage, RAM, condition, etc.) */}
              {product.extra_fields && Object.keys(product.extra_fields).length > 0 &&
                Object.entries(product.extra_fields).map(([k, v]) => (
                  <div key={k} className="qv-char-row">
                    <span className="qv-char-label">{k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                    <span className="qv-char-value">{String(v)}</span>
                  </div>
                ))
              }

              {product.is_featured && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Status</span>
                  <span className="qv-char-value" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{
                      background: "#fef3c7", color: "#92400e",
                      padding: "2px 9px", borderRadius: "999px",
                      fontSize: "12px", fontWeight: 600,
                    }}>
                      ★ Featured
                    </span>
                  </span>
                </div>
              )}

              {product.created_at && (
                <div className="qv-char-row">
                  <span className="qv-char-label">Date listed</span>
                  <span className="qv-char-value">{fmtDate(product.created_at)}</span>
                </div>
              )}
            </div>

            {/* Size selector + action buttons — buyers only */}
            {!isSeller && (
              <>
                {/* Size selector (variants) */}
                {hasVariants && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>
                      Select Size{selectedSize && <span style={{ color: "#2563eb" }}> — {selectedSize}</span>}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                      {product.variants.map(v => {
                        const oos = v.qty === 0;
                        const sel = selectedSize === v.size;
                        return (
                          <button
                            key={v.size}
                            onClick={() => !oos && handleSizeSelect(v.size)}
                            disabled={oos}
                            style={{
                              padding: "6px 14px",
                              border: sel ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                              background: oos ? "#f8fafc" : sel ? "#eff6ff" : "#fff",
                              color: oos ? "#cbd5e1" : sel ? "#2563eb" : "#374151",
                              borderRadius: "8px", fontWeight: 600, fontSize: "13px",
                              cursor: oos ? "not-allowed" : "pointer",
                              textDecoration: oos ? "line-through" : "none",
                            }}
                            title={oos ? "Out of stock" : `${v.qty} in stock`}
                          >
                            {v.size}
                            {!oos && <span style={{ display: "block", fontSize: "10px", color: sel ? "#3b82f6" : "#94a3b8", marginTop: "1px" }}>{v.qty} left</span>}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedSize && (
                      <p style={{ fontSize: "11px", color: "#f97316", margin: "6px 0 0" }}>Please select a size to add to cart</p>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                  {/* Add to Cart */}
                  <button
                    disabled={adding || availableQty === 0 || (hasVariants && !selectedSize)}
                    onClick={async () => {
                      setAdding(true);
                      try {
                        await addToCart(product.id, 1, product);
                        onClose();
                        navigate("/cart/added", { state: { product } });
                      } catch {
                        toast.error("Could not add to cart.");
                        setAdding(false);
                      }
                    }}
                    style={{
                      flex: 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                      padding: "12px 10px", borderRadius: "10px",
                      background: (availableQty === 0 || (hasVariants && !selectedSize)) ? "#94a3b8" : "#2563eb",
                      color: "#fff", border: "none",
                      fontWeight: 700, fontSize: "13px",
                      cursor: (availableQty === 0 || (hasVariants && !selectedSize)) ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                      opacity: adding ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (availableQty > 0 && !adding) e.currentTarget.style.background = "#1d4ed8"; }}
                    onMouseLeave={e => { if (availableQty > 0) e.currentTarget.style.background = "#2563eb"; }}
                  >
                    <CartIcon />
                    {availableQty === 0 ? "Out of Stock" : (hasVariants && !selectedSize) ? "Select a Size" : adding ? "Adding…" : "Add to Cart"}
                  </button>

                  {/* Buy Now */}
                  {availableQty > 0 && (!hasVariants || selectedSize) && (
                    <button
                      disabled={adding}
                      onClick={async () => {
                        setAdding(true);
                        try {
                          await addToCart(product.id, 1, product);
                          onClose();
                          navigate("/cart");
                        } catch {
                          toast.error("Could not add to cart.");
                        } finally {
                          setAdding(false);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "12px 10px", borderRadius: "10px",
                        background: "#0f172a", color: "#fff", border: "none",
                        fontWeight: 700, fontSize: "13px",
                        cursor: "pointer", transition: "background 0.15s",
                        opacity: adding ? 0.7 : 1,
                      }}
                      onMouseEnter={e => { if (!adding) e.currentTarget.style.background = "#1e293b"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; }}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </>
            )}

            {/* View full page link */}
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              style={{
                display: "block", textAlign: "center",
                color: "#64748b", fontSize: "12.5px", fontWeight: 600,
                textDecoration: "none", marginTop: "10px",
                paddingTop: "10px", borderTop: "1px solid #f1f5f9",
              }}
            >
              View Full Product Page →
            </Link>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default QuickViewModal;
