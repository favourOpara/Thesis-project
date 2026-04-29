import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import InquiryModal from "../components/InquiryModal";
import { addProductToHistory } from "../utils/localHistory";
import { hasConsentedToCookies } from "../utils/cookieConsent";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtPrice = (p) =>
  parseFloat(p).toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });

/* ── Icons ── */
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const MsgIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ── Product Details ── */
const ProductDetails = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { addToCart } = useCart();
  const { user }  = useAuth();
  const isSeller  = user?.user_type === "seller";

  const [product, setProduct]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [shop, setShop]                   = useState(null);
  const [showInquiry, setShowInquiry]     = useState(false);
  const [qty, setQty]                     = useState(1);
  const [adding, setAdding]               = useState(false);
  const [activeImg, setActiveImg]         = useState(0);
  const [touchStartX, setTouchStartX]     = useState(null);
  const [descOpen, setDescOpen]           = useState(true);
  const [otherStores, setOtherStores]     = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [showMoreSimilar, setShowMoreSimilar] = useState(false);
  const [showMoreStores, setShowMoreStores]   = useState(false);
  const INITIAL = 4;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE}/api/products/${id}/`);
        const productData = response.data;
        setProduct(productData);
        setActiveImg(0);

        // Fetch similar products (same category, exclude current)
        if (productData.category) {
          const simRes = await axios.get(
            `${BASE}/api/products/?search=${encodeURIComponent(productData.category)}`
          );
          const sim = simRes.data
            .filter(p => p.id !== productData.id)
            .slice(0, 8);
          setSimilarProducts(sim);
        }

        const shopsRes = await axios.get(`${BASE}/api/shops/`);
        if (productData.owner) {
          const ownerShop = shopsRes.data.find((s) => s.owner_email === productData.owner);
          if (ownerShop) setShop(ownerShop);
          // Other stores: exclude the owner's shop
          const others = shopsRes.data
            .filter(s => s.owner_email !== productData.owner)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
          setOtherStores(others);
        } else {
          const others = shopsRes.data.sort(() => Math.random() - 0.5).slice(0, 6);
          setOtherStores(others);
        }
      } catch {
        toast.error("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product && hasConsentedToCookies()) addProductToHistory(product);
  }, [product]);

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  if (loading) return <Spinner />;
  if (!product) return (
    <>
      <Header />
      <div style={{ textAlign: "center", paddingTop: "160px" }}>
        <h3 style={{ fontWeight: 700, color: "#0f172a" }}>Product not found</h3>
        <Link to="/" style={{ color: "#2563eb" }}>Back to Home</Link>
      </div>
    </>
  );

  /* Build deduplicated image list */
  const imgSet = new Set();
  if (product.main_image_url) {
    imgSet.add(product.main_image_url.startsWith("http") ? product.main_image_url : `${BASE}${product.main_image_url}`);
  }
  (product.images || []).forEach(img => {
    const url = img.image_url?.startsWith("http") ? img.image_url : `${BASE}${img.image_url}`;
    imgSet.add(url);
  });
  const images = imgSet.size > 0 ? [...imgSet] : ["/OIP.png"];

  const meta = [
    product.category    && { label: "Category",    value: product.category },
    product.sub_category && { label: "Sub-category", value: product.sub_category },
    product.gender      && { label: "Gender",      value: product.gender },
    product.material_type && { label: "Material",  value: product.material_type },
    product.brand       && { label: "Brand",       value: product.brand },
    product.quantity !== undefined && { label: "In Stock", value: `${product.quantity} available` },
  ].filter(Boolean);

  return (
    <>
      <Header />
      <ToastContainer position="bottom-center" />

      <div style={{
        background: "#fff", minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "100px 16px 60px",
      }}>

        {/* ── Top nav row: back button + breadcrumb ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#94a3b8" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            {shop ? (
              <>
                <Link to={`/shop/${shop.slug}`} style={{ color: "#94a3b8", textDecoration: "none" }}>{shop.name}</Link>
                <span>/</span>
              </>
            ) : null}
            <span style={{ color: "#0f172a", fontWeight: 500 }}>{product.name}</span>
          </div>

          {/* Browse stores */}
          <Link
            to="/browse"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              fontSize: "13px", color: "#64748b", fontWeight: 500,
              textDecoration: "none", padding: "5px 10px",
              borderRadius: "7px", border: "1px solid #e2e8f0",
              background: "#fff", transition: "all 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Browse Stores
          </Link>
        </div>

        {/* ── Main two-column layout ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }} className="pd-grid">

          {/* ── LEFT: Image gallery ── */}
          <div>
            {/* Main image box — fixed aspect ratio, white background */}
            <div
              onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={e => {
                if (touchStartX === null || images.length <= 1) return;
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setActiveImg(i => (i + 1) % images.length);
                  else setActiveImg(i => (i - 1 + images.length) % images.length);
                }
                setTouchStartX(null);
              }}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <img
                src={images[activeImg]}
                alt={product.name}
                onError={e => { e.target.src = "/OIP.png"; }}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  padding: "16px",
                }}
              />

              {/* Prev / Next arrows — only if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    style={{
                      position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0",
                      borderRadius: "50%", width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    style={{
                      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0",
                      borderRadius: "50%", width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{
                display: "flex", gap: "8px", marginTop: "12px",
                overflowX: "auto", paddingBottom: "4px",
                scrollbarWidth: "none",
              }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      flexShrink: 0,
                      width: "68px", height: "68px",
                      borderRadius: "10px",
                      border: i === activeImg ? "2px solid #2563eb" : "2px solid #e2e8f0",
                      background: "#ffffff",
                      overflow: "hidden",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      onError={e => { e.target.src = "/OIP.png"; }}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product info ── */}
          <div>

            {/* Name */}
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "0 0 10px", lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f97316", marginBottom: "16px" }}>
              {fmtPrice(product.price)}
            </div>

            {/* Stock badge */}
            <div style={{ marginBottom: "20px" }}>
              {product.quantity > 0 ? (
                <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
                  In stock — {product.quantity} available
                </span>
              ) : (
                <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "999px" }}>
                  Out of stock
                </span>
              )}
            </div>

            <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "20px" }} />

            {/* Meta info */}
            {meta.length > 0 && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "10px 20px", marginBottom: "20px",
              }}>
                {meta.map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: "13.5px", color: "#0f172a", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Size selector */}
            {product.size?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Size {selectedSizes.length > 0 && <span style={{ color: "#2563eb" }}>— {selectedSizes.join(", ")}</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.size.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        padding: "7px 16px",
                        border: selectedSizes.includes(size) ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                        background: selectedSizes.includes(size) ? "#eff6ff" : "#fff",
                        color: selectedSizes.includes(size) ? "#2563eb" : "#374151",
                        borderRadius: "8px", fontWeight: 600, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty picker */}
            {!isSeller && product.quantity > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qty</span>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: "1.5px solid #e2e8f0", borderRadius: "9px",
                  overflow: "hidden",
                }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: "36px", height: "36px", border: "none", background: "#f8fafc", fontWeight: 700, fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <span style={{ width: "40px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.quantity, q + 1))}
                    style={{ width: "36px", height: "36px", border: "none", background: "#f8fafc", fontWeight: 700, fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            {!isSeller && (
              <button
                onClick={async () => {
                  if (!user) { navigate("/signin"); return; }
                  setAdding(true);
                  try {
                    await addToCart(product.id, qty);
                    toast.success("Added to cart!");
                  } catch {
                    toast.error("Could not add to cart.");
                  } finally {
                    setAdding(false);
                  }
                }}
                disabled={adding || product.quantity === 0}
                style={{
                  width: "100%", padding: "13px",
                  background: product.quantity > 0 ? "#2563eb" : "#94a3b8",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontWeight: 700, fontSize: "15px", cursor: product.quantity > 0 ? "pointer" : "not-allowed",
                  marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (product.quantity > 0 && !adding) e.currentTarget.style.background = "#1d4ed8"; }}
                onMouseLeave={e => { if (product.quantity > 0) e.currentTarget.style.background = "#2563eb"; }}
              >
                <CartIcon />
                {product.quantity === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
              </button>
            )}

            {/* Ask seller */}
            <button
              onClick={() => setShowInquiry(true)}
              disabled={!shop}
              style={{
                width: "100%", padding: "12px",
                background: "transparent", color: "#2563eb",
                border: "1.5px solid #bfdbfe", borderRadius: "10px",
                fontWeight: 600, fontSize: "14px", cursor: shop ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (shop) { e.currentTarget.style.background = "#eff6ff"; } }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <MsgIcon />
              {shop ? "Ask Seller a Question" : "Loading seller info…"}
            </button>

            {/* Sold by */}
            {shop && (
              <div style={{ marginTop: "16px", padding: "12px 14px", background: "#f8fafc", borderRadius: "9px", border: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Sold by </span>
                <Link
                  to={`/shop/${shop.slug}`}
                  style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                >
                  {shop.name} →
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* ── Description ── */}
        {product.description && (
          <div style={{ marginTop: "40px", background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <button
              onClick={() => setDescOpen(o => !o)}
              style={{
                width: "100%", padding: "16px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: "14px", color: "#0f172a",
              }}
            >
              Product Description
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: descOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {descOpen && (
              <div style={{ padding: "0 20px 20px", fontSize: "14px", color: "#374151", lineHeight: 1.7, borderTop: "1px solid #f1f5f9" }}>
                <p style={{ margin: "16px 0 0" }}>{product.description}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Similar Products ── */}
        {similarProducts.length > 0 && (
          <div style={{ marginTop: "56px" }}>
            <div style={{ height: "1px", background: "#e2e8f0", marginBottom: "32px" }} />

            <h3 style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", margin: "0 0 4px" }}>
              Similar Products
            </h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 20px" }}>
              More from {product.category}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }} className="pd-similar-grid">
              {(showMoreSimilar ? similarProducts : similarProducts.slice(0, INITIAL)).map(p => {
                const img = p.main_image_url ||
                  (p.images?.length > 0 ? p.images[0].image_url : "/OIP.png");
                return (
                  <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      background: "#fff", borderRadius: "14px",
                      border: "1px solid #f1f5f9", overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "all 0.2s", cursor: "pointer",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      {/* Image — white bg, contain */}
                      <div style={{
                        aspectRatio: "1 / 1", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden", borderBottom: "1px solid #f1f5f9",
                        padding: "12px",
                      }}>
                        <img
                          src={img}
                          alt={p.name}
                          onError={e => { e.target.src = "/OIP.png"; }}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>
                      {/* Info */}
                      <div style={{ padding: "12px" }}>
                        <div style={{
                          fontWeight: 600, fontSize: "13px", color: "#0f172a",
                          marginBottom: "4px", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {p.name}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "14px", color: "#2563eb" }}>
                          {fmtPrice(p.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {similarProducts.length > INITIAL && (
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  onClick={() => setShowMoreSimilar(p => !p)}
                  style={{
                    padding: "10px 28px",
                    background: showMoreSimilar ? "#f1f5f9" : "#0f172a",
                    color: showMoreSimilar ? "#374151" : "#fff",
                    border: "none", borderRadius: "9px",
                    fontWeight: 700, fontSize: "13.5px", cursor: "pointer",
                  }}
                >
                  {showMoreSimilar ? "Show Less" : `Show More (${similarProducts.length - INITIAL} more)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Explore More Stores ── */}
        {otherStores.length > 0 && (
          <div style={{ marginTop: "56px", paddingBottom: "60px" }}>
            <div style={{ height: "1px", background: "#e2e8f0", marginBottom: "32px" }} />

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
                  background: "#eff6ff", whiteSpace: "nowrap",
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
            }} className="pd-other-stores-grid">
              {(showMoreStores ? otherStores : otherStores.slice(0, INITIAL)).map(store => (
                <Link key={store.slug} to={`/shop/${store.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "#fff", borderRadius: "14px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    overflow: "hidden", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Mini banner */}
                    <div style={{
                      height: "64px", position: "relative",
                      background: store.banner_url
                        ? `url(${store.banner_url}) center/cover`
                        : "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)",
                    }}>
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

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .pd-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .pd-similar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .pd-other-stores-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>

      {shop && (
        <InquiryModal
          show={showInquiry}
          onClose={() => setShowInquiry(false)}
          shop={shop}
          product={product}
        />
      )}
    </>
  );
};

export default ProductDetails;
