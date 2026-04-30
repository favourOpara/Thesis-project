import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useSellerCtx, ac, BASE, fmtNGN,
  IconOrders, IconProducts, IconEye, IconInquiries,
  IconPlus, IconExternal, IconStore,
} from "../components/SellerLayout";

const SellerOverview = () => {
  const { shop, unreadCount, setPageTitle, setTopbarActions } = useSellerCtx();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [productCount, setProductCount] = useState("—");
  const [inquiryCount, setInquiryCount] = useState("—");
  const [orderCount,   setOrderCount]   = useState("—");
  const [revenue,      setRevenue]      = useState("—");

  useEffect(() => {
    setPageTitle("Overview");
    setTopbarActions(null);
  }, []);

  useEffect(() => {
    axios.get(`${BASE}/api/owner-products/`, ac())
      .then(r => setProductCount(r.data.length)).catch(() => {});
    if (shop) {
      axios.get(`${BASE}/api/inquiries/mine/`, ac())
        .then(r => setInquiryCount(r.data.length)).catch(() => {});
    }
    axios.get(`${BASE}/api/orders/seller/`, ac())
      .then(r => {
        setOrderCount(r.data.length);
        const total = r.data.reduce((sum, o) =>
          sum + o.items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0), 0);
        setRevenue(fmtNGN(total));
      }).catch(() => {});
  }, [shop]);

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 4px" }}>
          Welcome back, {user?.first_name || "Seller"}
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "13.5px" }}>
          {shop
            ? `"${shop.name}" is live — here's your snapshot.`
            : "You haven't set up your store yet."}
        </p>
      </div>

      {/* Premium status banner */}
      {shop?.is_premium && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          border: "1px solid #334155", borderRadius: "12px",
          padding: "14px 18px", marginBottom: "18px",
        }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 16l2-10 6 5 6-5 2 10"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#fff" }}>Premium Store — Active</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Member since {new Date(shop.premium_since).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              {" · "}Video customisation, text blocks, warehousing &amp; logistics are enabled.
            </div>
          </div>
          <Link to="/seller/premium" style={{ fontSize: "12.5px", color: "#fbbf24", fontWeight: 600, textDecoration: "none", background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: "7px", padding: "6px 14px", whiteSpace: "nowrap" }}>
            Manage →
          </Link>
        </div>
      )}

      {!shop && (
        <div className="sd-alert warning" style={{ marginBottom: "18px" }}>
          <div>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: "14px" }}>Store not set up</div>
            <div style={{ fontSize: "13px", color: "#a16207", marginTop: "2px" }}>
              Create your storefront so buyers can discover and contact you.
            </div>
          </div>
          <Link to="/seller/settings" className="sd-btn-primary" style={{ background: "#f59e0b" }}>
            Set Up Store
          </Link>
        </div>
      )}

      <div className="sd-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "Revenue",      value: revenue,                                  bg: "#f0fdf4", color: "#16a34a", Icon: IconOrders    },
          { label: "Orders",       value: orderCount,                               bg: "#eff6ff", color: "#2563eb", Icon: IconOrders    },
          { label: "Products",     value: productCount,                             bg: "#fdf4ff", color: "#7c3aed", Icon: IconProducts  },
          { label: "Store Visits", value: shop?.visit_count?.toLocaleString()||"0", bg: "#fff7ed", color: "#c2410c", Icon: IconEye       },
          { label: "Inquiries",    value: inquiryCount,                             bg: "#f1f5f9", color: "#475569", Icon: IconInquiries },
        ].map(s => (
          <div key={s.label} className="sd-stat-card">
            <div className="sd-stat-icon" style={{ background: s.bg, color: s.color }}>
              <s.Icon />
            </div>
            <div>
              <div className="sd-stat-value" style={{ color: s.color, fontSize: s.label === "Revenue" ? "16px" : "22px" }}>
                {s.value}
              </div>
              <div className="sd-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sd-card">
        <div className="sd-card-header">
          <p className="sd-card-title">Quick Actions</p>
        </div>
        <div className="sd-card-body">
          <div className="sd-quick-actions">
            <button className="sd-quick-btn" onClick={() => navigate("/add-product")}>
              <IconPlus /> Add Product
            </button>
            <Link to="/seller/orders" className="sd-quick-btn">
              <IconOrders /> Orders
            </Link>
            <Link to="/seller/inquiries" className="sd-quick-btn">
              <IconInquiries /> Inquiries {unreadCount > 0 && `(${unreadCount})`}
            </Link>
            <Link to="/seller/settings" className="sd-quick-btn">
              <IconStore /> {shop ? "Edit Store" : "Create Store"}
            </Link>
            {shop && (
              <Link to={`/shop/${shop.slug}`} target="_blank" className="sd-quick-btn">
                <IconExternal /> View Live Store
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
