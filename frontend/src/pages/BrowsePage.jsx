import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import FeaturedShops from "../components/FeaturedShops";
import Logo from "../assets/img/abatrades-logo-other.png";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const NAV_ITEMS = [
  "Best Sellers",
  "New Releases",
  "Today's Deals",
  "Top Rated",
  "Fashion",
  "Electronics",
  "Beauty",
  "Food & Groceries",
  "Home & Living",
  "Sports",
  "Under ₦5,000",
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
      style={{ flexShrink: 0, width: "140px", cursor: "pointer" }}
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
        color: "#111827", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
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

/* ══════════════════════════════
    MAIN BROWSE PAGE
══════════════════════════════ */
const BrowsePage = () => {
  const { user } = useAuth();
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
          <Link to="/" style={{ flexShrink: 0 }}>
            <img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} />
          </Link>

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

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {user ? (
              <Link to={user.user_type === "seller" ? "/seller/overview" : "/user-profile"}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: "#eff6ff" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            ) : (
              <Link to="/signin"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: "#f1f5f9" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}
            <Link to="/"
              style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "5px 12px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Home
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

        {/* Orange nav */}
        <div style={{ background: "#f97316", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", alignItems: "stretch", minWidth: "max-content", padding: "0 12px" }}>
            {NAV_ITEMS.map(item => {
              const isActive = activeNav === item;
              return (
                <button key={item}
                  onClick={() => setActiveNav(prev => prev === item ? "" : item)}
                  style={{
                    padding: "0 14px", height: "38px", background: "none", border: "none",
                    borderBottom: isActive ? "2px solid #fff" : "2px solid transparent",
                    color: "#fff", fontSize: "13px", fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", whiteSpace: "nowrap",
                    opacity: isActive ? 1 : 0.92, transition: "all 0.15s", flexShrink: 0,
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
        {/* Fade to white at bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 70%, #fff 100%)",
        }} />
      </div>

      {/* ════════════════════════════
          CATEGORY GRID  (4×4 / 3×3)
      ════════════════════════════ */}
      <div className="cat-grid-wrapper" style={{ background: "#fff", padding: "20px 40px" }}>
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
          .cat-grid-wrapper { padding: 20px 100px !important; }
          .search-mobile-btn { display: none !important; }
          .search-mobile-expanded { display: none !important; }
        }

        /* Mobile: hide desktop search bar, show icon */
        @media (max-width: 640px) {
          .search-desktop { display: none !important; }
          .search-mobile-btn { display: flex !important; align-items: center; justify-content: center; }
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
            padding: 16px !important;
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
        }
      `}</style>
    </div>
  );
};

export default BrowsePage;
