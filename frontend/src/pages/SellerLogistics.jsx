import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSellerCtx } from "../components/SellerLayout";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: "Nationwide Delivery",
    desc: "We deliver to all 36 states in Nigeria using our network of verified logistics partners.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Real-Time Tracking",
    desc: "You and your buyers get live tracking updates from dispatch to doorstep — full transparency at every step.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Order Pickup",
    desc: "Our riders pick up orders directly from your location or from our warehouse — flexible for your workflow.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Competitive Rates",
    desc: "Premium sellers enjoy preferential delivery rates — reducing your shipping costs and increasing margins.",
  },
];

const ZONES = [
  { name: "Same City / Intrastate", time: "Same day – 24 hrs", rate: "Preferential" },
  { name: "Nearby States", time: "1–2 business days", rate: "Preferential" },
  { name: "Nationwide", time: "2–4 business days", rate: "Preferential" },
];

const SellerLogistics = () => {
  const { shop, shopLoading, setPageTitle } = useSellerCtx();

  useEffect(() => { setPageTitle("Logistics & Delivery"); }, []);

  if (shopLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div className="spinner-border" style={{ color: "#3b7bf8", width: "1.5rem", height: "1.5rem" }} />
    </div>
  );

  if (!shop?.is_premium) {
    return (
      <div style={{ maxWidth: "520px", margin: "60px auto", textAlign: "center", padding: "0 16px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#fefce8", border: "1.5px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#d97706" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 10px" }}>Premium Feature</h2>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: "0 0 24px" }}>
          Logistics & Delivery is available to Premium Store subscribers. Upgrade your plan to unlock this and more.
        </p>
        <Link to="/seller/premium" style={{ display: "inline-block", background: "#d97706", color: "#fff", padding: "12px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
          Upgrade to Premium
        </Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px", padding: "40px 36px", marginBottom: "28px",
        display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap",
      }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "22px", color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Logistics &amp; Delivery</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
            We coordinate order pickup and last-mile delivery to buyers across Nigeria — you focus on selling.
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px 18px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", marginBottom: "14px" }}>
              {f.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "6px" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Delivery zones */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", marginBottom: "28px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>Delivery Zones &amp; Timeframes</div>
        </div>
        <div>
          {ZONES.map((z, i) => (
            <div key={z.name} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: i < ZONES.length - 1 ? "1px solid #f1f5f9" : "none", gap: "16px" }}>
              <div style={{ flex: 1, fontWeight: 500, fontSize: "13.5px", color: "#0f172a" }}>{z.name}</div>
              <div style={{ fontSize: "13px", color: "#64748b", minWidth: "140px" }}>{z.time}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, background: "#dcfce7", color: "#15803d", borderRadius: "999px", padding: "3px 10px" }}>{z.rate}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activation form */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", marginBottom: "4px" }}>Activate Logistics for Your Store</div>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Tell us about your delivery needs and we'll set you up within 24 hours.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label className="sd-label">Your store location / pickup address</label>
            <input className="sd-input" placeholder="Full address for order pickups" />
          </div>
          <div>
            <label className="sd-label">Average orders per month</label>
            <input className="sd-input" placeholder="e.g. 20–50 orders/month" />
          </div>
          <div>
            <label className="sd-label">Primary delivery region</label>
            <input className="sd-input" placeholder="e.g. Lagos only, Nationwide, South-West…" />
          </div>
          <div>
            <label className="sd-label">Contact phone number</label>
            <input className="sd-input" placeholder="e.g. 0801 234 5678" />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label className="sd-label">Additional delivery requirements</label>
          <textarea className="sd-input" rows={3} placeholder="Fragile items, special packaging, specific delivery windows, etc." style={{ resize: "vertical" }} />
        </div>
        <button
          style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: "9px", padding: "12px 28px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
          onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
          onClick={() => alert("Request submitted! Our logistics team will contact you within 24 hours to complete your setup.")}
        >
          Activate Logistics
        </button>
      </div>

    </div>
  );
};

export default SellerLogistics;
