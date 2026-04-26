import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/img/abatrades-large-logo.png";

/* ── Decorative seller-card mockup shown in the hero ── */
const MockCard = ({ name, tag, visits, color, rotate, top, left, zIndex, animDelay = "0s" }) => (
  <div style={{
    position: "absolute", top, left, zIndex,
    animation: `heroFloat 3.2s ease-in-out infinite`,
    animationDelay: animDelay,
  }}>
    <div style={{
      transform: `rotate(${rotate})`,
      background: "white",
      borderRadius: "16px",
      padding: "14px",
      width: "190px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
      userSelect: "none",
    }}>
      <div style={{ height: "52px", borderRadius: "10px", background: color, marginBottom: "10px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: color, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 800, color: "white", flexShrink: 0,
        }}>
          {name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "12px", color: "#111827" }}>{name}</div>
          <div style={{ fontSize: "10px", color: "#6b7280" }}>{visits} visits</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: "44px", borderRadius: "6px",
            background: `${color}22`,
            border: `1px solid ${color}33`,
          }} />
        ))}
      </div>
      <div style={{
        marginTop: "8px",
        background: color, color: "white",
        borderRadius: "6px", padding: "5px 0",
        textAlign: "center", fontSize: "10px", fontWeight: 700,
      }}>
        {tag}
      </div>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section style={{
      background: "#ffffff",
      paddingTop: "56px",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    }}>

      {/* Subtle background grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.55,
      }} />

      {/* Gradient fade at edges */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,123,248,0.05) 0%, transparent 70%)",
      }} />

      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        padding: "32px 24px 56px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "48px",
        alignItems: "center",
        position: "relative",
        width: "100%",
      }}
        className="hero-grid"
      >

        {/* ── LEFT: Copy ── */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "22px" }}>
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#0f172a",
              letterSpacing: "-1.5px",
              margin: 0,
              flex: 1,
            }}>
              <span style={{ fontWeight: 400 }}>Sell more.</span><br />
              <span style={{ color: "#f97316" }}>
                Grow faster.
              </span><br />
              <span style={{ fontWeight: 400 }}>Own your store.</span>
            </h1>
            {/* Logo — visible on mobile only, beside the headline */}
            <img
              src={Logo}
              alt="Abatrades"
              className="hero-mobile-logo"
              style={{ width: "120px", height: "auto", flexShrink: 0, objectFit: "contain" }}
            />
          </div>

          <p style={{
            fontSize: "17px",
            color: "#475569",
            lineHeight: 1.75,
            maxWidth: "460px",
            marginBottom: "40px",
          }}>
            Abatrades puts your storefront in front of thousands of buyers.
            List your products, manage orders, and grow your business — all in one place.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/sellersignup" style={{
              background: "transparent",
              color: "#f97316", padding: "15px 32px",
              borderRadius: "10px", fontWeight: 700, fontSize: "15px",
              textDecoration: "none",
              border: "2px solid #f97316",
              transition: "background 0.15s, transform 0.15s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff7ed"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Start for free
            </Link>
            <a href="#discover" style={{
              background: "white", color: "#0f172a",
              padding: "15px 32px", borderRadius: "10px",
              fontWeight: 600, fontSize: "15px",
              textDecoration: "none",
              border: "1.5px solid #e2e8f0",
              display: "inline-block",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3b7bf8"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              Browse stores →
            </a>
          </div>
        </div>

        {/* ── MIDDLE: Logo ── */}
        <div className="hero-logo-col" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            src={Logo}
            alt="Abatrades"
            style={{ height: "clamp(80px, 10vw, 140px)", width: "auto", display: "block" }}
          />
        </div>

        {/* ── RIGHT: Decorative mockup ── */}
        <div style={{
          position: "relative",
          height: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
          className="hero-visual"
        >
          {/* Background blob */}
          <div style={{
            position: "absolute",
            width: "380px", height: "380px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />

          {/* Seller cards floating */}
          <MockCard
            name="Anime Store"
            tag="Fashion · 230 items"
            visits="1.2k"
            color="#6366f1"
            rotate="-4deg"
            top="20px"
            left="10px"
            zIndex={3}
            animDelay="0s"
          />
          <MockCard
            name="TechNaija"
            tag="Electronics · 85 items"
            visits="890"
            color="#0ea5e9"
            rotate="3deg"
            top="60px"
            left="200px"
            zIndex={2}
            animDelay="0.8s"
          />
          <MockCard
            name="Lagos Glam"
            tag="Beauty · 140 items"
            visits="3.4k"
            color="#ec4899"
            rotate="-2deg"
            top="240px"
            left="60px"
            zIndex={4}
            animDelay="1.6s"
          />

          {/* Stats badge */}
          <div style={{
            position: "absolute", bottom: "40px", right: "0px",
            background: "white", borderRadius: "14px",
            padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 5,
            animation: "heroFloat 3.2s ease-in-out infinite",
            animationDelay: "2.4s",
          }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>NEW ORDER</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Hoodie XL — ₦18,500</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Payment confirmed</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .hero-mobile-logo { display: none; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; padding: 40px 20px 40px !important; }
          .hero-visual { height: 420px !important; width: 100% !important; margin-top: 60px !important; }
          .hero-logo-col { display: none !important; }
          .hero-mobile-logo { display: block !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
