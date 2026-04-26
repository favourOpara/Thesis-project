import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ShopCard from "../components/ShopCard";
import SearchResults from "../components/SearchResults";
import CookieConsent from "../components/CookieConsent";
import SearchContext from "../context/SearchContext";
import "./Home.css";

/* ─────────────────────────────────────────
   SERVICES MARQUEE
───────────────────────────────────────── */
const TICKER_ITEMS = [
  "Source products from overseas",
  "Warehouse storage — no space needed at home",
  "Your own branded online store",
  "Import goods directly from global suppliers",
  "Manage orders & sales in one dashboard",
  "Use our warehouse and logistics",
  "Reach thousands of buyers daily",
  "Grow your business — commission-free",
];

const Marquee = () => (
  <div className="marquee-wrap" style={{ overflow: "hidden", padding: "10px 0" }}>
    <div style={{
      display: "flex",
      width: "max-content",
      animation: "marqueeScroll 30s linear infinite",
      willChange: "transform",
    }}>
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#374151",
          whiteSpace: "nowrap",
          padding: "0 32px",
        }}>
          {item}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      ))}
    </div>
    <style>{`
      @keyframes marqueeScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @media (max-width: 768px) {
        .marquee-wrap { margin-top: 16px; }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────── */
const STATS = [
  { value: "Order from overseas",     label: "Source global products directly" },
  { value: "Use our warehouse & logistics", label: "We store, pack, and deliver for you" },
  { value: "Advertise your products", label: "Reach thousands of buyers" },
  { value: "Get paid",                label: "Secure & instant payments" },
];

const StatsStrip = () => (
  <section style={{ background: "#0f172a", padding: "0", marginTop: "48px" }}>
    <div style={{
      maxWidth: "1200px", margin: "0 auto",
      padding: "0 24px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
    }}
      className="stats-grid"
    >
      {STATS.map((s, i) => (
        <div key={i} style={{
          padding: "28px 20px",
          textAlign: "center",
          borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}>
          <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 800, color: "white", lineHeight: 1.3 }}>
            {s.value}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px", fontWeight: 500 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @media (max-width: 640px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────
   DIASPORA / INTERNATIONAL SECTION
───────────────────────────────────────── */
const DiasporaSection = () => (
  <section style={{
    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)",
    padding: "80px 24px",
    position: "relative",
    overflow: "hidden",
  }}>

    {/* Background flight path arcs */}
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none" }} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
      <path d="M-100,350 Q300,50 700,200 Q1000,320 1350,80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="12 8"/>
      <path d="M-100,200 Q400,350 800,100 Q1050,0 1350,250" fill="none" stroke="white" strokeWidth="2" strokeDasharray="12 8"/>
      <circle cx="700" cy="200" r="6" fill="white"/>
      <circle cx="300" cy="180" r="4" fill="white"/>
      <circle cx="1000" cy="130" r="5" fill="white"/>
    </svg>

    {/* Dot grid */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }} />

    <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>

      {/* Top label */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.15)", borderRadius: "999px",
          padding: "6px 16px", marginBottom: "20px",
        }}>
          {/* Airplane icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2a1.5 1.5 0 0 0-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "1px", textTransform: "uppercase" }}>
            For local &amp; international businesses
          </span>
        </div>
        <h2 style={{
          fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 900,
          color: "white", lineHeight: 1.1, letterSpacing: "-0.5px",
          marginBottom: "16px",
        }}>
          Sell in Nigeria.<br />
          <span style={{ color: "#bae6fd" }}>From anywhere in the world.</span>
        </h2>
        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.75)",
          maxWidth: "560px", margin: "0 auto", lineHeight: 1.75,
        }}>
          You don't need to be in Lagos to sell to Lagos. Whether you're in London, Houston, or Dubai —
          we handle the warehousing, fulfilment, and last-mile delivery so your customers get their orders on time.
        </p>
      </div>

      {/* Cards row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
        className="diaspora-grid"
      >
        {[
          {
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2a1.5 1.5 0 0 0-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="#0ea5e9" stroke="none"/>
              </svg>
            ),
            title: "Ship your goods to us",
            body: "Send your products from abroad directly to our warehouse in Nigeria. We receive, inspect, and catalogue everything for you.",
          },
          {
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            ),
            title: "We store & list for you",
            body: "Your products live in our secure warehouse and go live on your Abatrades storefront — visible to thousands of Nigerian buyers every day.",
          },
          {
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
            title: "We deliver to your customers",
            body: "When an order comes in, we pack and deliver directly to your buyer's doorstep — anywhere in Nigeria. You just collect your money.",
          },
        ].map((card, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: "28px 24px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "16px",
            }}>
              {card.icon}
            </div>
            <h4 style={{ color: "white", fontWeight: 800, fontSize: "15px", marginBottom: "10px" }}>
              {card.title}
            </h4>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.65, margin: 0 }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <Link to="/sellersignup" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "white", color: "#0284c7",
          padding: "14px 32px", borderRadius: "10px",
          fontWeight: 800, fontSize: "15px", textDecoration: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          Start selling in Nigeria
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "14px" }}>
          No Nigerian warehouse needed. No local agent required.
        </p>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .diaspora-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────
   FEATURE SPLIT SECTIONS
───────────────────────────────────────── */
const SellerVisual = () => (
  <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
    {/* Main storefront card */}
    <div style={{
      background: "white", borderRadius: "20px", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    }}>
      <div style={{ height: "120px", background: "linear-gradient(135deg, #3b7bf8, #7c3aed)" }} />
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", marginTop: "-40px", marginBottom: "14px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: "#3b7bf8", border: "3px solid white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 900, color: "white",
          }}>E</div>
          <div style={{ paddingBottom: "4px" }}>
            <div style={{ fontWeight: 800, fontSize: "15px", color: "#0f172a" }}>Everything Gadgets</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Fashion · Lagos</div>
          </div>
          <div style={{
            marginLeft: "auto", paddingBottom: "4px",
            background: "#eff6ff", color: "#3b7bf8",
            borderRadius: "999px", padding: "3px 10px",
            fontSize: "11px", fontWeight: 700,
          }}>Verified ✓</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {["#e0e7ff","#fce7f3","#d1fae5"].map((bg, i) => (
            <div key={i} style={{ background: bg, borderRadius: "10px", height: "80px" }} />
          ))}
        </div>
        <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, background: "#3b7bf8", borderRadius: "8px", padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>
            View Store
          </div>
          <div style={{ flex: 1, background: "#f8fafc", borderRadius: "8px", padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#374151" }}>
            Message
          </div>
        </div>
      </div>
    </div>

    {/* Floating stat */}
    <div style={{
      position: "absolute", top: "16px", right: "-20px",
      background: "white", borderRadius: "12px", padding: "12px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>THIS WEEK</div>
      <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>₦240k</div>
      <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>↑ 18% revenue</div>
    </div>

    {/* Floating order */}
    <div style={{
      position: "absolute", bottom: "-16px", left: "-16px",
      background: "white", borderRadius: "12px", padding: "12px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🛍️</div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>New order!</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>Sneakers · ₦32,000</div>
        </div>
      </div>
    </div>
  </div>
);

const BuyerVisual = () => (
  <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
    <div style={{
      background: "#f8fafc", borderRadius: "20px", padding: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    }}>
      {/* Search bar mockup */}
      <div style={{
        background: "white", borderRadius: "10px", padding: "11px 16px",
        display: "flex", alignItems: "center", gap: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "16px",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>Search sellers, products...</span>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {["All","Fashion","Tech","Beauty","Food"].map((c, i) => (
          <span key={c} style={{
            background: i === 0 ? "#3b7bf8" : "white",
            color: i === 0 ? "white" : "#374151",
            borderRadius: "999px", padding: "5px 14px",
            fontSize: "12px", fontWeight: 600,
            border: i !== 0 ? "1px solid #e2e8f0" : "none",
          }}>{c}</span>
        ))}
      </div>

      {/* Mini seller cards */}
      {[
        { name: "Zara Lagos", cat: "Fashion", color: "#6366f1", items: 230 },
        { name: "TechNaija", cat: "Electronics", color: "#0ea5e9", items: 85 },
        { name: "Lagos Glam", cat: "Beauty", color: "#ec4899", items: 140 },
      ].map(s => (
        <div key={s.name} style={{
          background: "white", borderRadius: "12px", padding: "12px",
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: s.color, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: 900, color: "white",
          }}>{s.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>{s.name}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{s.cat} · {s.items} items</div>
          </div>
          <div style={{
            background: "#eff6ff", color: "#3b7bf8",
            borderRadius: "6px", padding: "4px 10px",
            fontSize: "11px", fontWeight: 700,
          }}>View →</div>
        </div>
      ))}
    </div>
  </div>
);

const FeatureSection = ({ eyebrow, headline, body, cta, ctaHref, visual, flip }) => (
  <section style={{ padding: "96px 0", background: flip ? "#f8fafc" : "white" }}>
    <div style={{
      maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "72px",
      alignItems: "center",
    }}
      className="feature-grid"
    >
      {/* Text always first in DOM; CSS flips visually */}
      <div className={flip ? "feature-text order-2-mobile" : "feature-text"} style={{ order: flip ? 2 : 1 }}>
        <p style={{
          color: "#3b7bf8", fontWeight: 700, fontSize: "12px",
          letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "14px",
        }}>{eyebrow}</p>
        <h2 style={{
          fontSize: "clamp(26px, 3.5vw, 42px)",
          fontWeight: 900, color: "#0f172a",
          lineHeight: 1.12, letterSpacing: "-0.5px",
          marginBottom: "20px",
        }}>{headline}</h2>
        <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.75, marginBottom: "32px" }}>
          {body}
        </p>
        <Link to={ctaHref} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#f97316", color: "white",
          padding: "13px 28px", borderRadius: "10px",
          fontWeight: 700, fontSize: "14px", textDecoration: "none",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#ea580c"}
          onMouseLeave={e => e.currentTarget.style.background = "#f97316"}
        >
          {cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>

      <div style={{ order: flip ? 1 : 2, display: "flex", justifyContent: "center" }}
        className="feature-visual"
      >
        {visual}
      </div>
    </div>
    <style>{`
      .feature-grid { }
      @media (max-width: 768px) {
        .feature-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .feature-grid > div { order: unset !important; }
        .feature-visual { justify-content: flex-start !important; }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────── */
const STEPS = [
  { n: "1", title: "Create your store", body: "Sign up free and set up your storefront in minutes. Add your logo, banner, and description." },
  { n: "2", title: "List your products", body: "Upload products with photos, pricing, and sizes. Your catalogue goes live immediately." },
  { n: "3", title: "Buyers discover you", body: "Buyers browse seller storefronts, explore your products, and add to cart." },
  { n: "4", title: "Get paid, grow", body: "Receive secure Paystack payments. Track orders, manage inventory, earn loyal customers." },
];

const HowItWorks = () => (
  <section style={{ background: "#f97316", padding: "96px 0" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700, fontSize: "12px", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>
          Simple process
        </p>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900,
          color: "white", letterSpacing: "-0.5px", lineHeight: 1.1,
        }}>
          Up and running<br />
          <span style={{ color: "rgba(255,255,255,0.85)" }}>in under 10 minutes</span>
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "2px",
        position: "relative",
      }}
        className="steps-grid"
      >
        {STEPS.map((s, i) => (
          <div key={i} style={{
            background: i % 2 === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)",
            padding: "36px 28px",
            borderRadius: i === 0 ? "16px 0 0 16px" : i === 3 ? "0 16px 16px 0" : "0",
            position: "relative",
          }}>
            <div style={{
              fontSize: "48px", fontWeight: 900,
              color: "rgba(255,255,255,0.2)",
              lineHeight: 1, marginBottom: "16px",
              fontFamily: "monospace",
            }}>{s.n}</div>
            <h4 style={{ color: "white", fontWeight: 800, fontSize: "16px", marginBottom: "10px" }}>
              {s.title}
            </h4>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13.5px", lineHeight: 1.65, margin: 0 }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .steps-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
        .steps-grid > div { border-radius: 12px !important; }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────
   LIVE SELLER DIRECTORY
───────────────────────────────────────── */
const LiveSellers = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/shops/")
      .then(r => setShops(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || shops.length === 0) return null;

  return (
    <section id="discover" style={{ background: "white", padding: "96px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ color: "#3b7bf8", fontWeight: 700, fontSize: "12px", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "10px" }}>
              Live on Abatrades
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
              Meet our sellers
            </h2>
          </div>
          <Link to="/sellers" style={{
            color: "#3b7bf8", fontWeight: 700, fontSize: "14px",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
          }}>
            View all sellers
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "22px",
        }}>
          {shops.slice(0, 8).map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   PLANS
───────────────────────────────────────── */
const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Everything you need to get started.",
    features: ["10 product listings", "Your own storefront", "Buyer inquiries", "Basic analytics"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "₦5,000",
    period: "/ month",
    desc: "For sellers ready to scale.",
    features: ["50 product listings", "Priority search placement", "Advanced analytics", "Bulk upload tools", "Everything in Free"],
    cta: "Start Growth",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₦15,000",
    period: "/ month",
    desc: "For serious stores.",
    features: ["500 product listings", "Verified badge", "Featured on homepage", "Dedicated support", "Everything in Growth"],
    cta: "Go Pro",
    highlight: false,
  },
];

const Plans = () => (
  <section style={{ background: "#f8fafc", padding: "96px 0" }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <p style={{ color: "#3b7bf8", fontWeight: 700, fontSize: "12px", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>
          Pricing
        </p>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "14px" }}>
          Simple, transparent pricing
        </h2>
        <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
          Start free, upgrade when you're ready. No hidden fees, no surprises.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
        className="plans-grid"
      >
        {PLANS.map((p, i) => (
          <div key={p.name} style={{
            background: p.highlight ? "#0f172a" : "white",
            borderRadius: "20px",
            padding: "36px 28px",
            border: p.highlight ? "none" : "1.5px solid #e2e8f0",
            position: "relative",
            transform: p.highlight ? "scale(1.04)" : "none",
            boxShadow: p.highlight ? "0 20px 60px rgba(59,123,248,0.25)" : "none",
          }}>
            {p.highlight && (
              <div style={{
                position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                background: "#3b7bf8", color: "white",
                borderRadius: "999px", padding: "4px 16px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}>MOST POPULAR</div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: p.highlight ? "#94a3b8" : "#64748b", marginBottom: "8px" }}>
                {p.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "38px", fontWeight: 900, color: p.highlight ? "white" : "#0f172a", lineHeight: 1 }}>
                  {p.price}
                </span>
                <span style={{ fontSize: "14px", color: p.highlight ? "#64748b" : "#94a3b8", fontWeight: 500 }}>
                  {p.period}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: p.highlight ? "#64748b" : "#94a3b8", marginTop: "8px", marginBottom: 0 }}>
                {p.desc}
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
              {p.features.map(f => (
                <li key={f} style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  fontSize: "13.5px", color: p.highlight ? "#e2e8f0" : "#374151",
                  marginBottom: "10px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.highlight ? "#3b7bf8" : "#22c55e"} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/sellersignup" style={{
              display: "block", textAlign: "center",
              background: p.highlight ? "#3b7bf8" : "transparent",
              color: p.highlight ? "white" : "#0f172a",
              border: p.highlight ? "none" : "1.5px solid #e2e8f0",
              borderRadius: "10px", padding: "12px",
              fontWeight: 700, fontSize: "14px", textDecoration: "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => {
                if (!p.highlight) e.currentTarget.style.borderColor = "#3b7bf8";
              }}
              onMouseLeave={e => {
                if (!p.highlight) e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .plans-grid { grid-template-columns: 1fr !important; }
        .plans-grid > div { transform: none !important; }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────── */
const FinalCTA = () => (
  <section style={{
    background: "linear-gradient(135deg, #3b7bf8 0%, #60a5fa 100%)",
    padding: "100px 24px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  }}>
    {/* Background dots */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    }} />

    <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={{
        fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900,
        color: "white", lineHeight: 1.08,
        letterSpacing: "-1px", marginBottom: "20px",
      }}>
        Your store is waiting.<br />Start today.
      </h2>
      <p style={{
        fontSize: "17px", color: "rgba(255,255,255,0.75)",
        lineHeight: 1.7, marginBottom: "40px",
      }}>
        Join hundreds of Nigerian sellers already building their businesses on Abatrades.
        Free to start, powerful to scale.
      </p>
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/sellersignup" style={{
          background: "white", color: "#3b7bf8",
          padding: "16px 40px", borderRadius: "12px",
          fontWeight: 800, fontSize: "16px", textDecoration: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          Own a Store — It's Free
        </Link>
        <a href="#discover" style={{
          background: "rgba(255,255,255,0.12)", color: "white",
          padding: "16px 40px", borderRadius: "12px",
          fontWeight: 700, fontSize: "16px", textDecoration: "none",
          border: "1.5px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(8px)",
        }}>
          Browse sellers
        </a>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
const Home = () => {
  const { searchQuery } = useContext(SearchContext);

  return (
    <div>
      <Layout>
        <CookieConsent />
        <Header />
        {searchQuery ? (
          <SearchResults />
        ) : (
          <>
            <Hero />
            <Marquee />
            <StatsStrip />
            <DiasporaSection />
            <FeatureSection
              eyebrow="For sellers"
              headline={"Your brand.\nYour storefront.\nYour rules."}
              body="Get a professional storefront you own. Showcase your products, connect with buyers, and manage everything from one dashboard — without paying anyone a commission."
              cta="Create your store"
              ctaHref="/sellersignup"
              visual={<SellerVisual />}
              flip={false}
            />
            <FeatureSection
              eyebrow="For buyers"
              headline={"Discover sellers\nyou can trust."}
              body="Browse storefronts from verified Nigerian sellers. See their full catalogue, check reviews, message them directly, and shop with confidence via secure Paystack checkout."
              cta="Start browsing"
              ctaHref="/signin"
              visual={<BuyerVisual />}
              flip={true}
            />
            <HowItWorks />
            <LiveSellers />
            <Plans />
            <FinalCTA />
          </>
        )}
      </Layout>
    </div>
  );
};

export default Home;
