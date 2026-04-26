import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import InquiryModal from "../components/InquiryModal";

const ShopPage = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  // Always scroll to top when navigating to a shop page
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [shopRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/shops/${slug}/`),
          axios.get(`http://localhost:8000/api/shops/${slug}/products/`),
        ]);
        setShop(shopRes.data);
        setProducts(productsRes.data);

        // Record visit (fire and forget)
        axios.post(`http://localhost:8000/api/shops/${slug}/visit/`).catch(() => {});
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  const formatPrice = (price) =>
    parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });

  if (loading) return <Spinner />;
  if (notFound) return (
    <>
      <Header />
      <div style={{ textAlign: "center", paddingTop: "160px" }}>
        <h3>Shop not found</h3>
        <Link to="/" className="btn btn-primary mt-3" style={{ backgroundColor: "#3b7bf8", border: "none" }}>
          Back to Home
        </Link>
      </div>
    </>
  );

  const bannerStyle = shop.banner_url
    ? { backgroundImage: `url(${shop.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(135deg, #3b7bf8 0%, #1a56db 100%)" };

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="shop-banner" style={{ ...bannerStyle, position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "flex-end",
        }}>
          <div className="shop-banner-inner">
            {shop.logo_url ? (
              <img
                src={shop.logo_url}
                alt={shop.name}
                className="shop-banner-avatar"
              />
            ) : (
              <div className="shop-banner-avatar shop-banner-avatar-placeholder">
                {shop.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="shop-banner-name">{shop.name}</h2>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                {shop.product_count} product{shop.product_count !== 1 ? "s" : ""} · {shop.visit_count.toLocaleString()} visits
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 20px", boxSizing: "border-box" }}>
        <div className="shop-layout" style={{
          display: "grid",
          gridTemplateColumns: "clamp(220px, 26%, 300px) 1fr",
          gap: "28px",
          alignItems: "start",
        }}>

          {/* Sidebar */}
          <div>
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: "90px" }}>
              {shop.description && (
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: 700, marginBottom: "8px" }}>About</h6>
                  <p style={{ fontSize: "14px", color: "#555", margin: 0, lineHeight: 1.6 }}>{shop.description}</p>
                </div>
              )}

              {(shop.whatsapp || shop.instagram || shop.website) && (
                <div style={{ marginBottom: "20px" }}>
                  <h6 style={{ fontWeight: 700, marginBottom: "12px" }}>Contact</h6>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {shop.whatsapp && (
                      <a
                        href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "8px", color: "#25D366", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.528 5.847L0 24l6.335-1.507A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.592-.45-5.124-1.247L2 22l1.263-4.773A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    {shop.instagram && (
                      <a
                        href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E1306C", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        @{shop.instagram.replace("@", "")}
                      </a>
                    )}
                    {shop.website && (
                      <a
                        href={shop.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "8px", color: "#3b7bf8", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b7bf8" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                        </svg>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowInquiry(true)}
                className="btn w-100"
                style={{
                  backgroundColor: "#3b7bf8", color: "white",
                  border: "none", borderRadius: "8px",
                  padding: "10px", fontWeight: 600, fontSize: "14px",
                }}
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>
                Products <span style={{ color: "#6c757d", fontWeight: 400 }}>({products.length})</span>
              </h5>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#6c757d" }}>
                <p style={{ fontSize: "18px" }}>No products listed yet.</p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}>
                {products.map((product) => {
                  const image = product.main_image_url ||
                    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{
                        background: "white", borderRadius: "10px",
                        overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
                        }}
                      >
                        <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                          <img
                            src={image}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "/OIP.png"; }}
                          />
                        </div>
                        <div style={{ padding: "12px" }}>
                          <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {product.name}
                          </p>
                          <p style={{ color: "#3b7bf8", fontWeight: 700, margin: 0, fontSize: "14px" }}>
                            {formatPrice(product.price)}
                          </p>
                          <p style={{ color: "#6c757d", fontSize: "12px", margin: "4px 0 0" }}>
                            {product.sub_category || product.category}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Banner ── */
        .shop-banner {
          height: 220px;
          margin-top: 56px;  /* matches compact header height */
        }
        .shop-banner-inner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 28px;
        }
        .shop-banner-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid white;
          object-fit: cover;
          flex-shrink: 0;
        }
        .shop-banner-avatar-placeholder {
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 700;
          color: #3b7bf8;
        }
        .shop-banner-name {
          color: white;
          margin: 0 0 4px;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.2;
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .shop-banner {
            height: 180px;
            margin-top: 52px;
          }
          .shop-banner-inner {
            gap: 12px;
            padding: 16px 16px;
          }
          .shop-banner-avatar {
            width: 52px;
            height: 52px;
            border-width: 2px;
          }
          .shop-banner-avatar-placeholder {
            font-size: 18px;
          }
          .shop-banner-name {
            font-size: 16px;
          }
          .shop-layout {
            grid-template-columns: 1fr !important;
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
