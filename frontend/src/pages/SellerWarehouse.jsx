import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSellerCtx } from "../components/SellerLayout";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    title: "Secure Storage",
    desc: "Your inventory is stored in our climate-controlled, security-monitored partner warehouses across Nigeria.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Stock Management",
    desc: "We track your inventory levels in real time and notify you when stock runs low — so you never miss a sale.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Pick & Pack",
    desc: "When an order comes in, our team picks, packs, and labels your products for dispatch — no effort on your end.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: "Same-Day Dispatch",
    desc: "Orders received before 2 PM are dispatched the same day from our warehouse to your buyers.",
  },
];

const HOW = [
  { step: "01", title: "Submit your request", desc: "Fill in the form below with your product details and estimated stock quantity." },
  { step: "02", title: "We assign a space", desc: "Our team reviews your request and allocates a dedicated storage space for your inventory." },
  { step: "03", title: "Ship your stock", desc: "You deliver (or we collect) your inventory to the warehouse. We confirm receipt and begin tracking." },
  { step: "04", title: "Sit back & sell", desc: "All order fulfilment is handled by us. You just focus on growing your sales." },
];

const SellerWarehouse = () => {
  const { shop, shopLoading, setPageTitle } = useSellerCtx();

  useEffect(() => { setPageTitle("Warehousing Service"); }, []);

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
          Warehousing service is available to Premium Store subscribers. Upgrade your plan to unlock warehousing, logistics, and more.
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
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "22px", color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Warehousing Service</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
            Store your inventory with us. We handle storage, stock management, pick &amp; pack, and same-day dispatch.
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px 18px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", marginBottom: "14px" }}>
              {f.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "6px" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px 24px 20px", marginBottom: "28px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", marginBottom: "20px" }}>How It Works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {HOW.map(h => (
            <div key={h.step} style={{ display: "flex", gap: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb", background: "#eff6ff", borderRadius: "7px", padding: "4px 8px", height: "fit-content", flexShrink: 0, letterSpacing: "0.04em" }}>{h.step}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", marginBottom: "4px" }}>{h.title}</div>
                <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.6 }}>{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request form */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", marginBottom: "4px" }}>Request Warehousing Space</div>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Our team will contact you within 24 hours to confirm your onboarding.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label className="sd-label">Product types you'll be storing</label>
            <input className="sd-input" placeholder="e.g. Clothing, Electronics, Cosmetics…" />
          </div>
          <div>
            <label className="sd-label">Estimated monthly stock volume</label>
            <input className="sd-input" placeholder="e.g. 50–200 units/month" />
          </div>
          <div>
            <label className="sd-label">Preferred location / state</label>
            <input className="sd-input" placeholder="e.g. Lagos, Abuja, Port Harcourt…" />
          </div>
          <div>
            <label className="sd-label">Contact phone number</label>
            <input className="sd-input" placeholder="e.g. 0801 234 5678" />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label className="sd-label">Additional notes</label>
          <textarea className="sd-input" rows={3} placeholder="Any special storage requirements, fragile items, cold storage, etc." style={{ resize: "vertical" }} />
        </div>
        <button
          style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: "9px", padding: "12px 28px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
          onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
          onClick={() => alert("Request submitted! Our warehousing team will contact you within 24 hours.")}
        >
          Submit Request
        </button>
      </div>

    </div>
  );
};

export default SellerWarehouse;
