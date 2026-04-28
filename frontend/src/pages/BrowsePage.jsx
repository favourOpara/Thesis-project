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
      <p style={{
        fontWeight: 700, fontSize: "15px", color: "#111827",
        margin: "0 0 12px", padding: "0 16px",
      }}>
        {title}
      </p>
      <div style={{
        display: "flex", gap: "2px",
        overflowX: "auto", overflowY: "hidden",
        padding: "0 16px 4px",
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

        setNewProducts([...all].sort((a, b) => b.id - a.id).slice(0, 16));
        setFeaturedProducts(all.filter(p => p.is_featured).slice(0, 16));
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleCategoryClick = (tile) => {
    setCategoryFilter(tile.label);
    navigate(`/browse?category=${encodeURIComponent(tile.label)}`, { replace: true });
    setTimeout(() => {
      storesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleCardClick = (product) => {
    const cat = product.category || "";
    setCategoryFilter(cat);
    navigate(`/browse?category=${encodeURIComponent(cat)}`, { replace: true });
    setTimeout(() => {
      storesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
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
          <Link to="/">
            <img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

      {/* ── Category filter banner ── */}
      {categoryFilter && (
        <div style={{
          background: "#fff7ed", borderBottom: "1px solid #fed7aa",
          padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "13px", color: "#9a3412", fontWeight: 600 }}>
            Showing stores for: <strong>{categoryFilter}</strong>
          </span>
          <button
            onClick={() => { setCategoryFilter(""); navigate("/browse", { replace: true }); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#ea580c", fontWeight: 700 }}
          >
            Clear ✕
          </button>
        </div>
      )}

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
        <div style={{ background: "#fff", marginTop: "2px", paddingTop: "20px", paddingBottom: "12px" }}>

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
        }

        /* Mobile: 3-column grid (3×3 = 9 tiles) */
        @media (max-width: 640px) {
          .cat-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .cat-grid-wrapper {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowsePage;
