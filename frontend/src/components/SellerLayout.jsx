import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/img/abatrades-logo-other.png";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ac = (extraHeaders = {}) => {
  const token = localStorage.getItem("access_token");
  return {
    withCredentials: true,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extraHeaders },
  };
};

/* ── Context ── */
const SellerCtx = createContext({});
export const useSellerCtx = () => useContext(SellerCtx);
export { ac, BASE };

/* ── Icons ── */
export function IconOverview()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
export function IconProducts()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>; }
export function IconOrders()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
export function IconInquiries() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
export function IconStore()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
export function IconExternal()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
export function IconLogout()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
export function IconMenu()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
export function IconClose()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
export function IconPlus()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
export function IconEdit()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
export function IconTrash()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
export function IconEye()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
export function IconStar({ filled } = {}) { return <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
export function IconCrown()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 16l2-10 6 5 6-5 2 10"/></svg>; }
export function IconWarehouse() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
export function IconTruck()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }

/* ── Shared helpers ── */
export const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
export const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

/* ── Shared CSS ── */
const SD_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .sd-wrap {
    display: flex;
    min-height: 100vh;
    background: #f1f5f9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

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
    -webkit-overflow-scrolling: touch;
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

  .sd-nav-link {
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
    text-decoration: none;
  }

  .sd-nav-link:hover { background: #f8fafc; color: #1e293b; }
  .sd-nav-link.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
  .sd-nav-link.premium-nav-link { color: #92400e; }
  .sd-nav-link.premium-nav-link:hover { background: #fefce8; color: #78350f; }
  .sd-nav-link.premium-nav-link.active { background: #fefce8; color: #92400e; }

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

  .sd-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 99;
  }

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
    background: #fff;
  }

  .sd-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

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

  .sd-alert.warning { background: #fffbeb; border-color: #f59e0b; }
  .sd-alert.success { background: #f0fdf4; border-color: #22c55e; }
  .sd-alert.error   { background: #fef2f2; border-color: #ef4444; }

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

  .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .sd-form-full { grid-column: 1 / -1; }

  .sd-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

  .sd-input-line {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-bottom: 2px solid #e2e8f0;
    border-radius: 0;
    font-size: 14px;
    color: #1e293b;
    background: transparent;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
  }
  .sd-input-line:focus { border-bottom-color: #2563eb; }
  .sd-input-line::placeholder { color: #cbd5e1; }

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

  @media (max-width: 768px) {
    .sd-topbar-actions .sd-btn-primary {
      padding: 5px 10px;
      font-size: 12px;
    }

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

    .sd-sidebar.mobile-open { transform: translateX(0); }

    .sd-overlay { display: block; }

    .sd-main { width: 100%; }

    .sd-hamburger { display: flex; }

    .sd-content { padding: 14px; }

    .sd-stats {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .sd-stats .sd-stat-card:last-child { grid-column: 1 / -1; }

    .sd-form-grid { grid-template-columns: 1fr; }

    .sd-table th:nth-child(4),
    .sd-table td:nth-child(4) { display: none; }
  }

  @media (max-width: 480px) {
    .sd-stats { grid-template-columns: 1fr; }
    .sd-stats .sd-stat-card:last-child { grid-column: auto; }
  }
`;

const NAV = [
  { path: "/seller/overview",   label: "Overview",          Icon: IconOverview   },
  { path: "/seller/products",   label: "Products",          Icon: IconProducts   },
  { path: "/seller/orders",     label: "Orders",            Icon: IconOrders     },
  { path: "/seller/inquiries",  label: "Inquiries",         Icon: IconInquiries  },
  { path: "/seller/settings",   label: "Store Settings",    Icon: IconStore      },
  { path: "/seller/premium",    label: "Premium Store",     Icon: IconCrown,     gold: true },
  { path: "/seller/warehouse",  label: "Warehousing",       Icon: IconWarehouse, gold: true },
  { path: "/seller/logistics",  label: "Logistics",         Icon: IconTruck,     gold: true },
];

/* ── Layout ── */
const SellerLayout = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [topbarActions, setTopbarActions] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleSwitchToBuyer = async () => {
    setSwitchingRole(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${BASE}/api/switch-role/`, {}, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await refreshUser();
      navigate("/user-profile", { replace: true });
    } catch {
      setSwitchingRole(false);
    }
  };

  useEffect(() => {
    if (user === null) navigate("/signin", { replace: true });
    else if (user && user.user_type !== "seller") navigate("/", { replace: true });
  }, [user]);

  const refreshShop = () => {
    axios.get(`${BASE}/api/shops/mine/`, ac())
      .then(r => setShop(r.data || false))
      .catch(() => setShop(false))
      .finally(() => setShopLoading(false));
  };

  const refreshUnread = () => {
    axios.get(`${BASE}/api/inquiries/mine/`, ac())
      .then(r => setUnreadCount(r.data.filter(i => !i.is_read).length))
      .catch(() => {});
  };

  useEffect(() => { refreshShop(); }, []);
  useEffect(() => { if (shop) refreshUnread(); }, [shop]);

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
    <SellerCtx.Provider value={{ shop, shopLoading, unreadCount, refreshShop, refreshUnread, setPageTitle, setTopbarActions }}>
      <style>{SD_CSS}</style>

      {mobileOpen && (
        <div className="sd-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className="sd-wrap">
        {/* Sidebar */}
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
            <button
              className="sd-footer-btn"
              onClick={handleSwitchToBuyer}
              disabled={switchingRole}
              style={{ color: "#15803d" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {switchingRole ? "Switching…" : "Switch to Buyer"}
            </button>
            <button className="sd-footer-btn signout" onClick={handleLogout}>
              <IconLogout /> Sign Out
            </button>
          </div>

          <nav className="sd-nav">
            {NAV.map(({ path, label, Icon, gold }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `sd-nav-link${isActive ? " active" : ""}${gold ? " premium-nav-link" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon />
                {label}
                {path === "/seller/inquiries" && unreadCount > 0 && (
                  <span className="sd-badge">{unreadCount}</span>
                )}
                {gold && shop && (
                  <span style={{
                    marginLeft: "auto", fontSize: "10px", fontWeight: 700, letterSpacing: "0.03em",
                    background: shop.is_premium ? "#dcfce7" : "#fef9c3",
                    color: shop.is_premium ? "#15803d" : "#854d0e",
                    borderRadius: "999px", padding: "2px 8px",
                  }}>
                    {shop.is_premium ? "Active" : "Upgrade"}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="sd-main">
          <div className="sd-topbar">
            <button className="sd-hamburger" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
            <h1 className="sd-topbar-title">{pageTitle}</h1>
            <div className="sd-topbar-actions">{topbarActions}</div>
          </div>

          <div className="sd-content">
            <Outlet />
          </div>
        </div>
      </div>
    </SellerCtx.Provider>
  );
};

export default SellerLayout;
