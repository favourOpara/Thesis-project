import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import InquiryModal from "../components/InquiryModal";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

/* ── Icons ── */
const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.528 5.847L0 24l6.335-1.507A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.592-.45-5.124-1.247L2 22l1.263-4.773A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);
const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const WebIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const MsgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PkgIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ── Product Card ── */
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const image = product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #f1f5f9",
          boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.05)",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#f8fafc" }}>
          <img
            src={image}
            alt={product.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
            onError={e => { e.target.src = "/OIP.png"; }}
          />
          {/* Hover overlay CTA */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.22s",
          }}>
            <span style={{
              background: "white", color: "#0f172a",
              padding: "8px 18px", borderRadius: "999px",
              fontWeight: 700, fontSize: "12.5px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              View Product <ArrowIcon />
            </span>
          </div>
          {/* Category tag */}
          {(product.sub_category || product.category) && (
            <div style={{
              position: "absolute", top: "10px", left: "10px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(6px)",
              borderRadius: "999px", padding: "3px 10px",
              fontSize: "11px", fontWeight: 600, color: "#374151",
            }}>
              {product.sub_category || product.category}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <p style={{
            fontWeight: 700, fontSize: "14px", color: "#0f172a",
            margin: "0 0 6px", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {product.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#2563eb", fontWeight: 800, fontSize: "15px" }}>
              {fmtPrice(product.price)}
            </span>
            {product.quantity > 0 ? (
              <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600, background: "#dcfce7", padding: "2px 8px", borderRadius: "999px" }}>
                In stock
              </span>
            ) : (
              <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: 600, background: "#fee2e2", padding: "2px 8px", borderRadius: "999px" }}>
                Sold out
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ── Main Component ── */
const ShopPage = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [shopRes, productsRes] = await Promise.all([
          axios.get(`${BASE}/api/shops/${slug}/`),
          axios.get(`${BASE}/api/shops/${slug}/products/`),
        ]);
        setShop(shopRes.data);
        setProducts(productsRes.data);
        axios.post(`${BASE}/api/shops/${slug}/visit/`).catch(() => {});
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  if (loading) return <Spinner />;

  if (notFound) return (
    <>
      <Header />
      <div style={{ textAlign: "center", paddingTop: "160px", paddingBottom: "80px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h3 style={{ fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Store not found</h3>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>This store doesn't exist or may have been removed.</p>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#2563eb", color: "#fff", padding: "12px 28px",
          borderRadius: "10px", fontWeight: 700, textDecoration: "none", fontSize: "14px",
        }}>
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );

  /* ── Derived data ── */
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const hasSocials = shop.whatsapp || shop.instagram || shop.website;
  const bannerBg = shop.banner_url
    ? { backgroundImage: `url(${shop.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)" };

  return (
    <>
      <Header />

      <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

        {/* ══════════════════════════════
            HERO BANNER
        ══════════════════════════════ */}
        <div style={{
          ...bannerBg,
          height: "300px",
          marginTop: "56px",
          position: "relative",
        }}>
          {/* gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
          }} />
        </div>

        {/* ══════════════════════════════
            STORE IDENTITY CARD
        ══════════════════════════════ */}
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            marginTop: "-72px",
            position: "relative",
            zIndex: 10,
            padding: "0 32px 28px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            border: "1px solid #f1f5f9",
          }}
            className="shop-identity-card"
          >
            {/* Logo row */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "-40px",
              marginBottom: "20px",
            }}
              className="shop-identity-top"
            >
              {/* Logo */}
              <div style={{ flexShrink: 0 }}>
                {shop.logo_url ? (
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    style={{
                      width: "90px", height: "90px",
                      borderRadius: "18px",
                      border: "4px solid #fff",
                      objectFit: "cover",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                      display: "block",
                      background: "#f1f5f9",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "90px", height: "90px",
                    borderRadius: "18px",
                    border: "4px solid #fff",
                    background: "linear-gradient(135deg, #3b7bf8, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "32px", fontWeight: 900, color: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                    flexShrink: 0,
                  }}>
                    {shop.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingBottom: "2px" }}>
                {shop.whatsapp && (
                  <a
                    href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "9px 16px", borderRadius: "10px",
                      border: "1.5px solid #dcfce7", background: "#f0fdf4",
                      color: "#16a34a", fontWeight: 700, fontSize: "13px",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#16a34a"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.borderColor = "#dcfce7"; }}
                  >
                    <WaIcon /> WhatsApp
                  </a>
                )}
                {shop.instagram && (
                  <a
                    href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "9px 16px", borderRadius: "10px",
                      border: "1.5px solid #fce7f3", background: "#fdf2f8",
                      color: "#be185d", fontWeight: 700, fontSize: "13px",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#be185d"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#be185d"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fdf2f8"; e.currentTarget.style.color = "#be185d"; e.currentTarget.style.borderColor = "#fce7f3"; }}
                  >
                    <IgIcon /> Instagram
                  </a>
                )}
                {shop.website && (
                  <a
                    href={shop.website}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "9px 16px", borderRadius: "10px",
                      border: "1.5px solid #e0e7ff", background: "#eef2ff",
                      color: "#4338ca", fontWeight: 700, fontSize: "13px",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#4338ca"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#4338ca"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
                  >
                    <WebIcon /> Website
                  </a>
                )}
                <button
                  onClick={() => setShowInquiry(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "7px",
                    padding: "9px 20px", borderRadius: "10px",
                    border: "none", background: "#2563eb",
                    color: "#fff", fontWeight: 700, fontSize: "13px",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; }}
                >
                  <MsgIcon /> Send Message
                </button>
              </div>
            </div>

            {/* Store name + description + stats */}
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}
              className="shop-identity-body"
            >
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <h1 style={{
                  fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)",
                  color: "#0f172a", margin: "0 0 6px", lineHeight: 1.15,
                }}>
                  {shop.name}
                </h1>
                {shop.owner_name && (
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 10px", fontWeight: 500 }}>
                    by {shop.owner_name}
                  </p>
                )}
                {shop.description && (
                  <p style={{
                    fontSize: "14px", color: "#475569", margin: 0,
                    lineHeight: 1.7, maxWidth: "560px",
                  }}>
                    {shop.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", gap: "0",
                background: "#f8fafc", borderRadius: "14px",
                border: "1px solid #e2e8f0",
                overflow: "hidden", alignSelf: "flex-start", flexShrink: 0,
              }}
                className="shop-stats-row"
              >
                {[
                  { Icon: PkgIcon, value: shop.product_count, label: "Products" },
                  { Icon: EyeIcon, value: shop.visit_count?.toLocaleString(), label: "Store visits" },
                  ...(shop.categories?.length > 0
                    ? [{ Icon: null, value: shop.categories.length, label: "Categories" }]
                    : []),
                ].map((s, i, arr) => (
                  <div key={i} style={{
                    padding: "16px 24px", textAlign: "center",
                    borderRight: i < arr.length - 1 ? "1px solid #e2e8f0" : "none",
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "5px", color: "#2563eb", marginBottom: "4px",
                    }}>
                      {s.Icon && <s.Icon />}
                      <span style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                        {s.value}
                      </span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════
              PRODUCTS SECTION
          ══════════════════════════════ */}
          <div style={{ marginTop: "32px", paddingBottom: "60px" }}>

            {/* Category filter tabs */}
            {categories.length > 2 && (
              <div style={{
                display: "flex", gap: "8px", flexWrap: "wrap",
                marginBottom: "24px",
              }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "7px 18px", borderRadius: "999px",
                      border: "1.5px solid",
                      borderColor: activeCategory === cat ? "#2563eb" : "#e2e8f0",
                      background: activeCategory === cat ? "#2563eb" : "#fff",
                      color: activeCategory === cat ? "#fff" : "#64748b",
                      fontWeight: 600, fontSize: "13px",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Products header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "20px",
            }}>
              <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", margin: 0 }}>
                {activeCategory === "All" ? "All Products" : activeCategory}
                <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "14px", marginLeft: "8px" }}>
                  ({filtered.length})
                </span>
              </h2>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 20px",
                background: "#fff", borderRadius: "16px",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "16px",
                  background: "#f1f5f9", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px", color: "#94a3b8",
                }}>
                  <PkgIcon />
                </div>
                <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>No products yet</h4>
                <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                  This store hasn't listed any products yet. Check back soon.
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
                className="shop-product-grid"
              >
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-identity-card {
            padding: 0 18px 22px !important;
            margin-top: -48px !important;
            border-radius: 16px !important;
          }
          .shop-identity-top {
            flex-direction: column !important;
            align-items: flex-start !important;
            margin-top: -36px !important;
          }
          .shop-identity-body {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .shop-stats-row {
            width: 100% !important;
          }
          .shop-stats-row > div {
            flex: 1;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <Footer />

      <InquiryModal
        show={showInquiry}
        onClose={() => setShowInquiry(false)}
        shop={shop}
      />
    </>
  );
};

export default ShopPage;
