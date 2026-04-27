import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/img/abatrades-logo-other.png";
import { useAuth } from "../context/AuthContext";

/* ── Topbar ── */
const Topbar = () => {
  const { user } = useAuth();
  const profileLink = user?.user_type === "seller" ? "/seller/overview" : "/user-profile";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#fff", borderBottom: "1px solid #f1f5f9",
      padding: "0 24px", height: "52px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link to="/"><img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} /></Link>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link to="/" style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, textDecoration: "none", padding: "5px 12px", borderRadius: "7px", border: "1px solid #e2e8f0" }}>
          ← Home
        </Link>
        {user ? (
          <Link to={profileLink} style={{
            width: "34px", height: "34px", borderRadius: "8px",
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        ) : (
          <Link to="/join" style={{ fontSize: "13px", color: "#fff", fontWeight: 600, textDecoration: "none", padding: "6px 16px", borderRadius: "7px", background: "#0f172a" }}>
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

/* ── Steps ── */
const STEPS = [
  { n: "01", title: "Create your account", body: "Sign up free in under a minute. Choose seller as your account type." },
  { n: "02", title: "Set up your store",   body: "Add your store name, logo, and description. Your storefront goes live immediately." },
  { n: "03", title: "List your products",  body: "Upload products with photos, prices, and stock levels. No limits." },
  { n: "04", title: "Get paid",            body: "Receive secure Paystack payments directly to your Nigerian bank account." },
];

/* ── Benefits ── */
const BENEFITS = [
  { icon: "🏪", title: "Your own storefront",    body: "A dedicated page for your brand. Custom logo, banner, tagline, and product catalogue." },
  { icon: "📦", title: "Easy order management", body: "Track every order from your dashboard. Know what's sold, what's pending, what's delivered." },
  { icon: "💬", title: "Direct buyer inquiries", body: "Buyers can message you about products. Build trust and close more sales." },
  { icon: "⭐", title: "Featured placements",    body: "Pin your best products to the top of your store. Control what buyers see first." },
  { icon: "📊", title: "Sales overview",         body: "See your revenue, product count, and order history at a glance in your dashboard." },
  { icon: "🚀", title: "Free to start",          body: "No setup fee. No monthly charge. List products and start selling from day one." },
];

/* ── FAQ ── */
const FAQS = [
  { q: "How much does it cost to sell on Abatrades?", a: "It's free to sign up and list products. We charge a small commission per sale. No hidden fees." },
  { q: "Where does Abatrades operate?",               a: "Abatrades currently operates exclusively in Nigeria, connecting Nigerian sellers with Nigerian buyers." },
  { q: "How do I receive payments?",                  a: "Payments are processed securely via Paystack and deposited directly to your Nigerian bank account." },
  { q: "Can I sell any type of product?",             a: "You can sell across all major categories — fashion, electronics, beauty, food, home goods, and more." },
  { q: "What if I already have a buyer account?",     a: "You can switch to a seller account from your profile settings at any time. Your history stays intact." },
];

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: "14.5px", fontWeight: 500, color: "#0f172a" }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginLeft: "16px" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.7, margin: "0 0 18px", paddingRight: "32px" }}>
          {a}
        </p>
      )}
    </div>
  );
};

