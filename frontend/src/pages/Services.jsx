import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/img/abatrades-large-logo.png";

const SERVICES = [
  {
    label: "Warehousing",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    heading: "Secure storage for your inventory",
    body: "Send your products to our facility and we take care of the rest. Your goods are received, logged, and stored safely until an order comes in. No need to rent a shop or manage space yourself.",
    points: [
      "Dedicated storage space per store",
      "Inventory tracked in your dashboard",
      "Safe, insured, and climate-controlled facility",
      "Available to premium store owners",
    ],
  },
  {
    label: "Logistics",
    color: "#10b981",
    bg: "#f0fdf4",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    heading: "We deliver to your customers",
    body: "When a customer places an order, we pick, pack, and dispatch it using our logistics network. Your buyers receive their orders on time — anywhere in Nigeria. You just watch the sales roll in.",
    points: [
      "Same-day and next-day delivery options",
      "Full delivery tracking for you and your customer",
      "Covers all major cities across Nigeria",
      "No logistics headache — we handle everything",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Open a premium store",
    body: "Sign up and upgrade to a premium store on Abatrades. Set up your storefront with your logo and products.",
  },
  {
    n: "02",
    title: "Send us your inventory",
    body: "Ship your products to our warehouse. You can also use our partner Rafiki to import directly to us.",
  },
  {
    n: "03",
    title: "We store and list",
    body: "We receive, log, and store your products. They go live on your storefront immediately.",
  },
  {
    n: "04",
    title: "Order comes in — we deliver",
    body: "When a customer orders, we pack and dispatch. You track everything from your account and get paid.",
  },
];

const Services = () => (
  <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

    {/* Header */}
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Link to="/">
        <img src={Logo} alt="Abatrades" style={{ height: "32px" }} />
      </Link>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Link to="/browse" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Browse stores</Link>
        <Link to="/join" style={{ background: "#f97316", color: "#fff", padding: "8px 20px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
          Get started
        </Link>
      </div>
    </div>

    {/* Hero */}
    <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "80px 24px", textAlign: "center" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.2)", color: "#f97316", fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", padding: "5px 16px", borderRadius: "999px", marginBottom: "20px" }}>
        Premium services
      </span>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
        Warehousing &amp; Logistics<br />
        <span style={{ color: "#f97316" }}>handled for you.</span>
      </h1>
      <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "560px", margin: "0 auto 36px", lineHeight: 1.75 }}>
        Store your products in our facility, and we deliver to your customers anywhere in Nigeria. You focus on selling — we handle the rest.
      </p>
      <Link to="/join" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f97316", color: "#fff", padding: "14px 36px", fontWeight: 800, fontSize: "15px", textDecoration: "none", boxShadow: "0 8px 24px rgba(249,115,22,0.4)" }}>
        Open a store today
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </Link>
    </div>

    {/* Services */}
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
      <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {SERVICES.map((s, i) => (
          <div key={i} style={{ border: "1.5px solid #f1f5f9", borderRadius: "20px", padding: "40px 36px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
              {s.icon}
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: s.color, letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</span>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "10px 0 14px", lineHeight: 1.25 }}>{s.heading}</h2>
            <p style={{ fontSize: "14.5px", color: "#64748b", lineHeight: 1.75, marginBottom: "24px" }}>{s.body}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {s.points.map((p, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#374151" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"/></svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* How it works */}
    <div style={{ background: "#0f172a", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "12px", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>The process</p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "#fff", margin: 0 }}>How it works</h2>
        </div>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", padding: "32px 24px", borderRadius: i === 0 ? "16px 0 0 16px" : i === 3 ? "0 16px 16px 0" : "0", borderTop: "2px solid #f97316" }}>
              <div style={{ fontSize: "38px", fontWeight: 900, color: "rgba(249,115,22,0.2)", lineHeight: 1, marginBottom: "16px", fontFamily: "monospace" }}>{s.n}</div>
              <h4 style={{ color: "#fff", fontWeight: 800, fontSize: "14px", marginBottom: "8px" }}>{s.title}</h4>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom CTA */}
    <div style={{ background: "#fff7ed", padding: "72px 24px", textAlign: "center" }}>
      <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "#0f172a", margin: "0 0 14px" }}>
        Ready to let us handle it?
      </h2>
      <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.7 }}>
        Open a premium store on Abatrades and get access to our warehouse and logistics services today.
      </p>
      <Link to="/join" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f97316", color: "#fff", padding: "14px 36px", fontWeight: 800, fontSize: "15px", textDecoration: "none", boxShadow: "0 8px 24px rgba(249,115,22,0.3)" }}>
        Open a store — it's free
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </Link>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .services-grid { grid-template-columns: 1fr !important; }
        .how-grid { grid-template-columns: 1fr !important; gap: 6px !important; }
        .how-grid > div { border-radius: 12px !important; }
      }
    `}</style>
  </div>
);

export default Services;
