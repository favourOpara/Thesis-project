import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import FeaturedShops from "../components/FeaturedShops";
import Logo from "../assets/img/abatrades-logo-other.png";
import LargeLogo from "../assets/img/abatrades-large-logo.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getTopVisitedCategories } from "../utils/localHistory";
import { hasConsentedToCookies } from "../utils/cookieConsent";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const NAV_ITEMS = [
  "Best Sellers",
  "New Releases",
  "Today's Deals",
  "Top Rated",
  "Flash Sales",
  "Trending Now",
  "Just Arrived",
  "Fashion",
  "Electronics",
  "Beauty",
  "Food & Groceries",
  "Home & Living",
  "Sports",
  "Construction",
  "Kitchen",
  "Car Accessories",
  "Books",
  "Wholesale",
  "Under ₦5,000",
  "Under ₦20,000",
  "Become a Seller",
];

// 8 categories — desktop: 4 columns × 2 rows, mobile: 3 columns
const CATEGORY_TILES = [
  { label: "Construction",      query: "construction",  gradient: "linear-gradient(135deg,#78716c,#44403c)", image: "/categories/construction.jpg" },
  { label: "Kitchen",           query: "kitchen",       gradient: "linear-gradient(135deg,#f97316,#c2410c)", image: "/categories/kitchen.jpg" },
  { label: "Car Accessories",   query: "car",           gradient: "linear-gradient(135deg,#374151,#111827)", image: "/categories/car.jpg" },
  { label: "Beauty & Wellness", query: "beauty",        gradient: "linear-gradient(135deg,#ec4899,#9333ea)", image: "/categories/beauty.jpg" },
  { label: "Fashion",           query: "fashion",       gradient: "linear-gradient(135deg,#f59e0b,#d97706)", image: "/categories/fashion.jpg" },
  { label: "Electronics",       query: "electronics",   gradient: "linear-gradient(135deg,#0ea5e9,#0284c7)", image: "/categories/electronics.jpg" },
  { label: "Food & Groceries",  query: "food",          gradient: "linear-gradient(135deg,#34d399,#059669)", image: "/categories/food.jpg" },
  { label: "Books",             query: "books",         gradient: "linear-gradient(135deg,#3b7bf8,#1d4ed8)", image: "/categories/books.jpg" },
  { label: "Sports & Fitness",  query: "sports",        gradient: "linear-gradient(135deg,#22c55e,#15803d)", image: "/categories/sports.jpg" },
];

/* ── Category grid tile ── */
const CategoryTile = ({ tile, image, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        position: "relative",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: tile.gradient,
        opacity: hovered ? 0.88 : 1,
        transition: "opacity 0.18s",
      }}
    >
      {/* Product image if available */}
      {image && (
        <img
          src={image}
          alt={tile.label}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
          }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}
      {/* Dark overlay for readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
      }} />
      {/* Label */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 10px 10px",
      }}>
        <p className="cat-tile-label" style={{
          margin: 0,
          fontSize: "9px",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}>
          {tile.label}
        </p>
      </div>
    </div>
  );
};

