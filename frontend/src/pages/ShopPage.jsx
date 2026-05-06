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

/* ── Verified badge (reused across storefront, store cards, etc.) ── */
const VerifiedBadge = ({ size = "md" }) => {
  const sm = size === "sm";
  return (
    <span
      title="Verified Premium Seller"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: sm ? "16px" : "20px", height: sm ? "16px" : "20px",
        background: "linear-gradient(135deg, #d97706, #f59e0b)",
        borderRadius: "50%", flexShrink: 0,
      }}
    >
      <svg width={sm ? 9 : 11} height={sm ? 9 : 11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
};

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

/* ── Store content sections renderer ── */
const GRID_TEMPLATES = {
  "1col": "1fr",
  "2col": "1fr 1fr",
  "3col": "1fr 1fr 1fr",
  "2-1":  "2fr 1fr",
  "1-2":  "1fr 2fr",
};

const FIXED_HEIGHT_LAYOUTS = new Set(["2-1", "1-2"]);

const StoreSections = ({ sections, onCategoryClick }) => {
  return (
    <div style={{ marginTop: "24px", marginBottom: "8px" }}>
      {sections.map(sec => {
        const fixedHeight = FIXED_HEIGHT_LAYOUTS.has(sec.layout);
        return (
        <div key={sec.id} style={{ marginBottom: "12px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: GRID_TEMPLATES[sec.layout] || "1fr 1fr",
            gap: "6px",
            ...(fixedHeight ? { height: "320px" } : {}),
          }}>
            {sec.images.map(img => {
              const clickable = !!img.linked_category;
              return (
                <div
                  key={img.id}
                  onClick={clickable ? () => onCategoryClick(img.linked_category) : undefined}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "8px",
                    cursor: clickable ? "pointer" : "default",
                    ...(fixedHeight ? {} : { aspectRatio: "16 / 7" }),
                  }}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                    onMouseEnter={e => { if (clickable) e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                  {clickable && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                      padding: "18px 14px 10px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                        {img.linked_category}
                      </span>
                      <span style={{ color: "#fff", fontSize: "11px", background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>
                        Shop →
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
  );
};

/* ── Store card for "Other Stores" section ── */
const StoreCard = ({ store }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/shop/${store.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", minWidth: 0 }}>
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
          flexShrink: 0,
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
            flexShrink: 0,
          }}>
            {!store.logo_url && store.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div style={{ padding: "26px 14px 14px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px", minWidth: 0, overflow: "hidden" }}>
            <div style={{
              fontWeight: 700, fontSize: "14px", color: "#0f172a",
              flex: 1, minWidth: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {store.name}
            </div>
            {store.is_premium && <VerifiedBadge size="sm" />}
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
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const INITIAL = 4;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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
    : shop.banner_color
      ? { background: shop.banner_color }
      : { background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)" };

  return (
    <>
      <Header />

      <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: "hidden" }}>

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
          minHeight: isMobile ? "85px" : "105px",
          marginTop: shop.store_status === "closed" ? "0" : "56px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: shop.tagline ? "0 20px 28px" : "0",
        }}>
          {/* Dark scrim — only for image banners so color banners aren't washed out */}
          {shop.banner_url && (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)",
            }} />
          )}
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

          {/* Store name + tagline inside banner */}
          {shop.tagline && (
            <div style={{ position: "relative", zIndex: 5, maxWidth: "680px" }}>
              <p style={{
                margin: "4px 0 0",
                fontSize: isMobile ? "13px" : "14.5px",
                color: shop.banner_url ? "rgba(255,255,255,0.88)" : "#fff",
                lineHeight: 1.5,
                textShadow: shop.banner_url ? "0 1px 4px rgba(0,0,0,0.45)" : "none",
              }}>
                {shop.tagline}
              </p>
            </div>
          )}
        </div>

        {/* ══════════════════════════════
            STORE IDENTITY CARD
        ══════════════════════════════ */}
        <div className="shop-main-wrap" style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 16px" }}>

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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
                  <h1 style={{
                    fontWeight: 600, fontSize: "16px", color: "#0f172a",
                    margin: 0, lineHeight: 1.2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {shop.name}
                  </h1>
                  {shop.is_premium && <VerifiedBadge />}
                </div>
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

            {/* Description — expandable if long */}
            {shop.description && (() => {
              const long = shop.description.length > 160;
              return (
                <div style={{ margin: "6px 0 0", maxWidth: "640px" }}>
                  <p style={{
                    fontSize: "13px", color: "#64748b", margin: 0,
                    lineHeight: 1.6,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: showFullDesc ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {shop.description}
                  </p>
                  {long && (
                    <button
                      onClick={() => setShowFullDesc(p => !p)}
                      style={{
                        background: "none", border: "none", padding: "3px 0 0",
                        cursor: "pointer", color: "#2563eb",
                        fontSize: "12px", fontWeight: 600,
                        display: "inline-flex", alignItems: "center", gap: "3px",
                      }}
                    >
                      {showFullDesc ? "Show less" : "Show more"}
                      <svg
                        width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: showFullDesc ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ══════════════════════════════
              PROMO VIDEO (premium only)
          ══════════════════════════════ */}
          {shop.is_premium && (shop.store_video_url || shop.store_video_file_url) && (() => {
            const fileUrl  = shop.store_video_file_url;
            const embedUrl = fileUrl ? null : getEmbedUrl(shop.store_video_url);
            if (!fileUrl && !embedUrl) return null;
            return (
              <div style={{ marginTop: "24px" }}>
                <div style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #e2e8f0", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}>
                  {fileUrl ? (
                    /* Uploaded video file — native player */
                    <video
                      src={fileUrl}
                      controls
                      style={{ width: "100%", display: "block", maxHeight: "480px", background: "#000" }}
                    />
                  ) : (
                    /* YouTube / Vimeo embed */
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                      <iframe
                        src={embedUrl}
                        title={`${shop.name} — store video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════
              STORE BUILDER BLOCKS + PRODUCTS
          ══════════════════════════════ */}
          {(() => {
            const sBlocks = (shop.store_blocks || []).slice().sort((a, b) => a.order - b.order);
            const onCatClick = cat => {
              setActiveCategory(cat);
              setTimeout(() => document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" }), 80);
            };

            /* ── style_config → CSS ── */
            const DFLT_STYLE = {
              padding_top: 0, padding_bottom: 0, padding_x: 0,
              full_width: false, bg_color: "", text_color: "",
              font_family: "", font_size: 0, font_weight: "",
              letter_spacing: 0, line_height: 0, border_radius: 0,
              visibility: "all", condition: "always",
            };
            const resolveBlockStyle = (block) => {
              const sc = { ...DFLT_STYLE, ...(block.style_config || {}) };
              const css = {};
              if (sc.padding_top > 0)       css.paddingTop       = `${sc.padding_top}px`;
              if (sc.padding_bottom > 0)    css.paddingBottom    = `${sc.padding_bottom}px`;
              if (sc.padding_x > 0)         { css.paddingLeft = `${sc.padding_x}px`; css.paddingRight = `${sc.padding_x}px`; }
              if (sc.bg_color)              css.backgroundColor  = sc.bg_color;
              if (sc.text_color)            css.color            = sc.text_color;
              if (sc.font_family)           css.fontFamily       = sc.font_family;
              if (sc.font_size > 0)         css.fontSize         = `${sc.font_size}px`;
              if (sc.font_weight)           css.fontWeight       = sc.font_weight;
              if (sc.letter_spacing !== 0)  css.letterSpacing    = `${sc.letter_spacing}px`;
              if (sc.line_height > 0)       css.lineHeight       = sc.line_height;
              if (sc.border_radius > 0)     { css.borderRadius = `${sc.border_radius}px`; css.overflow = "hidden"; }
              if (sc.full_width) {
                css.marginLeft  = "calc(-50vw + 50%)";
                css.marginRight = "calc(-50vw + 50%)";
                css.width       = "100vw";
                css.boxSizing   = "border-box";
              }
              return { css, sc };
            };

            const wrapBlock = (block, content) => {
              if (!content) return null;
              const { css, sc } = resolveBlockStyle(block);
              // Visibility / draft filtering
              if (sc.condition === "draft") return null;
              if (sc.visibility === "desktop" && isMobile) return null;
              if (sc.visibility === "mobile"  && !isMobile) return null;
              if (Object.keys(css).length === 0) return content;
              return <div style={css}>{content}</div>;
            };

            // Tracks how many products have been consumed by earlier products blocks
            let productOffset = 0;

            const renderImgGrid = (block) => {
              const fh = FIXED_HEIGHT_LAYOUTS.has(block.layout);
              return (
                <div style={{ marginTop: "10px", marginBottom: "4px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATES[block.layout] || "1fr 1fr", gap: "6px", ...(fh ? { height: "320px" } : {}) }}>
                    {(block.images || []).slice().sort((a, b) => a.display_order - b.display_order).map(img => {
                      const cl = !!img.linked_category;
                      return (
                        <div key={img.id} onClick={cl ? () => onCatClick(img.linked_category) : undefined}
                          style={{ position: "relative", overflow: "hidden", borderRadius: "8px", cursor: cl ? "pointer" : "default", ...(fh ? {} : { aspectRatio: block.layout === "3col" ? "1/1" : "16/9" }) }}>
                          <img src={img.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.2s" }}
                            onMouseEnter={e => { if (cl) e.currentTarget.style.transform = "scale(1.03)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }} />
                          {cl && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "18px 14px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", textShadow: "0 1px 4px rgba(0,0,0,0.5)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "6px" }}>{img.linked_category}</span>
                              <span style={{ color: "#fff", fontSize: "11px", background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: "99px", fontWeight: 600, flexShrink: 0 }}>Shop →</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            };

            const renderTxtBlock = (block) => (
              <div style={{ marginTop: "8px", background: "#fff", border: "1px solid #e2e8f0", borderLeft: "4px solid #2563eb", borderRadius: "10px", padding: "18px 22px" }}>
                {block.text_title && <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", marginBottom: "6px" }}>{block.text_title}</div>}
                {block.text_content && <div style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{block.text_content}</div>}
              </div>
            );

            const renderBanner = (block) => {
              const img = block.images?.[0];
              if (!img) return null;
              return (
                <div style={{ marginTop: "20px", position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "3/1" }}>
                  <img src={img.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {(block.text_title || block.text_content) && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 32px" }}>
                      {block.text_title && <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(16px, 3vw, 26px)", textShadow: "0 2px 8px rgba(0,0,0,0.4)", marginBottom: "6px", maxWidth: "60%" }}>{block.text_title}</div>}
                      {block.text_content && <div style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(12px, 2vw, 15px)", textShadow: "0 1px 4px rgba(0,0,0,0.4)", maxWidth: "55%" }}>{block.text_content}</div>}
                    </div>
                  )}
                </div>
              );
            };

            const ANNOUNCEMENT_STYLES = {
              promo:   { background: "linear-gradient(90deg,#7c3aed,#db2777)", color: "#fff" },
              sale:    { background: "#fee2e2", color: "#b91c1c" },
              info:    { background: "#eff6ff", color: "#1d4ed8" },
              neutral: { background: "#f1f5f9", color: "#475569" },
            };

            const renderAnnouncement = (block) => {
              if (!block.text_content) return null;
              const style = ANNOUNCEMENT_STYLES[block.layout] || ANNOUNCEMENT_STYLES.promo;
              return (
                <div style={{ marginTop: "16px", borderRadius: "10px", padding: "12px 20px", textAlign: "center", fontWeight: 700, fontSize: "13.5px", letterSpacing: "0.01em", ...style }}>
                  {block.text_content}
                </div>
              );
            };

            const renderVideo = (block) => {
              if (!block.text_content) return null;
              let src = block.text_content.trim();
              // Convert youtube watch URL to embed URL
              const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/);
              if (ytMatch) src = `https://www.youtube.com/embed/${ytMatch[1]}`;
              return (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
                    <iframe src={src} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                  </div>
                  {block.text_title && <div style={{ marginTop: "8px", textAlign: "center", fontSize: "12.5px", color: "#64748b" }}>{block.text_title}</div>}
                </div>
              );
            };

            const renderDivider = (block) => {
              const style = block.layout || "line";
              if (style === "space") return <div style={{ marginTop: "28px" }} />;
              if (style === "dots") return (
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "6px" }}>
                  {[0,1,2,3,4].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#cbd5e1" }} />)}
                </div>
              );
              return <div style={{ marginTop: "24px", height: "1px", background: "#e2e8f0", borderRadius: "1px" }} />;
            };

            const renderProductsChunk = (block, slice, hasMore) => {
              const l = block.layout;
              // For 1col: stack vertically but cap each card at natural card width
              // so it doesn't stretch full-page-width
              if (l === "1col") {
                return (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {slice.map(p => (
                        <div key={p.id} style={{ width: "100%", maxWidth: "260px" }}>
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                    {hasMore && (
                      <div style={{ textAlign: "center", marginTop: "28px" }}>
                        <button onClick={() => setShowMoreProducts(prev => !prev)}
                          style={{ padding: "10px 32px", background: showMoreProducts ? "#f1f5f9" : "#0f172a", color: showMoreProducts ? "#374151" : "#fff", border: "none", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px", cursor: "pointer", transition: "background 0.15s" }}>
                          {showMoreProducts ? "Show Less" : "Show More"}
                        </button>
                      </div>
                    )}
                  </>
                );
              }
              const gridTemplate = l === "2col" ? "repeat(2, 1fr)"
                : l === "3col" ? "repeat(3, 1fr)"
                : l === "4col" ? "repeat(4, 1fr)"
                : slice.length === 1 ? "repeat(1, minmax(0, 420px))"
                : slice.length === 2 ? "repeat(2, 1fr)"
                : "repeat(auto-fill, minmax(200px, 1fr))";
              return (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "20px", alignItems: "stretch", justifyContent: slice.length === 1 ? "center" : undefined }} className="shop-product-grid">
                    {slice.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                  {hasMore && (
                    <div style={{ textAlign: "center", marginTop: "28px" }}>
                      <button onClick={() => setShowMoreProducts(prev => !prev)}
                        style={{ padding: "10px 32px", background: showMoreProducts ? "#f1f5f9" : "#0f172a", color: showMoreProducts ? "#374151" : "#fff", border: "none", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px", cursor: "pointer", transition: "background 0.15s" }}>
                        {showMoreProducts ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </>
              );
            };

            const renderBlock = (b) => {
              if (b.block_type === "products") {
                const limit = b.style_config?.products_limit || 0;
                const allRemaining = visibleProducts.slice(productOffset);
                let slice, hasMore = false;
                if (limit > 0) {
                  slice = allRemaining.slice(0, limit);
                  productOffset += limit;
                } else {
                  const INITIAL = isMobile ? 8 : 12;
                  hasMore = !showMoreProducts && allRemaining.length > INITIAL;
                  slice = hasMore ? allRemaining.slice(0, INITIAL) : allRemaining;
                  productOffset += allRemaining.length;
                }
                if (slice.length === 0) return null;
                return wrapBlock(b, <div style={{ marginTop: "16px" }}>{renderProductsChunk(b, slice, hasMore)}</div>);
              }
              let content = null;
              if (b.block_type === "text")              content = renderTxtBlock(b);
              else if (b.block_type === "image_grid")   content = renderImgGrid(b);
              else if (b.block_type === "banner")       content = renderBanner(b);
              else if (b.block_type === "announcement") content = renderAnnouncement(b);
              else if (b.block_type === "video")        content = renderVideo(b);
              else if (b.block_type === "divider")      content = renderDivider(b);
              return wrapBlock(b, content);
            };

            const catPageContent = (() => {
              if (shop.layout_mode !== "categories" || activeCategory === "All") return null;
              const pg = (shop.category_pages || []).find(p => p.category_name === activeCategory);
              if (!pg?.blocks?.length) return null;
              return pg.blocks.slice().sort((a, b) => a.order - b.order).map(cb => (
                <React.Fragment key={`cp-${cb.id}`}>{renderBlock(cb)}</React.Fragment>
              ));
            })();

            return (
              <div id="shop-products" style={{ marginTop: "32px", paddingBottom: "60px" }}>

                {/* Category tabs */}
                {shop.layout_mode === "categories" && categories.length > 2 && (
                  <div style={{ display: "flex", gap: "0", overflowX: "auto", borderBottom: "1.5px solid #e2e8f0", marginBottom: "24px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
                    {categories.map(cat => (
                      <button key={cat} onClick={() => { setActiveCategory(cat); setSearch(""); }}
                        style={{ padding: "10px 18px", background: "none", border: "none", borderBottom: `2px solid ${activeCategory === cat ? "#2563eb" : "transparent"}`, marginBottom: "-1.5px", color: activeCategory === cat ? "#2563eb" : "#64748b", fontWeight: activeCategory === cat ? 600 : 400, fontSize: "13.5px", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", outline: "none" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Category page custom blocks */}
                {catPageContent}

                {/* Products header + search */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <h2 style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", margin: 0, flexShrink: 0 }}>
                    {activeCategory === "All" ? "All Products" : activeCategory}
                    <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "14px", marginLeft: "8px" }}>({visibleProducts.length})</span>
                  </h2>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                      style={{ paddingLeft: "32px", paddingRight: search ? "30px" : "12px", paddingTop: "7px", paddingBottom: "7px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "#fff", outline: "none", width: "200px", transition: "border-color 0.15s", fontFamily: "inherit" }}
                      onFocus={e => { e.target.style.borderColor = "#2563eb"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    {search && (
                      <button onClick={() => setSearch("")} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Empty state */}
                {visibleProducts.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#94a3b8" }}>
                      <PkgIcon />
                    </div>
                    <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                      {search ? "No products match your search" : "No products yet"}
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                      {search ? `No results for "${search}". Try a different term.` : "This store hasn't listed any products yet. Check back soon."}
                    </p>
                  </div>
                )}

                {/* All blocks in order — products blocks consume from productOffset sequentially */}
                {visibleProducts.length > 0 && sBlocks.map(b => (
                  <React.Fragment key={`bl-${b.id}`}>{renderBlock(b)}</React.Fragment>
                ))}

              </div>
            );
          })()}

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
        @media (min-width: 641px) {
          .shop-main-wrap {
            max-width: 1400px !important;
            padding: 0 48px !important;
          }
        }
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