const BecomeASeller = () => (
  <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
    <Topbar />

    {/* ── Hero ── */}
    <section style={{ maxWidth: "720px", margin: "0 auto", padding: "72px 24px 64px", textAlign: "center" }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: "#3b7bf8", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 16px" }}>
        Sell on Abatrades
      </p>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, color: "#0f172a", lineHeight: 1.15, letterSpacing: "-0.5px", margin: "0 0 20px" }}>
        Your store. Your rules.<br />Your buyers are waiting.
      </h1>
      <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 36px" }}>
        Join thousands of Nigerian sellers who list products, manage orders, and grow their business on Abatrades — completely free to start.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/join" style={{
          padding: "14px 36px", background: "#0f172a", color: "#fff",
          borderRadius: "10px", fontWeight: 600, fontSize: "15px",
          textDecoration: "none", display: "inline-block",
        }}>
          Start for free →
        </Link>
        <a href="#how-it-works" style={{
          padding: "14px 28px", background: "#f8fafc", color: "#374151",
          borderRadius: "10px", fontWeight: 500, fontSize: "15px",
          textDecoration: "none", border: "1.5px solid #e2e8f0", display: "inline-block",
        }}>
          See how it works
        </a>
      </div>
    </section>

    {/* ── Stats strip ── */}
    <section style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "center" }}>
        {[
          { stat: "Free",     label: "to sign up and list" },
          { stat: "Nigeria",  label: "focused marketplace" },
          { stat: "Paystack", label: "secure payments" },
        ].map(({ stat, label }) => (
          <div key={stat}>
            <p style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{stat}</p>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── How it works ── */}
    <section id="how-it-works" style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#3b7bf8", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 10px" }}>How it works</p>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
          From sign-up to first sale
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
        {STEPS.map(({ n, title, body }) => (
          <div key={n}>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "#e2e8f0", margin: "0 0 14px", letterSpacing: "1px" }}>{n}</p>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0 0 8px" }}>{title}</h3>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Benefits ── */}
    <section style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#3b7bf8", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 10px" }}>Why Abatrades</p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
            Everything you need to sell
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {BENEFITS.map(({ icon, title, body }) => (
            <div key={title} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
              <h3 style={{ fontSize: "14.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Premium: Rafiki + Warehouse + Logistics ── */}
    <section style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <span style={{
          display: "inline-block", fontSize: "11px", fontWeight: 700,
          background: "#fef9c3", color: "#854d0e",
          padding: "4px 14px", borderRadius: "999px",
          letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "16px",
        }}>
          Premium Members Only
        </span>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#3b7bf8", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 10px" }}>
          Full-service selling
        </p>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 600, color: "#0f172a", margin: "0 0 14px", letterSpacing: "-0.3px" }}>
          We handle the hard parts for you
        </h2>
        <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          Premium sellers get access to our end-to-end fulfilment pipeline — from sourcing in China all the way to delivery at your buyer's door.
        </p>
      </div>

      {/* Flow steps */}
      <div style={{ margin: "48px 0 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px" }}>
        {[
          {
            step: "01", icon: "🇨🇳", title: "Source from China via Rafiki",
            body: "Browse and import products directly from Chinese suppliers through our official partner, Rafiki. No middlemen, no guesswork.",
          },
          {
            step: "02", icon: "🏭", title: "Ship to our warehouse",
            body: "Use our warehouse address as your delivery point. Your goods arrive, we receive and log every item on your behalf.",
          },
          {
            step: "03", icon: "📦", title: "We store your inventory",
            body: "Your stock sits safely in our facility until it sells. No need to rent space or manage storage yourself. A small fee applies.",
          },
          {
            step: "04", icon: "🚚", title: "We deliver to your buyers",
            body: "When an order comes in, we pack and dispatch it using our logistics network. Your buyer gets it fast. You just watch the sales roll in.",
          },
        ].map(({ step, icon, title, body }, i, arr) => (
          <div key={step} style={{ display: "flex", alignItems: "stretch" }}>
            <div style={{
              flex: 1, background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: i === 0 ? "14px 0 0 14px" : i === arr.length - 1 ? "0 14px 14px 0" : "0",
              borderLeft: i > 0 ? "none" : "1px solid #e2e8f0",
              padding: "28px 22px",
            }}>
              <div style={{ fontSize: "26px", marginBottom: "12px" }}>{icon}</div>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#e2e8f0", margin: "0 0 8px", letterSpacing: "1px" }}>{step}</p>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.4 }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Address choice callout */}
      <div style={{
        background: "#f8fafc", border: "1px solid #e2e8f0",
        borderRadius: "14px", padding: "24px 28px",
        display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap",
      }}>
        <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>📍</div>
        <div>
          <h3 style={{ fontSize: "14.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>
            Your address or ours — your choice
          </h3>
          <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.7, margin: "0 0 10px" }}>
            You can use your own personal or business address for deliveries, or use our warehouse as your registered delivery address. Sellers who use our warehouse get the added benefit of inventory storage and our in-house logistics at order fulfilment time.
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
            ★ Warehouse storage and Abatrades logistics are available to premium members only. Standard sellers manage their own storage and delivery.
          </p>
        </div>
      </div>
    </section>

    {/* ── FAQ ── */}
    <section style={{ maxWidth: "640px", margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#3b7bf8", letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 10px" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
          Common questions
        </h2>
      </div>
      <div>
        {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
      </div>
    </section>

    {/* ── Final CTA ── */}
    <section style={{ background: "#0f172a" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.3px" }}>
          Ready to start selling?
        </h2>
        <p style={{ fontSize: "15px", color: "#94a3b8", margin: "0 0 32px", lineHeight: 1.6 }}>
          Set up your store today. It's free, it's fast, and your buyers are already here.
        </p>
        <Link to="/join" style={{
          display: "inline-block", padding: "14px 40px",
          background: "#fff", color: "#0f172a",
          borderRadius: "10px", fontWeight: 700, fontSize: "15px",
          textDecoration: "none",
        }}>
          Create your store →
        </Link>
      </div>
    </section>
  </div>
);

export default BecomeASeller;
