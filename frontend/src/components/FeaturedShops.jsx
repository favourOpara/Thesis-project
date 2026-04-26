import React, { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "./ShopCard";
import { Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── Horizontal scroll strip for a row of shop cards ── */
const ShopRow = ({ shops }) => {
  if (shops.length === 0) return null;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
      }}
    >
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};

/* ── Section header component ── */
const SectionHead = ({ eyebrow, title, subtitle, action }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "28px",
    }}
  >
    <div>
      <p
        style={{
          color: "#3b7bf8",
          fontWeight: 700,
          fontSize: "12px",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          margin: "0 0 6px",
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontWeight: 800,
          fontSize: "clamp(20px, 2.8vw, 28px)",
          margin: 0,
          color: "#111827",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: "14px" }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && action}
  </div>
);

/* ── Category browse tiles ── */
const CATEGORY_TILES = [
  { label: "Fashion & Apparel", icon: "👗", color: "#eff6ff", accent: "#3b7bf8" },
  { label: "Tech & Electronics", icon: "💻", color: "#f0fdf4", accent: "#16a34a" },
  { label: "Beauty & Wellness", icon: "💄", color: "#fdf4ff", accent: "#9333ea" },
  { label: "Food & Groceries", icon: "🛒", color: "#fff7ed", accent: "#ea580c" },
  { label: "Home & Living", icon: "🏠", color: "#f0f9ff", accent: "#0284c7" },
  { label: "Sports & Fitness", icon: "🏋️", color: "#f7fee7", accent: "#65a30d" },
];

const CategoryTiles = ({ onFilter }) => (
  <section style={{ padding: "40px 0 32px", background: "white" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
      <SectionHead
        eyebrow="Shop by Category"
        title="What are you looking for?"
        subtitle="Filter sellers by what they sell"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "14px",
        }}
      >
        {CATEGORY_TILES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onFilter(cat.label.split(" ")[0])}
            style={{
              background: cat.color,
              border: `1.5px solid ${cat.accent}22`,
              borderRadius: "16px",
              padding: "20px 14px",
              cursor: "pointer",
              textAlign: "center",
              transition: "transform 0.18s, box-shadow 0.18s",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${cat.accent}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>{cat.icon}</div>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: cat.accent }}>
              {cat.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  </section>
);

/* ── Main FeaturedShops component ── */
const FeaturedShops = () => {
  const [shops, setShops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE}/api/shops/`)
      .then((res) => {
        setShops(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = shops;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.categories && s.categories.some((c) => c.toLowerCase().includes(q)))
      );
    }
    if (activeFilter) {
      result = result.filter(
        (s) =>
          s.categories &&
          s.categories.some((c) => c.toLowerCase().includes(activeFilter.toLowerCase()))
      );
    }
    setFiltered(result);
  }, [search, activeFilter, shops]);

  const handleCategoryFilter = (cat) => {
    setActiveFilter((prev) => (prev === cat ? "" : cat));
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  };

  // Derive "trending" (top 4 by visit_count) and "new" (latest 4 by created_at)
  const trending = [...shops]
    .sort((a, b) => (b.visit_count || 0) - (a.visit_count || 0))
    .slice(0, 4);

  const newest = [...shops]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#9ca3af" }}>
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "36px", height: "36px" }}
        />
        <p style={{ marginTop: "14px", fontSize: "14px" }}>Loading sellers...</p>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <section style={{ padding: "80px 0", background: "#f8faff", textAlign: "center" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏪</div>
          <h4 style={{ fontWeight: 800, color: "#111827" }}>No sellers yet</h4>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            Be the first seller on Abatrades and reach thousands of buyers.
          </p>
          <Link
            to="/join"
            style={{
              background: "#3b7bf8",
              color: "white",
              padding: "12px 28px",
              borderRadius: "12px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Own a Store — It's Free
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Category browse tiles */}
      <CategoryTiles onFilter={handleCategoryFilter} />

      {/* Trending sellers section */}
      {trending.length > 0 && !search && !activeFilter && (
        <section style={{ padding: "48px 0 32px", background: "#f8faff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <SectionHead
              eyebrow="Most Popular"
              title="Trending Sellers"
              subtitle="The most-visited storefronts this week"
            />
            <ShopRow shops={trending} />
          </div>
        </section>
      )}

      {/* New sellers section */}
      {newest.length > 0 && !search && !activeFilter && (
        <section style={{ padding: "32px 0", background: "white" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <SectionHead
              eyebrow="Recently Joined"
              title="New on Abatrades"
              subtitle="Fresh storefronts just getting started"
            />
            <ShopRow shops={newest} />
          </div>
        </section>
      )}

      {/* Full directory */}
      <section id="discover" style={{ padding: "48px 0 64px", background: "#f8faff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <SectionHead
            eyebrow="Seller Directory"
            title={activeFilter ? `${activeFilter} Sellers` : "All Sellers"}
            subtitle={`${filtered.length} seller${filtered.length !== 1 ? "s" : ""} on the platform`}
            action={
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {activeFilter && (
                  <button
                    onClick={() => setActiveFilter("")}
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      borderRadius: "999px",
                      padding: "5px 14px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✕ {activeFilter}
                  </button>
                )}
                {/* Search */}
                <div style={{ position: "relative" }}>
                  <svg
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                    }}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search sellers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      padding: "9px 14px 9px 34px",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "13px",
                      outline: "none",
                      background: "white",
                      width: "220px",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b7bf8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>
            }
          />

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>🔍</div>
              <h5 style={{ fontWeight: 700, color: "#111827" }}>
                {search ? `No results for "${search}"` : `No ${activeFilter} sellers yet`}
              </h5>
              <p style={{ color: "#6b7280" }}>Try a different search or filter.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "22px",
              }}
            >
              {filtered.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedShops;
