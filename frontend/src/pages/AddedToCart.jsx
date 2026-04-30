import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtNGN = (p) =>
  parseFloat(p || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const AddedToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const product = location.state?.product;

  const [similarStores, setSimilarStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);

  /* Redirect if landed here directly without state */
  useEffect(() => {
    if (!product) { navigate("/browse", { replace: true }); }
  }, [product, navigate]);

  /* Fetch stores selling in the same category */
  useEffect(() => {
    if (!product) return;
    axios.get(`${BASE}/api/shops/`)
      .then(res => {
        const all = res.data || [];
        const cat = (product.category || "").toLowerCase();
        /* Prefer stores whose category list overlaps, otherwise random */
        let matched = all.filter(s =>
          s.categories?.some(c => c.toLowerCase().includes(cat) || cat.includes(c.toLowerCase()))
        );
        if (matched.length < 4) matched = all;
        /* Shuffle and take 6 */
        const shuffled = matched.sort(() => Math.random() - 0.5).slice(0, 6);
        setSimilarStores(shuffled);
      })
      .catch(() => {})
      .finally(() => setStoresLoading(false));
  }, [product]);

  if (!product) return null;

  const img = product.main_image_url
    || (product.images?.[0]?.image_url)
    || "/OIP.png";

  const { item_count = 0, total = 0 } = cart;

  return (
    <>
      <Header />
      <div style={{ background: "#eaecf0", minHeight: "100vh", paddingTop: "80px", paddingBottom: "64px" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 20px 0" }}>

          {/* ── Confirmation card ── */}
          <div style={{
            background: "#fff", border: "1px solid #d5d9d9",
            borderRadius: "6px", overflow: "hidden", marginBottom: "22px",
          }}>
            {/* Green header bar */}
            <div style={{
              background: "#2e7d32", padding: "10px 22px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "15px" }}>
                Added to Cart
              </span>
            </div>

            {/* Body: item info + action buttons side by side */}
            <div style={{
              padding: "20px 22px",
              display: "flex", gap: "24px",
              flexWrap: "wrap", alignItems: "flex-start",
            }}>
              {/* Item preview */}
              <div style={{ display: "flex", gap: "16px", flex: 1, minWidth: "240px" }}>
                <div style={{
                  width: "110px", height: "110px", flexShrink: 0,
                  border: "1px solid #e8ecee", borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fff", overflow: "hidden",
                }}>
                  <img
                    src={img} alt={product.name}
                    onError={e => { e.target.src = "/OIP.png"; }}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "14.5px", color: "#0f172a", margin: "0 0 6px", lineHeight: 1.4 }}>
                    {product.name}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: "17px", color: "#0f172a", margin: "0 0 6px" }}>
                    {fmtNGN(product.price)}
                  </p>
                  {product.quantity > 0 && (
                    <span style={{ fontSize: "12.5px", color: "#007600", fontWeight: 400 }}>In Stock</span>
                  )}
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "200px", width: "220px" }}>
                <button
                  onClick={() => navigate("/cart")}
                  style={{
                    background: "#f97316", border: "1px solid #e07b0d",
                    color: "#fff", borderRadius: "20px", padding: "9px 16px",
                    fontWeight: 600, fontSize: "14px", cursor: "pointer",
                    width: "100%", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e8690b"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; }}
                >
                  Go to Cart{item_count > 0 ? ` (${item_count})` : ""}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    background: "#f0f2f2", border: "1px solid #d5d9d9",
                    color: "#0f172a", borderRadius: "20px", padding: "9px 16px",
                    fontWeight: 500, fontSize: "13.5px", cursor: "pointer",
                    width: "100%", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e3e6e6"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f0f2f2"; }}
                >
                  Continue Shopping
                </button>
                {item_count > 0 && (
                  <p style={{ fontSize: "12px", color: "#565959", margin: 0, textAlign: "center" }}>
                    Cart subtotal: <strong>{fmtNGN(total)}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── More stores to explore ── */}
          <div style={{ background: "#fff", border: "1px solid #d5d9d9", borderRadius: "6px", padding: "20px 22px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "17px", color: "#0f172a", margin: "0 0 18px" }}>
              More stores to explore
            </h2>

            {storesLoading ? (
              <div style={{ display: "flex", gap: "14px" }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ flex: "0 0 200px", height: "140px", background: "#f1f5f9", borderRadius: "6px", animation: "pulse 1.4s infinite" }} />
                ))}
              </div>
            ) : similarStores.length === 0 ? (
              <p style={{ color: "#565959", fontSize: "14px" }}>No stores found.</p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "14px",
              }}>
                {similarStores.map(store => (
                  <Link
                    key={store.id || store.slug}
                    to={`/shop/${store.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <StoreCard store={store} />
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <Footer />
    </>
  );
};

/* ── Store card ── */
const StoreCard = ({ store }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? "#f97316" : "#d5d9d9"}`,
        borderRadius: "6px", overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        background: "#fff",
      }}
    >
      {/* Banner */}
      <div style={{
        height: "70px",
        background: store.banner_url
          ? `url(${store.banner_url}) center/cover no-repeat`
          : "linear-gradient(135deg, #232f3e 0%, #37475a 60%, #485769 100%)",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{
          position: "absolute", bottom: "-16px", left: "14px",
          width: "34px", height: "34px", borderRadius: "6px",
          border: "2px solid #fff",
          background: store.logo_url
            ? `url(${store.logo_url}) center/cover`
            : "#f97316",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 700, color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}>
          {!store.logo_url && store.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "22px 14px 14px" }}>
        <p style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {store.name}
        </p>
        {store.tagline && (
          <p style={{ fontSize: "11.5px", color: "#565959", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {store.tagline}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11.5px", color: "#565959" }}>
            {store.product_count || 0} product{store.product_count !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: "11.5px", color: "#f97316", fontWeight: 600 }}>
            Visit store →
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddedToCart;