/* ── Horizontal scroll row (New Arrivals, Featured Picks) ── */
const DiscoveryCard = ({ product, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const img = product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : null);
  const label = product.sub_category || product.category || product.name;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: "140px", minWidth: "140px", maxWidth: "140px", overflow: "hidden", cursor: "pointer" }}
    >
      <div style={{
        width: "140px", height: "140px",
        background: "#f3f4f6",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.18s",
      }}>
        {img ? (
          <img
            src={img} alt={label}
            onError={e => { e.target.style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
        )}
      </div>
      <p style={{
        margin: "7px 0 0", fontSize: "12px", fontWeight: 500,
        color: "#111827", display: "block", width: "100%",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {label}
      </p>
    </div>
  );
};

const ProductRow = ({ title, products, onCardClick }) => {
  if (products.length === 0) return null;
  return (
    <div style={{ paddingBottom: "4px" }}>
      <p className="browse-pad" style={{
        fontWeight: 700, fontSize: "15px", color: "#111827",
        margin: "0 0 12px", padding: "0 40px",
      }}>
        {title}
      </p>
      <div className="browse-pad-scroll" style={{
        display: "flex", gap: "2px",
        overflowX: "auto", overflowY: "hidden",
        padding: "0 40px 4px",
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
      }}>
        {products.map(p => (
          <DiscoveryCard key={p.id} product={p} onClick={() => onCardClick(p)} />
        ))}
        <div style={{ flexShrink: 0, width: "8px" }} />
      </div>
    </div>
  );
};

/* ── Amazon-style 2×2 recommendation boxes ── */
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const RecommendedRow = ({ products, onCardClick }) => {
  if (products.length === 0) return null;
  const groups = chunk(products, 4);
  return (
    <div style={{ paddingBottom: "4px" }}>

      {/* Section label */}
      <p className="browse-pad" style={{
        fontWeight: 700, fontSize: "15px", color: "#111827",
        margin: "0 0 10px", padding: "0 40px",
      }}>
        Recommended for You
      </p>

      {/* Boxes — grid on desktop, scroll on mobile */}
      <div className="browse-pad rec-boxes-container" style={{ padding: "0 40px 4px" }}>
        {groups.map((group, gi) => (
          <div key={gi} className="rec-box" style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            {/* 2×2 image grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "2px",
              height: "240px",
              background: "#e5e7eb",
            }}>
              {group.map((p) => {
                const img = p.main_image_url ||
                  (p.images?.length > 0 ? p.images[0].image_url : null);
                return (
                  <div
                    key={p.id}
                    onClick={() => onCardClick(p)}
                    style={{ background: "#f3f4f6", overflow: "hidden", cursor: "pointer" }}
                  >
                    {img ? (
                      <img
                        src={img} alt={p.name}
                        onError={e => { e.target.style.display = "none"; }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
                    )}
                  </div>
                );
              })}
              {group.length < 4 && Array.from({ length: 4 - group.length }).map((_, ei) => (
                <div key={`empty-${ei}`} style={{ background: "#f9fafb" }} />
              ))}
            </div>
            {/* Box label */}
            <div style={{ padding: "8px 10px 10px" }}>
              <p style={{
                margin: 0, fontSize: "12px", fontWeight: 600, color: "#111827",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {group[0].sub_category || group[0].category || "Picks for you"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#6b7280" }}>
                Based on your browsing
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════
    MAIN BROWSE PAGE
══════════════════════════════ */
const BrowsePage = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const cartCount = cart?.item_count || 0;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storesSectionRef = useRef(null);

  const [activeNav, setActiveNav]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [categoryImages, setCategoryImages] = useState({});  // label → image url
  const [newProducts, setNewProducts]     = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [allProducts, setAllProducts]     = useState([]);
  const [allShops, setAllShops]           = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], shops: [] });
  const [showDropdown, setShowDropdown]   = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    axios.get(`${BASE}/api/products/`)
      .then(res => {
        const all = res.data;

        // Map one image per category tile
        const imgMap = {};
        CATEGORY_TILES.forEach(tile => {
          const match = all.find(p =>
            (p.category || "").toLowerCase().includes(tile.query) ||
            (p.sub_category || "").toLowerCase().includes(tile.query) ||
            (p.name || "").toLowerCase().includes(tile.query)
          );
          if (match) {
            imgMap[tile.label] = match.main_image_url ||
              (match.images?.length > 0 ? match.images[0].image_url : null);
          }
        });
        setCategoryImages(imgMap);

        setAllProducts(all);
        setNewProducts([...all].sort((a, b) => b.id - a.id).slice(0, 16));
        setFeaturedProducts(all.filter(p => p.is_featured).slice(0, 16));

        // Recommended for You — personalised results topped up with randoms to always fill 16
        let recs = [];
        if (hasConsentedToCookies()) {
          const topCats = getTopVisitedCategories(5);
          if (topCats.length > 0) {
            recs = all
              .filter(p => {
                const cat = (p.category || "").toLowerCase();
                const sub = (p.sub_category || "").toLowerCase();
                return topCats.some(c => cat.includes(c) || sub.includes(c) || c.includes(cat));
              })
              .sort((a, b) => {
                const score = (p) => {
                  const cat = (p.category || "").toLowerCase();
                  const sub = (p.sub_category || "").toLowerCase();
                  const idx = topCats.findIndex(c => cat.includes(c) || sub.includes(c) || c.includes(cat));
                  return idx === -1 ? 999 : idx;
                };
                return score(a) - score(b);
              })
              .slice(0, 16);
          }
        }
        // Top up with randoms if fewer than 16 personalised results (or no history yet)
        if (recs.length < 16 && all.length > 0) {
          const recIds = new Set(recs.map(p => p.id));
          const extras = [...all]
            .filter(p => !recIds.has(p.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 16 - recs.length);
          recs = [...recs, ...extras];
        }
        setRecommendedProducts(recs);
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));

    axios.get(`${BASE}/api/shops/`).then(res => setAllShops(res.data)).catch(() => {});
  }, []);

  // Search logic
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults({ products: [], shops: [] }); setShowDropdown(false); return; }
    const products = allProducts.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.sub_category || "").toLowerCase().includes(q)
    ).slice(0, 5);
    const shops = allShops.filter(s =>
      (s.name || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
    ).slice(0, 4);
    setSearchResults({ products, shops });
    setShowDropdown(true);
  }, [searchQuery, allProducts, allShops]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCategoryClick = (tile) => {
    setCategoryFilter(tile.label);
    navigate(`/browse?category=${encodeURIComponent(tile.label)}`, { replace: true });
    setTimeout(() => {
      storesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
      setTimeout(() => {
        storesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>

      {/* ── Sticky header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "#fff", borderBottom: "1px solid #e5e7eb",
      }}>
        <div style={{
          padding: "0 20px", height: "52px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
        }}>
          {/* Left side */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <Link to="/" style={{ flexShrink: 0, marginRight: "4px" }}>
              <img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} />
            </Link>

            {/* Sell on Abatrades — desktop only */}
            <Link to="/join" className="know-more-link" style={{
              display: "flex", flexDirection: "column", padding: "0 12px",
              borderLeft: "1px solid #e2e8f0", textDecoration: "none", height: "36px", justifyContent: "center",
            }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Make money</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Sell on Abatrades</span>
            </Link>

            {/* Warehouse & Logistics — desktop only */}
            <Link to="/services" className="know-more-link" style={{
              display: "flex", flexDirection: "column", padding: "0 12px",
              borderLeft: "1px solid #e2e8f0", textDecoration: "none", height: "36px", justifyContent: "center",
            }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Storage & delivery</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Warehouse & Logistics</span>
            </Link>

          </div>

          {/* Search bar — desktop */}
          <div ref={searchRef} className="search-desktop" style={{ flex: 1, maxWidth: "520px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
              <svg style={{ flexShrink: 0, marginLeft: "12px", color: "#9ca3af" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                style={{ flex: 1, border: "none", background: "transparent", padding: "9px 12px", fontSize: "13px", outline: "none", color: "#111827" }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0 10px", color: "#9ca3af", fontSize: "16px", lineHeight: 1 }}>✕</button>
              )}
            </div>
            {/* Dropdown */}
            {showDropdown && (searchResults.products.length > 0 || searchResults.shops.length > 0) && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", zIndex: 300, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: "400px", overflowY: "auto" }}>
                {searchResults.products.length > 0 && (<>
                  <div style={{ padding: "8px 14px 4px", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase" }}>Products</div>
                  {searchResults.products.map(p => {
                    const img = p.main_image_url || p.images?.[0]?.image_url;
                    return (
                      <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); setShowDropdown(false); setSearchQuery(""); }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "#f3f4f6", overflow: "hidden" }}>
                          {img && <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>{p.category || p.sub_category}</div>
                        </div>
                      </div>
                    );
                  })}
                </>)}
                {searchResults.shops.length > 0 && (<>
                  <div style={{ padding: "8px 14px 4px", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase", borderTop: searchResults.products.length > 0 ? "1px solid #f3f4f6" : "none" }}>Stores</div>
                  {searchResults.shops.map(s => (
                    <div key={s.id} onClick={() => { navigate(`/shop/${s.slug}`); setShowDropdown(false); setSearchQuery(""); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#3b7bf8", fontSize: "15px", overflow: "hidden" }}>
                        {s.logo_url ? <img src={s.logo_url} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{s.name}</div>
                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>{s.product_count} products</div>
                      </div>
                    </div>
                  ))}
                </>)}
              </div>
            )}
          </div>

          {/* Search icon — mobile only */}
          <button
            className="search-mobile-btn"
            onClick={() => { setMobileSearchOpen(p => !p); setTimeout(() => mobileInputRef.current?.focus(), 50); }}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "6px", color: "#374151" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Right side — desktop only */}
          <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>

            {/* Deliver to */}
            <div className="know-more-link" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0 12px", borderRight: "1px solid #e2e8f0", cursor: "default" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Deliver to</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Nigeria
              </span>
            </div>

            {/* Want to know more */}
            <Link to="/knowledge-base" className="know-more-link" style={{ display: "flex", flexDirection: "column", padding: "0 12px", borderRight: "1px solid #e2e8f0", textDecoration: "none" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Want to know more?</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Click here</span>
            </Link>

            {/* Sign in nudge (logged out) or Account (logged in) */}
            {user ? (
              <Link to={user.user_type === "seller" ? "/seller/overview" : "/user-profile"}
                style={{ display: "flex", flexDirection: "column", padding: "0 12px", borderRight: "1px solid #e2e8f0", textDecoration: "none" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Hello, {user.first_name || "there"}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Account
                </span>
              </Link>
            ) : (
              <Link to="/signin"
                style={{ display: "flex", flexDirection: "column", padding: "0 12px", borderRight: "1px solid #e2e8f0", textDecoration: "none" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Sign in for deals</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "3px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Sign In
                </span>
              </Link>
            )}

            {/* Notifications (logged in only) */}
            {user && (
              <button style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 10px", background: "none", border: "none", cursor: "pointer", borderRight: "1px solid #e2e8f0", position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500, marginTop: "2px" }}>Alerts</span>
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", textDecoration: "none", position: "relative", borderRight: "1px solid #e2e8f0" }}>
              <div style={{ position: "relative" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#f97316", color: "#fff", borderRadius: "999px", fontSize: "9px", fontWeight: 800, minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>Your</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Cart</span>
              </div>
            </Link>

            {/* Home */}
            <Link to="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500, marginTop: "2px" }}>Home</span>
            </Link>

          </div>

          {/* Mobile: stacked label items */}
          <div className="header-mobile" style={{ display: "none", alignItems: "center", gap: "2px", flexShrink: 0 }}>

            {/* Deliver to */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0 8px", borderRight: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>Deliver to</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "2px" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Nigeria
              </span>
            </div>

            {/* Account */}
            {user ? (
              <Link to={user.user_type === "seller" ? "/seller/overview" : "/user-profile"}
                style={{ display: "flex", flexDirection: "column", padding: "0 8px", borderRight: "1px solid #e2e8f0", textDecoration: "none" }}>
                <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>Hello, {user.first_name || "there"}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>My Account</span>
              </Link>
            ) : (
              <Link to="/signin"
                style={{ display: "flex", flexDirection: "column", padding: "0 8px", borderRight: "1px solid #e2e8f0", textDecoration: "none" }}>
                <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>Sign in for deals</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>Sign In</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "0 8px", textDecoration: "none", position: "relative" }}>
              <div style={{ position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#f97316", color: "#fff", borderRadius: "999px", fontSize: "8px", fontWeight: 800, minWidth: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>Your</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>Cart</span>
              </div>
            </Link>

          </div>
        </div>

        {/* Mobile expanded search bar */}
        {mobileSearchOpen && (
          <div ref={searchRef} className="search-mobile-expanded" style={{ padding: "8px 12px", borderTop: "1px solid #f3f4f6", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
              <svg style={{ flexShrink: 0, marginLeft: "12px", color: "#9ca3af" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                style={{ flex: 1, border: "none", background: "transparent", padding: "9px 12px", fontSize: "13px", outline: "none", color: "#111827" }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0 10px", color: "#9ca3af", fontSize: "16px", lineHeight: 1 }}>✕</button>
              )}
            </div>
            {showDropdown && (searchResults.products.length > 0 || searchResults.shops.length > 0) && (
              <div style={{ position: "absolute", top: "calc(100% - 8px)", left: "12px", right: "12px", background: "#fff", border: "1px solid #e5e7eb", zIndex: 300, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: "360px", overflowY: "auto" }}>
                {searchResults.products.length > 0 && (<>
                  <div style={{ padding: "8px 14px 4px", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase" }}>Products</div>
                  {searchResults.products.map(p => {
                    const img = p.main_image_url || p.images?.[0]?.image_url;
                    return (
                      <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); setShowDropdown(false); setSearchQuery(""); setMobileSearchOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "#f3f4f6", overflow: "hidden" }}>
                          {img && <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>{p.category || p.sub_category}</div>
                        </div>
                      </div>
                    );
                  })}
                </>)}
                {searchResults.shops.length > 0 && (<>
                  <div style={{ padding: "8px 14px 4px", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase", borderTop: searchResults.products.length > 0 ? "1px solid #f3f4f6" : "none" }}>Stores</div>
                  {searchResults.shops.map(s => (
                    <div key={s.id} onClick={() => { navigate(`/shop/${s.slug}`); setShowDropdown(false); setSearchQuery(""); setMobileSearchOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#3b7bf8", fontSize: "15px", overflow: "hidden" }}>
                        {s.logo_url ? <img src={s.logo_url} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{s.name}</div>
                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>{s.product_count} products</div>
                      </div>
                    </div>
                  ))}
                </>)}
              </div>
            )}
          </div>
        )}

        {/* Nav bar */}
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", alignItems: "stretch", minWidth: "max-content", padding: "0 12px" }}>
            {NAV_ITEMS.map(item => {
              const isActive = activeNav === item;
              return (
                <button key={item}
                  onClick={() => setActiveNav(prev => prev === item ? "" : item)}
                  style={{
                    padding: "0 14px", height: "36px", background: "none", border: "none",
                    borderBottom: isActive ? "2px solid #111827" : "2px solid transparent",
                    color: isActive ? "#111827" : "#6b7280",
                    fontSize: "12.5px", fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.15s", flexShrink: 0,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* ════════════════════════════
          HERO BANNER
      ════════════════════════════ */}
      <div className="hero-banner" style={{
        position: "relative",
        width: "100%",
        height: "220px",
        overflow: "hidden",
        background: "#fff",
      }}>
        {/* Background image */}
        <img
          src="/hero/banner.jpg"
          alt="Hero banner"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        {/* Dark overlay at top for text readability */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0.7) 75%, #fff 100%)",
        }} />

        {/* Top text + logo */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "20px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <img src={LargeLogo} alt="Abatrades" className="banner-logo" style={{ height: "48px", opacity: 0.95, filter: "brightness(10)" }} />
          <div style={{ textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontSize: "clamp(13px, 2vw, 18px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.5px",
              lineHeight: 1.3,
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
            }}>
              Join us.&nbsp; Own a store.&nbsp; Get paid.
            </p>
            <Link to="/join" style={{
              display: "inline-block",
              marginTop: "8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              background: "#f97316",
              padding: "5px 16px",
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}>
              Open a store
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════
          CATEGORY GRID  (4×4 / 3×3)
      ════════════════════════════ */}
      <div className="cat-grid-wrapper" style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 28px, #fff 52px)", padding: "8px 40px 20px", marginTop: "-48px", position: "relative", zIndex: 1 }}>
        {/* Decorative text above category tiles */}
        <p style={{ margin: "0 0 6px", lineHeight: 1.15 }}>
          <span style={{ fontSize: "11px", fontWeight: 300, color: "#b0b8c6", fontStyle: "italic", letterSpacing: "0.8px", textTransform: "lowercase" }}>find your </span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#3b7bf8", fontStyle: "italic", letterSpacing: "-0.2px" }}>guilty pleasure.</span>
        </p>
        <div className="cat-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2px",
          background: "#e5e7eb",
        }}>
          {CATEGORY_TILES.map((tile, i) => (
            <div key={tile.label} className={i === 8 ? "cat-hide-desktop" : ""}>
              <CategoryTile
                tile={tile}
                image={tile.image}
                onClick={() => handleCategoryClick(tile)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════
          HORIZONTAL PRODUCT ROWS
      ════════════════════════════ */}
      {!loadingProducts && (
        <div className="product-rows-wrap" style={{ background: "#fff", marginTop: "2px", paddingTop: "20px", paddingBottom: "12px" }}>

          {recommendedProducts.length > 0 && (
            <>
              <RecommendedRow
                products={recommendedProducts}
                onCardClick={handleCardClick}
              />
              <div style={{ height: "1px", background: "#f3f4f6", margin: "16px 0" }} />
            </>
          )}

          <ProductRow
            title="New Arrivals"
            products={newProducts}
            onCardClick={handleCardClick}
          />

          {featuredProducts.length > 0 && (
            <>
              <div style={{ height: "1px", background: "#f3f4f6", margin: "16px 0" }} />
              <ProductRow
                title="Featured Picks"
                products={featuredProducts}
                onCardClick={handleCardClick}
              />
            </>
          )}

        </div>
      )}

      {/* ════════════════════════════
          STORE DIRECTORY
      ════════════════════════════ */}
      <div ref={storesSectionRef}>
        <FeaturedShops activeNav={activeNav} categoryFilter={categoryFilter} />
      </div>

      <style>{`
        *::-webkit-scrollbar { display: none; }

        /* Desktop: hide 9th tile, bigger label, smaller tiles */
        @media (min-width: 641px) {
          .cat-hide-desktop { display: none !important; }
          .cat-tile-label { font-size: 11px !important; }
          .cat-grid-wrapper { padding: 8px 100px 20px !important; margin-top: -48px !important; }
          .search-mobile-btn { display: none !important; }
          .search-mobile-expanded { display: none !important; }
          .banner-logo { height: 72px !important; }
          .browse-pad { padding-left: 100px !important; padding-right: 100px !important; }
          .browse-pad-scroll { padding-left: 100px !important; padding-right: 100px !important; }
          .rec-boxes-container {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
            gap: 10px !important;
            overflow: visible !important;
          }
        }

        /* Mobile: hide desktop elements, show mobile ones */
        @media (max-width: 640px) {
          .search-desktop { display: none !important; }
          .search-mobile-btn { display: flex !important; align-items: center; justify-content: center; }
          .know-more-link { display: none !important; }
          .header-right { display: none !important; }
          .header-mobile { display: flex !important; }
        }

        /* Mobile: 3-column grid (3×3 = 9 tiles) + consistent padding */
        @media (max-width: 640px) {
          .hero-banner {
            height: 180px !important;
          }
          .cat-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .cat-grid-wrapper {
            padding: 6px 16px 16px !important;
            margin-top: -40px !important;
          }
          .product-rows-wrap {
            padding-top: 12px !important;
            margin-top: 0 !important;
          }
          .browse-pad {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .browse-pad-scroll {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .rec-boxes-container {
            display: flex !important;
            gap: 10px !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            flex-wrap: nowrap !important;
            scrollbar-width: none !important;
          }
          .rec-box {
            flex-shrink: 0 !important;
            width: 220px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowsePage;
