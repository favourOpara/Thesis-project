import React from "react";
import { Link } from "react-router-dom";
import FeaturedShops from "../components/FeaturedShops";
import Logo from "../assets/img/abatrades-logo-other.png";
import { useAuth } from "../context/AuthContext";

const BrowsePage = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Minimal topbar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "white",
          borderBottom: "1px solid #f1f5f9",
          padding: "0 20px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} />
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user && (
            <Link
              to={user.user_type === "seller" ? "/seller/overview" : "/user-profile"}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                textDecoration: "none",
                padding: "5px 12px",
                borderRadius: "7px",
                background: "#f1f5f9",
              }}
            >
              My Account
            </Link>
          )}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              padding: "5px 12px",
              borderRadius: "7px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        style={{
          background: "white",
          padding: "36px 20px 0",
          textAlign: "center",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <p
          style={{
            color: "#3b7bf8",
            fontWeight: 700,
            fontSize: "11.5px",
            letterSpacing: "1.3px",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          Marketplace
        </p>
        <h1
          style={{
            fontWeight: 600,
            fontSize: "clamp(22px, 3vw, 34px)",
            color: "#111827",
            margin: "0 0 10px",
            letterSpacing: "-0.3px",
            lineHeight: 1.2,
          }}
        >
          Browse all sellers
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            maxWidth: "440px",
            margin: "0 auto 28px",
            lineHeight: 1.65,
          }}
        >
          Discover trusted sellers across fashion, electronics, beauty, food, and more.
        </p>
      </div>

      {/* ── Shop directory ── */}
      <FeaturedShops />
    </div>
  );
};

export default BrowsePage;
