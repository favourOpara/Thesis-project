import React, { useState, useEffect } from "react";

// Key in localStorage to remember user's choice
const COOKIE_CONSENT_KEY = "cookie_consent_accepted";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on homepage
    if (window.location.pathname !== "/") {
      setVisible(false);
      return;
    }
    // Always show if user hasn't accepted cookies or actively rejected
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!value || value === "false") {
      setVisible(true);
    } else {
      setVisible(false);
    }
    // eslint-disable-next-line
  }, [window.location.pathname]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "false");
    setVisible(false); // Prompt will disappear instantly now
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 6px 32px rgba(50,60,90,0.18)",
          border: "1px solid #e4e7ec",
          padding: "28px 32px 24px 32px",
          maxWidth: "440px",
          width: "92vw",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Accent pill */}
        <div
          style={{
            background: "linear-gradient(90deg, #3b7bf8 50%, #45dfb0 100%)",
            color: "#fff",
            borderRadius: "40px",
            fontSize: "14px",
            fontWeight: 600,
            padding: "5px 18px",
            marginBottom: "16px",
            letterSpacing: "0.01em",
            boxShadow: "0 1px 8px rgba(59,123,248,0.08)",
            border: "none",
            display: "inline-block"
          }}
        >
          Cookie Preferences
        </div>
        <div style={{ maxWidth: "340px", marginBottom: "22px", textAlign: "center", fontSize: "15px", color: "#222" }}>
          <strong style={{ color: "#3b7bf8" }}>We use cookies</strong> to enhance your shopping experience, personalize content, and analyze our traffic.
          By clicking “Accept,” you consent to the use of cookies.{" "}
          <a
            href="/privacy-policy"
            style={{
              color: "#3b7bf8",
              textDecoration: "underline",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            Learn more
          </a>
          .
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            width: "100%",
            marginTop: "0",
          }}
        >
          <button
            onClick={handleAccept}
            style={{
              background: "linear-gradient(90deg,rgb(10, 64, 172) 60%, #45dfb0 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "9px 28px",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 2px 8px rgba(59,123,248,0.10)",
            }}
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            style={{
              background: "#fff",
              color: "#3b7bf8",
              border: "1px solid #c1d1fa",
              borderRadius: "8px",
              padding: "9px 26px",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
              boxShadow: "none",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
