import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/img/abatrades-logo-other.png";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const NAV = [
  { key: "overview",  label: "Overview",      Icon: IconOverview  },
  { key: "products",  label: "Products",       Icon: IconProducts  },
  { key: "orders",    label: "Orders",         Icon: IconOrders    },
  { key: "inquiries", label: "Inquiries",      Icon: IconInquiries },
  { key: "shop",      label: "Store Settings", Icon: IconStore     },
];

/* ══════════════════════════════════════════════════════════════
   SVG ICONS — crisp, scalable, no emojis
══════════════════════════════════════════════════════════════ */
function IconOverview()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function IconProducts()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>; }
function IconOrders()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function IconInquiries() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function IconStore()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconExternal()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function IconLogout()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function IconMenu()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function IconClose()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconPlus()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconEdit()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IconTrash()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function IconEye()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [shop, setShop] = useState(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user === null) navigate("/signin", { replace: true });
    else if (user && user.user_type !== "seller") navigate("/", { replace: true });
  }, [user]);

  const fetchShop = () => {
    axios.get(`${BASE}/api/shops/mine/`, { withCredentials: true })
      .then(r => setShop(r.data || false))
      .catch(() => setShop(false))
      .finally(() => setShopLoading(false));
  };

  const fetchUnread = () => {
    axios.get(`${BASE}/api/inquiries/mine/`, { withCredentials: true })
      .then(r => setUnreadCount(r.data.filter(i => !i.is_read).length))
      .catch(() => {});
  };

  useEffect(() => { fetchShop(); }, []);
  useEffect(() => { if (shop) fetchUnread(); }, [shop]);

  const switchTab = (key) => { setTab(key); setMobileOpen(false); };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (!user || shopLoading) return (
    <div className="sd-loading">
      <div className="spinner-border" style={{ color: "#3b7bf8", width: "2rem", height: "2rem" }} />
    </div>
  );

  const initials = (user.first_name || user.email).charAt(0).toUpperCase();
  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user.email;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .sd-wrap {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── Sidebar ── */
        .sd-sidebar {
          width: 224px;
          min-width: 224px;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
          z-index: 50;
        }

        .sd-sidebar-logo {
          padding: 16px 18px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
        }

        .sd-seller-info {
          padding: 12px 18px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sd-avatar {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, #3b7bf8, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .sd-seller-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-seller-role {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .sd-nav {
          flex: 1;
          padding: 8px 10px;
        }

        .sd-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          font-size: 13.5px;
          cursor: pointer;
          margin-bottom: 2px;
          text-align: left;
          transition: background 0.12s, color 0.12s;
          position: relative;
        }

        .sd-nav-btn:hover { background: #f8fafc; color: #1e293b; }
        .sd-nav-btn.active { background: #eff6ff; color: #2563eb; font-weight: 600; }

        .sd-badge {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          border-radius: 999px;
          padding: 1px 6px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.5;
        }

        .sd-sidebar-footer {
          padding: 10px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sd-footer-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.12s;
          width: 100%;
          text-align: left;
        }

        .sd-footer-btn.view-store { color: #2563eb; }
        .sd-footer-btn.view-store:hover { background: #eff6ff; }
        .sd-footer-btn.signout { color: #ef4444; }
        .sd-footer-btn.signout:hover { background: #fef2f2; }

        /* ── Mobile overlay ── */
        .sd-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 99;
        }

        /* ── Main ── */
        .sd-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .sd-topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 20px;
          height: 54px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .sd-hamburger {
          display: none;
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px;
          color: #374151;
          border-radius: 6px;
          line-height: 0;
        }

        .sd-hamburger:hover { background: #f1f5f9; }

        .sd-topbar-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .sd-topbar-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 7px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.12s;
          text-decoration: none;
        }

        .sd-btn-primary:hover { background: #1d4ed8; color: #fff; }

        .sd-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        /* ── Loading ── */
        .sd-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        /* ── Stats grid ── */
        .sd-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .sd-stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sd-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sd-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .sd-stat-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 3px;
          font-weight: 500;
        }

        /* ── Card ── */
        .sd-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .sd-card-header {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sd-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .sd-card-body {
          padding: 16px 18px;
        }

        /* ── Alert banner ── */
        .sd-alert {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 16px;
          border: 1.5px solid;
        }

        .sd-alert.warning {
          background: #fffbeb;
          border-color: #f59e0b;
        }

        .sd-alert.success {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .sd-alert.error {
          background: #fef2f2;
          border-color: #ef4444;
        }

        /* ── Table ── */
        .sd-table-wrap {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #fff;
        }

        .sd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .sd-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .sd-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }

        .sd-table tr:last-child td { border-bottom: none; }
        .sd-table tr:hover td { background: #fafcff; }

        .sd-table-thumb {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          object-fit: cover;
          display: block;
        }

        .sd-pill {
          display: inline-block;
          border-radius: 999px;
          padding: 2px 9px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .sd-pill.green  { background: #dcfce7; color: #15803d; }
        .sd-pill.red    { background: #fee2e2; color: #b91c1c; }
        .sd-pill.blue   { background: #dbeafe; color: #1d4ed8; }
        .sd-pill.purple { background: #ede9fe; color: #6d28d9; }

        .sd-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: none;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.12s;
          text-decoration: none;
        }

        .sd-action-btn:hover { opacity: 0.8; }
        .sd-action-btn.edit  { background: #eff6ff; color: #2563eb; }
        .sd-action-btn.del   { background: #fef2f2; color: #ef4444; }
        .sd-action-btn.view  { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

        /* ── Inquiries ── */
        .sd-inq-list { display: flex; flex-direction: column; gap: 10px; }

        .sd-inq-item {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px 16px;
          transition: border-color 0.15s;
        }

        .sd-inq-item.unread {
          border-left: 3px solid #2563eb;
          background: #f8fbff;
        }

        .sd-inq-meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .sd-inq-sender { font-weight: 600; font-size: 14px; color: #0f172a; }
        .sd-inq-email  { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .sd-inq-product { font-size: 12px; color: #64748b; margin-top: 2px; }
        .sd-inq-body {
          margin-top: 10px;
          font-size: 13.5px;
          color: #374151;
          line-height: 1.6;
          background: #f8fafc;
          border-radius: 7px;
          padding: 10px 12px;
        }

        /* ── Form ── */
        .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sd-form-full { grid-column: 1 / -1; }

        .sd-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }

        .sd-input {
          width: 100%;
          padding: 9px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 7px;
          font-size: 13.5px;
          color: #1e293b;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }

        .sd-input:focus { border-color: #2563eb; }

        .sd-upload-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fafafa;
        }

        .sd-upload-zone:hover { border-color: #2563eb; background: #f0f7ff; }

        .sd-divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 18px 0;
        }

        .sd-section-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 12px;
        }

        /* ── Empty state ── */
        .sd-empty {
          text-align: center;
          padding: 48px 20px;
        }

        .sd-empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          color: #94a3b8;
        }

        /* ── Quick actions row ── */
        .sd-quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sd-quick-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 7px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.12s, background 0.12s;
          text-decoration: none;
        }

        .sd-quick-btn:hover { border-color: #2563eb; background: #f0f7ff; color: #2563eb; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sd-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          }

          .sd-sidebar.mobile-open {
            transform: translateX(0);
          }

          .sd-overlay {
            display: block;
          }

          .sd-main {
            width: 100%;
          }

          .sd-hamburger {
            display: flex;
          }

          .sd-content {
            padding: 14px;
          }

          .sd-stats {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .sd-stats .sd-stat-card:last-child {
            grid-column: 1 / -1;
          }

          .sd-form-grid {
            grid-template-columns: 1fr;
          }

          .sd-table th:nth-child(4),
          .sd-table td:nth-child(4) { display: none; }
        }

        @media (max-width: 480px) {
          .sd-stats { grid-template-columns: 1fr; }
          .sd-stats .sd-stat-card:last-child { grid-column: auto; }
        }
      `}</style>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sd-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className="sd-wrap">
        {/* ── SIDEBAR ── */}
        <aside className={`sd-sidebar${mobileOpen ? " mobile-open" : ""}`}>
          <div className="sd-sidebar-logo">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <img src={Logo} alt="Abatrades" style={{ height: "30px" }} />
            </Link>
          </div>

          <div className="sd-seller-info">
            <div className="sd-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="sd-seller-name">{displayName}</div>
              <div className="sd-seller-role">Seller Account</div>
            </div>
          </div>

          <nav className="sd-nav">
            {NAV.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`sd-nav-btn${tab === key ? " active" : ""}`}
                onClick={() => switchTab(key)}
              >
                <Icon />
                {label}
                {key === "inquiries" && unreadCount > 0 && (
                  <span className="sd-badge">{unreadCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sd-sidebar-footer">
            {shop && (
              <Link
                to={`/shop/${shop.slug}`}
                target="_blank"
                className="sd-footer-btn view-store"
                onClick={() => setMobileOpen(false)}
              >
                <IconExternal /> View My Store
              </Link>
            )}
            <button className="sd-footer-btn signout" onClick={handleLogout}>
              <IconLogout /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="sd-main">
          {/* Topbar */}
          <div className="sd-topbar">
            <button className="sd-hamburger" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
            <h1 className="sd-topbar-title">
              {NAV.find(n => n.key === tab)?.label}
            </h1>
            <div className="sd-topbar-actions">
              {tab === "products" && (
                <button className="sd-btn-primary" onClick={() => navigate("/add-product")}>
                  <IconPlus /> Add Product
                </button>
              )}
              {tab === "shop" && shop && (
                <Link to={`/shop/${shop.slug}`} target="_blank" className="sd-btn-primary">
                  <IconExternal /> Preview Store
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="sd-content">
            {tab === "overview"  && <TabOverview  shop={shop} user={user} setTab={setTab} navigate={navigate} unreadCount={unreadCount} />}
            {tab === "products"  && <TabProducts  navigate={navigate} />}
            {tab === "orders"    && <TabOrders    />}
            {tab === "inquiries" && <TabInquiries shop={shop} onRead={() => fetchUnread()} />}
            {tab === "shop"      && <TabShopSettings shop={shop} onSaved={fetchShop} />}
          </div>
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   TAB: OVERVIEW
══════════════════════════════════════════════════════════════ */
const TabOverview = ({ shop, user, setTab, navigate, unreadCount }) => {
  const [productCount, setProductCount] = useState("—");
  const [inquiryCount, setInquiryCount] = useState("—");
  const [orderCount,   setOrderCount]   = useState("—");
  const [revenue,      setRevenue]      = useState("—");

  useEffect(() => {
    axios.get(`${BASE}/api/owner-products/`, { withCredentials: true })
      .then(r => setProductCount(r.data.length)).catch(() => {});
    if (shop) {
      axios.get(`${BASE}/api/inquiries/mine/`, { withCredentials: true })
        .then(r => setInquiryCount(r.data.length)).catch(() => {});
    }
    axios.get(`${BASE}/api/orders/seller/`, { withCredentials: true })
      .then(r => {
        setOrderCount(r.data.length);
        const total = r.data.reduce((sum, o) =>
          sum + o.items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0), 0);
        setRevenue(fmtNGN(total));
      }).catch(() => {});
  }, [shop]);

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 4px" }}>
          Welcome back, {user.first_name || "Seller"}
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "13.5px" }}>
          {shop
            ? `"${shop.name}" is live — here's your snapshot.`
            : "You haven't set up your store yet."}
        </p>
      </div>

      {/* No shop banner */}
      {!shop && (
        <div className="sd-alert warning" style={{ marginBottom: "18px" }}>
          <div>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: "14px" }}>Store not set up</div>
            <div style={{ fontSize: "13px", color: "#a16207", marginTop: "2px" }}>
              Create your storefront so buyers can discover and contact you.
            </div>
          </div>
          <button className="sd-btn-primary" style={{ background: "#f59e0b" }} onClick={() => setTab("shop")}>
            Set Up Store
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="sd-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "Revenue",         value: revenue,                                  bg: "#f0fdf4", color: "#16a34a", Icon: IconOrders    },
          { label: "Orders",          value: orderCount,                               bg: "#eff6ff", color: "#2563eb", Icon: IconOrders    },
          { label: "Products",        value: productCount,                             bg: "#fdf4ff", color: "#7c3aed", Icon: IconProducts  },
          { label: "Store Visits",    value: shop?.visit_count?.toLocaleString()||"0", bg: "#fff7ed", color: "#c2410c", Icon: IconEye       },
          { label: "Inquiries",       value: inquiryCount,                             bg: "#f1f5f9", color: "#475569", Icon: IconInquiries },
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

      {/* Quick actions */}
      <div className="sd-card">
        <div className="sd-card-header">
          <p className="sd-card-title">Quick Actions</p>
        </div>
        <div className="sd-card-body">
          <div className="sd-quick-actions">
            <button className="sd-quick-btn" onClick={() => navigate("/add-product")}>
              <IconPlus style={{ width: 14 }} /> Add Product
            </button>
            <button className="sd-quick-btn" onClick={() => setTab("orders")}>
              <IconOrders /> Orders
            </button>
            <button className="sd-quick-btn" onClick={() => setTab("inquiries")}>
              <IconInquiries /> Inquiries {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button className="sd-quick-btn" onClick={() => setTab("shop")}>
              <IconStore /> {shop ? "Edit Store" : "Create Store"}
            </button>
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

/* ══════════════════════════════════════════════════════════════
   TAB: PRODUCTS
══════════════════════════════════════════════════════════════ */
const TabProducts = ({ navigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE}/api/owner-products/`, { withCredentials: true })
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    await axios.delete(`${BASE}/api/owner-products/${id}/`, { withCredentials: true });
    setProducts(p => p.filter(x => x.id !== id));
  };

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (products.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconProducts /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No products yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px", marginBottom: "16px" }}>
          Add your first product to start getting discovered by buyers.
        </p>
        <button className="sd-btn-primary" onClick={() => navigate("/add-product")}>
          <IconPlus /> Add Your First Product
        </button>
      </div>
    </div>
  );

  return (
    <div className="sd-table-wrap">
      <table className="sd-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={p.main_image_url || "/OIP.png"}
                    alt={p.name}
                    className="sd-table-thumb"
                    onError={e => { e.target.src = "/OIP.png"; }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", maxWidth: "180px",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "1px" }}>
                      ID #{p.id}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontSize: "13px", color: "#475569" }}>{p.category}</span>
              </td>
              <td>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{fmtNGN(p.price)}</span>
              </td>
              <td>
                <span style={{ fontSize: "13px", color: p.quantity > 0 ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  {p.quantity}
                </span>
              </td>
              <td>
                <span className={`sd-pill ${p.is_active ? "green" : "red"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button className="sd-action-btn view" onClick={() => navigate(`/product/${p.id}`)}>
                    <IconEye /> View
                  </button>
                  <button className="sd-action-btn edit" onClick={() => navigate(`/edit-product/${p.id}`)}>
                    <IconEdit /> Edit
                  </button>
                  <button className="sd-action-btn del" onClick={() => handleDelete(p.id)}>
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   TAB: INQUIRIES
══════════════════════════════════════════════════════════════ */
const TabInquiries = ({ shop, onRead }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    axios.get(`${BASE}/api/inquiries/mine/`, { withCredentials: true })
      .then(r => setInquiries(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shop]);

  const markRead = async (id) => {
    await axios.patch(`${BASE}/api/inquiries/${id}/read/`, {}, { withCredentials: true });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    onRead();
  };

  if (!shop) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconInquiries /></div>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>Set up your store to start receiving inquiries.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (inquiries.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconInquiries /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No inquiries yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>
          When buyers send you a message, they'll show up here.
        </p>
      </div>
    </div>
  );

  const unread = inquiries.filter(i => !i.is_read);
  const read   = inquiries.filter(i => i.is_read);

  const InquiryItem = ({ inq }) => (
    <div className={`sd-inq-item${!inq.is_read ? " unread" : ""}`}>
      <div className="sd-inq-meta">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="sd-inq-sender">{inq.visitor_name}</span>
            {!inq.is_read && <span className="sd-pill blue">New</span>}
          </div>
          <div className="sd-inq-email">
            <a href={`mailto:${inq.visitor_email}`} style={{ color: "#64748b", textDecoration: "none" }}>
              {inq.visitor_email}
            </a>
          </div>
          {inq.product_name && (
            <div className="sd-inq-product">Re: {inq.product_name}</div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{fmtDate(inq.created_at)}</div>
          {!inq.is_read && (
            <button
              onClick={() => markRead(inq.id)}
              style={{
                marginTop: "6px", background: "none", border: "1px solid #2563eb",
                color: "#2563eb", borderRadius: "6px", padding: "3px 10px",
                fontSize: "12px", cursor: "pointer", fontWeight: 600,
              }}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
      <div className="sd-inq-body">{inq.message}</div>
    </div>
  );

  return (
    <div>
      {unread.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <p className="sd-section-label">Unread ({unread.length})</p>
          <div className="sd-inq-list">
            {unread.map(i => <InquiryItem key={i.id} inq={i} />)}
          </div>
        </div>
      )}
      {read.length > 0 && (
        <div>
          <p className="sd-section-label">Earlier</p>
          <div className="sd-inq-list">
            {read.map(i => <InquiryItem key={i.id} inq={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   TAB: SHOP SETTINGS
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   TAB: ORDERS (incoming orders for this seller)
══════════════════════════════════════════════════════════════ */
const STATUS_OPTS = ["processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending:    { bg: "#fef9c3", color: "#854d0e" },
  paid:       { bg: "#dcfce7", color: "#15803d" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped:    { bg: "#e0e7ff", color: "#4338ca" },
  delivered:  { bg: "#f0fdf4", color: "#166534" },
  cancelled:  { bg: "#fee2e2", color: "#b91c1c" },
};

const TabOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    axios.get(`${BASE}/api/orders/seller/`, { withCredentials: true })
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    await axios.patch(
      `${BASE}/api/orders/seller/${orderId}/status/`,
      { status: newStatus },
      { withCredentials: true }
    );
    fetchOrders();
  };

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (orders.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconOrders /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No orders yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>
          Orders from buyers will appear here once your products start selling.
        </p>
      </div>
    </div>
  );

  const revenue = orders.reduce((sum, o) => {
    const mine = o.items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0);
    return sum + mine;
  }, 0);

  return (
    <div>
      {/* Revenue summary */}
      <div className="sd-card" style={{ marginBottom: "16px" }}>
        <div className="sd-card-body" style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Revenue</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>{fmtNGN(revenue)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Orders</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{orders.length}</div>
          </div>
        </div>
      </div>

      <div className="sd-table-wrap">
        <table className="sd-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const myItems = order.items.filter(i => true); // all items in this order are seller's
              const myTotal = myItems.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0);
              return (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>#{order.id}</div>
                    <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700 }}>{fmtNGN(myTotal)}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{order.shipping_name}</div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{order.buyer_email}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "12.5px", color: "#374151" }}>
                      {myItems.map(i => `${i.product_name} ×${i.quantity}`).join(", ")}
                    </div>
                  </td>
                  <td style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {fmtDate(order.created_at)}
                  </td>
                  <td>
                    <span className="sd-pill" style={{ background: sc.bg, color: sc.color }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <select
                        style={{
                          fontSize: "12px", border: "1.5px solid #e2e8f0",
                          borderRadius: "6px", padding: "4px 8px",
                          outline: "none", cursor: "pointer", fontFamily: "inherit",
                        }}
                        defaultValue=""
                        onChange={e => { if (e.target.value) updateStatus(order.id, e.target.value); }}
                      >
                        <option value="" disabled>Change…</option>
                        {STATUS_OPTS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabShopSettings = ({ shop, onSaved }) => {
  const [form, setForm] = useState({
    name:        shop?.name        || "",
    description: shop?.description || "",
    whatsapp:    shop?.whatsapp    || "",
    instagram:   shop?.instagram   || "",
    website:     shop?.website     || "",
  });
  const [logo,   setLogo]   = useState(null);
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { ok: bool, msg: string }
  const logoRef   = useRef();
  const bannerRef = useRef();
  const isNew = !shop;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    if (logo)   fd.append("logo", logo);
    if (banner) fd.append("banner_image", banner);

    try {
      if (isNew) {
        await axios.post(`${BASE}/api/shops/`, fd,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
        setStatus({ ok: true, msg: "Store created successfully." });
      } else {
        await axios.patch(`${BASE}/api/shops/${shop.slug}/`, fd,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
        setStatus({ ok: true, msg: "Changes saved." });
      }
      onSaved();
    } catch (err) {
      const d = err.response?.data;
      setStatus({ ok: false, msg: typeof d === "object" ? JSON.stringify(d) : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const PreviewImage = ({ file, existing, style }) => {
    if (file) return <img src={URL.createObjectURL(file)} alt="preview" style={{ ...style, objectFit: "cover", display: "block" }} />;
    if (existing) return <img src={existing} alt="current" style={{ ...style, objectFit: "cover", display: "block" }} />;
    return <span style={{ color: "#94a3b8", fontSize: "12.5px" }}>Click to upload</span>;
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <div className="sd-card">
        <div className="sd-card-header">
          <p className="sd-card-title">{isNew ? "Create Your Store" : "Store Settings"}</p>
        </div>
        <div className="sd-card-body">
          {status && (
            <div className={`sd-alert ${status.ok ? "success" : "error"}`} style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name + Description */}
            <div className="sd-form-grid">
              <div className="sd-form-full">
                <label className="sd-label">Store Name *</label>
                <input
                  className="sd-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ade Fashion House"
                  required
                />
              </div>
              <div className="sd-form-full">
                <label className="sd-label">Description</label>
                <textarea
                  className="sd-input"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what you sell..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <hr className="sd-divider" />
            <p className="sd-section-label">Branding</p>

            {/* Logo + Banner */}
            <div className="sd-form-grid" style={{ marginBottom: "0" }}>
              <div>
                <label className="sd-label">Store Logo</label>
                <div
                  className="sd-upload-zone"
                  onClick={() => logoRef.current.click()}
                  style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <PreviewImage file={logo} existing={shop?.logo_url} style={{ height: "60px", borderRadius: "6px" }} />
                </div>
                <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setLogo(e.target.files[0])} />
              </div>
              <div>
                <label className="sd-label">Banner Image</label>
                <div
                  className="sd-upload-zone"
                  onClick={() => bannerRef.current.click()}
                  style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <PreviewImage file={banner} existing={shop?.banner_url}
                    style={{ height: "60px", width: "100%", borderRadius: "6px" }} />
                </div>
                <input ref={bannerRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setBanner(e.target.files[0])} />
              </div>
            </div>

            <hr className="sd-divider" />
            <p className="sd-section-label">Contact & Social</p>

            <div className="sd-form-grid">
              <div>
                <label className="sd-label">WhatsApp Number</label>
                <input className="sd-input" name="whatsapp" value={form.whatsapp}
                  onChange={handleChange} placeholder="+2348012345678" />
              </div>
              <div>
                <label className="sd-label">Instagram Handle</label>
                <input className="sd-input" name="instagram" value={form.instagram}
                  onChange={handleChange} placeholder="yourhandle (no @)" />
              </div>
              <div className="sd-form-full">
                <label className="sd-label">Website</label>
                <input className="sd-input" name="website" value={form.website}
                  onChange={handleChange} placeholder="https://yourwebsite.com" />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                type="submit"
                className="sd-btn-primary"
                disabled={saving}
                style={{
                  width: "100%", justifyContent: "center",
                  padding: "11px", fontSize: "14px",
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving…" : isNew ? "Create Store" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
