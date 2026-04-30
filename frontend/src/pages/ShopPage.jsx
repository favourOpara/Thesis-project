import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import InquiryModal from "../components/InquiryModal";
import ProductCard from "../components/ProductCard";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

/* ── Convert YouTube/Vimeo URL to embed URL ── */
const getEmbedUrl = (url) => {
  if (!url) return null;
  const ytWatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const ytShort = url.match(/youtu\.be\/([^?]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

/* ── Store card for "Other Stores" section ── */
const StoreCard = ({ store }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/shop/${store.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff", borderRadius: "14px",
          border: "1px solid #f1f5f9",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.2s", overflow: "hidden", cursor: "pointer",
        }}
      >
        {/* Mini banner */}
        <div style={{
          height: "64px",
          background: store.banner_url
            ? `url(${store.banner_url}) center/cover`
            : "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)",
          position: "relative",
        }}>
          {/* Logo */}
          <div style={{
            position: "absolute", bottom: "-18px", left: "14px",
            width: "36px", height: "36px", borderRadius: "8px",
            border: "2px solid #fff",
            background: store.logo_url ? `url(${store.logo_url}) center/cover` : "linear-gradient(135deg, #3b7bf8, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 700, color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}>
            {!store.logo_url && store.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div style={{ padding: "26px 14px 14px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "3px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {store.name}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            {store.product_count} product{store.product_count !== 1 ? "s" : ""}
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
  const [search, setSearch] = useState("");
  const [otherStores, setOtherStores] = useState([]);
  const [showMoreStores, setShowMoreStores] = useState(false);
  const INITIAL = 4;

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

        // Fetch other stores
        const allShopsRes = await axios.get(`${BASE}/api/shops/`);
        const others = allShopsRes.data.filter(s => s.slug !== slug);
        // Shuffle and take up to 6
        const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 6);
        setOtherStores(shuffled);
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
  // 1. Sort by seller preference
  const sorted = [...products].sort((a, b) => {
    if (shop.sort_order === "price_asc")  return parseFloat(a.price) - parseFloat(b.price);
    if (shop.sort_order === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
    return b.id - a.id; // newest (default)
  });

  // 2. Featured products always float to the top
  const displayProducts = [
    ...sorted.filter(p => p.is_featured),
    ...sorted.filter(p => !p.is_featured),
  ];

  // 3. Category tabs (only relevant in categories mode)
  const categories = ["All", ...Array.from(new Set(displayProducts.map(p => p.category).filter(Boolean)))];
  const filtered = (shop.layout_mode === "categories" && activeCategory !== "All")
    ? displayProducts.filter(p => p.category === activeCategory)
    : displayProducts;

  // 4. Search filter
  const visibleProducts = search.trim()
    ? filtered.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : filtered;

  const hasSocials = shop.whatsapp || shop.instagram || shop.website;
  const bannerBg = shop.banner_url
    ? { backgroundImage: `url(${shop.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)" };

  return (
    <>
      <Header />

      <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

        {/* ══════════════════════════════
            CLOSED BANNER
        ══════════════════════════════ */}
        {shop.store_status === "closed" && (
          <div style={{
            background: "#fef2f2", borderBottom: "1px solid #fecaca",
            padding: "10px 20px", textAlign: "center", marginTop: "56px",
          }}>
            <span style={{ color: "#b91c1c", fontWeight: 700, fontSize: "13.5px" }}>
              ⚠ This store is temporarily closed.
            </span>
            {shop.store_status_message && (
              <span style={{ color: "#b91c1c", fontWeight: 400, fontSize: "13px", marginLeft: "8px" }}>
                {shop.store_status_message}
              </span>
            )}
          </div>
        )}

        {/* ══════════════════════════════
            HERO BANNER
        ══════════════════════════════ */}
        <div style={{
          ...bannerBg,
          height: "220px",
          marginTop: shop.store_status === "closed" ? "0" : "56px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)",
          }} />
          {/* Browse other stores — top-right of banner */}
          <Link
            to="/browse"
            style={{
              position: "absolute", top: "14px", right: "16px",
              display: "inline-flex", alignItems: "center", gap: "5px",
              fontSize: "12.5px", fontWeight: 600, color: "#fff",
              textDecoration: "none", padding: "6px 13px",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              zIndex: 12,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.35)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Browse Other Stores
          </Link>
        </div>

        {/* ══════════════════════════════
            STORE IDENTITY CARD
        ══════════════════════════════ */}
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 16px" }}>

          {/* Logo — overlaps banner, sits outside the card flow */}
          <div style={{ marginTop: "-30px", paddingLeft: "20px", marginBottom: "-8px", position: "relative", zIndex: 11 }}>
            {shop.logo_url ? (
              <img
                src={shop.logo_url}
                alt={shop.name}
                style={{
                  width: "56px", height: "56px", borderRadius: "12px",
                  border: "3px solid #fff", objectFit: "cover",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
                  display: "block", background: "#f1f5f9",
                }}
              />
            ) : (
              <div style={{
                width: "56px", height: "56px", borderRadius: "12px",
                border: "3px solid #fff",
                background: "linear-gradient(135deg, #3b7bf8, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 700, color: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
              }}>
                {shop.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            marginTop: "-28px",
            position: "relative",
            zIndex: 10,
            padding: "44px 20px 14px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
          }}>

            {/* Name · meta · actions — all safely inside the white card */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
              className="shop-identity-row"
            >
              {/* Name + meta */}
              <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                <h1 style={{
                  fontWeight: 600, fontSize: "16px", color: "#0f172a",
                  margin: "0 0 2px", lineHeight: 1.2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {shop.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {shop.owner_name && (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>by {shop.owner_name}</span>
                  )}
                  <span style={{ fontSize: "12px", color: "#cbd5e1" }}>·</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {shop.product_count} product{shop.product_count !== 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: "12px", color: "#cbd5e1" }}>·</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {shop.visit_count?.toLocaleString()} visits
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                {shop.whatsapp && (
                  <a
                    href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    title="WhatsApp"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "34px", height: "34px", borderRadius: "8px",
                      border: "1.5px solid #dcfce7", background: "#f0fdf4",
                      color: "#16a34a", textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; }}
                  >
                    <WaIcon />
                  </a>
                )}
                {shop.instagram && (
                  <a
                    href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    title="Instagram"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "34px", height: "34px", borderRadius: "8px",
                      border: "1.5px solid #fce7f3", background: "#fdf2f8",
                      color: "#be185d", textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#be185d"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fdf2f8"; e.currentTarget.style.color = "#be185d"; }}
                  >
                    <IgIcon />
                  </a>
                )}
                {shop.website && (
                  <a
                    href={shop.website}
                    target="_blank" rel="noopener noreferrer"
                    title="Website"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "34px", height: "34px", borderRadius: "8px",
                      border: "1.5px solid #e0e7ff", background: "#eef2ff",
                      color: "#4338ca", textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#4338ca"; }}
                  >
                    <WebIcon />
                  </a>
                )}
                <button
                  onClick={() => setShowInquiry(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "7px 14px", borderRadius: "8px",
                    border: "none", background: "#2563eb",
                    color: "#fff", fontWeight: 600, fontSize: "12.5px",
                    cursor: "pointer", transition: "background 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; }}
                >
                  <MsgIcon /> Message
                </button>
              </div>
            </div>

            {/* Tagline */}
            {shop.tagline && (
              <p style={{
                fontSize: "13px", color: "#f59e0b", fontWeight: 600,
                margin: "8px 0 0", letterSpacing: "0.01em",
              }}>
                {shop.tagline}
              </p>
            )}

            {/* Description — only if present, slim */}
            {shop.description && (
              <p style={{
                fontSize: "13px", color: "#64748b", margin: "6px 0 0",
                lineHeight: 1.6, maxWidth: "640px",
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {shop.description}
              </p>
            )}
          </div>

          {/* ══════════════════════════════
              PROMO VIDEO (premium only)
          ══════════════════════════════ */}
          {shop.is_premium && shop.store_video_url && (() => {
            const embedUrl = getEmbedUrl(shop.store_video_url);
            if (!embedUrl) return null;
            return (
              <div style={{ marginTop: "24px" }}>
                <div style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #e2e8f0", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}>
                  {/* 16:9 responsive embed */}
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={embedUrl}
                      title={`${shop.name} — store video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%", border: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════
              PRODUCTS SECTION
          ══════════════════════════════ */}
          <div style={{ marginTop: "32px", paddingBottom: "60px" }}>

            {/* Category tabs — only in categories layout mode */}
            {shop.layout_mode === "categories" && categories.length > 2 && (
              <div style={{
                display: "flex", gap: "0", overflowX: "auto",
                borderBottom: "1.5px solid #e2e8f0",
                marginBottom: "24px",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearch(""); }}
                    style={{
                      padding: "10px 18px",
                      background: "none", border: "none",
                      borderBottom: `2px solid ${activeCategory === cat ? "#2563eb" : "transparent"}`,
                      marginBottom: "-1.5px",
                      color: activeCategory === cat ? "#2563eb" : "#64748b",
                      fontWeight: activeCategory === cat ? 600 : 400,
                      fontSize: "13.5px", cursor: "pointer",
                      transition: "all 0.15s", whiteSpace: "nowrap",
                      outline: "none",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Products header + search */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "12px", marginBottom: "20px", flexWrap: "wrap",
            }}>
              <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", margin: 0, flexShrink: 0 }}>
                {activeCategory === "All" ? "All Products" : activeCategory}
                <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "14px", marginLeft: "8px" }}>
                  ({visibleProducts.length})
                </span>
              </h2>
              {/* Search */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products…"
                  style={{
                    paddingLeft: "32px", paddingRight: search ? "30px" : "12px",
                    paddingTop: "7px", paddingBottom: "7px",
                    border: "1.5px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "13px", color: "#0f172a", background: "#fff",
                    outline: "none", width: "200px", transition: "border-color 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", padding: "2px",
                      color: "#94a3b8", display: "flex", alignItems: "center",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Build mixed content: text blocks interleaved with products */}
            {(() => {
              if (visibleProducts.length === 0) return (
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
                  <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                    {search ? "No products match your search" : "No products yet"}
                  </h4>
                  <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                    {search
                      ? `No results for "${search}". Try a different term.`
                      : "This store hasn't listed any products yet. Check back soon."}
                  </p>
                </div>
              );

              // Index text blocks by insert_after position
              const blocksByPos = {};
              (shop.text_blocks || []).forEach(block => {
                const pos = block.insert_after;
                if (!blocksByPos[pos]) blocksByPos[pos] = [];
                blocksByPos[pos].push(block);
              });

              // Build mixed array
              const mixed = [];
              (blocksByPos[0] || []).forEach(b => mixed.push({ type: "block", data: b }));
              visibleProducts.forEach((product, i) => {
                mixed.push({ type: "product", data: product });
                (blocksByPos[i + 1] || []).forEach(b => mixed.push({ type: "block", data: b }));
              });

              return (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }} className="shop-product-grid">
                  {mixed.map((item, idx) => {
                    if (item.type === "product") {
                      return <ProductCard key={item.data.id} product={item.data} />;
                    }
                    // Full-width text block
                    const block = item.data;
                    return (
                      <div key={`block-${block.id}`} style={{
                        gridColumn: "1 / -1",
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderLeft: "3px solid #0f172a",
                        borderRadius: "10px",
                        padding: "16px 20px",
                      }}>
                        {block.title && (
                          <div style={{
                            fontWeight: 700, fontSize: "14px", color: "#0f172a",
                            marginBottom: "5px", letterSpacing: "-0.01em",
                          }}>
                            {block.title}
                          </div>
                        )}
                        <div style={{
                          fontSize: "13.5px", color: "#475569",
                          lineHeight: 1.7, whiteSpace: "pre-wrap",
                        }}>
                          {block.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* ══════════════════════════════
              OTHER STORES SECTION
          ══════════════════════════════ */}
          {otherStores.length > 0 && (
            <div style={{ paddingBottom: "60px" }}>
              <div style={{ height: "1px", background: "#e2e8f0", margin: "8px 0 32px" }} />

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "20px", flexWrap: "wrap", gap: "10px",
              }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", margin: "0 0 3px" }}>
                    Explore More Stores
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                    Discover other sellers on Abatrades
                  </p>
                </div>
                <Link
                  to="/browse"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", fontWeight: 600, color: "#2563eb",
                    textDecoration: "none", padding: "7px 14px",
                    borderRadius: "8px", border: "1.5px solid #bfdbfe",
                    background: "#eff6ff", transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  Browse All Stores
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "16px",
              }} className="other-stores-grid">
                {(showMoreStores ? otherStores : otherStores.slice(0, INITIAL)).map(store => (
                  <StoreCard key={store.slug} store={store} />
                ))}
              </div>

              {otherStores.length > INITIAL && (
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <button
                    onClick={() => setShowMoreStores(p => !p)}
                    style={{
                      padding: "10px 28px",
                      background: showMoreStores ? "#f1f5f9" : "#0f172a",
                      color: showMoreStores ? "#374151" : "#fff",
                      border: "none", borderRadius: "9px",
                      fontWeight: 700, fontSize: "13.5px", cursor: "pointer",
                    }}
                  >
                    {showMoreStores ? "Show Less" : `Show More (${otherStores.length - INITIAL} more)`}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .shop-identity-row {
            gap: 10px !important;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .other-stores-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
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
