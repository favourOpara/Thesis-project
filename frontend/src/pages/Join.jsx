import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/img/abatrades-large-logo.png";
import GoogleAuth from "../components/GoogleAuth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ── Password rule checker ── */
const rules = (pw) => ({
  length:      pw.length >= 8,
  uppercase:   /[A-Z]/.test(pw),
  lowercase:   /[a-z]/.test(pw),
  number:      /[0-9]/.test(pw),
  specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
});
const RuleRow = ({ ok, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px",
    color: ok ? "#16a34a" : "#94a3b8", marginBottom: "3px" }}>
    <span style={{ fontSize: "11px" }}>{ok ? "✓" : "○"}</span> {label}
  </div>
);

/* ── Shared input style — underline only ── */
const InputField = ({ label, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 500,
        color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</label>
      <input
        {...props}
        style={{
          width: "100%", padding: "8px 0", fontSize: "14.5px", color: "#0f172a",
          background: "transparent", outline: "none", boxSizing: "border-box",
          border: "none", borderBottom: `2px solid ${error ? "#ef4444" : focused ? "#2563eb" : "#e2e8f0"}`,
          transition: "border-color 0.2s", borderRadius: 0,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{error}</p>}
    </div>
  );
};

/* ════════════════════════════════════
   BUYER FORM
════════════════════════════════════ */
const BuyerForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const pw = rules(form.password);

  const handleGoogleSuccess = ({ user, access_token }) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Signed in with Google!");
    setTimeout(() => navigate("/"), 1200);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email)               e.email = "Email is required";
    if (!form.password)            e.password = "Password is required";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreeTerms)               e.terms = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    toast.promise(
      axios.post(`${BASE}/api/signup/`, { email: form.email, password: form.password,
        confirm_password: form.confirmPassword, user_type: "buyer" }, { withCredentials: true }),
      {
        pending: "Creating your account…",
        success: { render() { setTimeout(() => navigate("/signin"), 2200); return "Account created! Redirecting to sign in…"; } },
        error:   { render({ data }) {
          const d = data?.response?.data;
          if (d && typeof d === "object") return Object.values(d).flat().join(" ") || "Sign up failed.";
          return "Sign up failed. Please try again.";
        }},
      }
    );
    setSubmitting(false);
  };

  return (
    <div style={{ animation: "slideDown 0.32s ease" }}>
      {/* Google sign-in */}
      <GoogleAuth
        userType="buyer"
        onSuccess={handleGoogleSuccess}
        onError={(msg) => toast.error(msg)}
      />

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>or sign up with email</span>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>

    <form onSubmit={handleSubmit}>
      <InputField label="Email address" type="email" placeholder="you@email.com"
        value={form.email} onChange={set("email")} error={errors.email} />
      <InputField label="Password" type="password" placeholder="Create a password"
        value={form.password} onChange={set("password")} error={errors.password} />
      {form.password && (
        <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
          <RuleRow ok={pw.length}      label="At least 8 characters" />
          <RuleRow ok={pw.uppercase}   label="One uppercase letter" />
          <RuleRow ok={pw.lowercase}   label="One lowercase letter" />
          <RuleRow ok={pw.number}      label="One number" />
          <RuleRow ok={pw.specialChar} label="One special character" />
        </div>
      )}
      <InputField label="Confirm password" type="password" placeholder="Repeat your password"
        value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />

      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px",
        fontSize: "13px", color: "#374151", cursor: "pointer", marginBottom: "20px" }}>
        <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(v => !v)}
          style={{ marginTop: "2px", accentColor: "#2563eb" }} />
        <span>
          I agree to the{" "}
          <Link to="/terms-and-conditions" style={{ color: "#2563eb" }}>Terms and Conditions</Link>
        </span>
      </label>
      {errors.terms && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "-14px", marginBottom: "12px" }}>{errors.terms}</p>}

      <button type="submit" disabled={submitting} style={{
        width: "100%", padding: "13px", borderRadius: "10px", border: "none",
        background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "15px",
        cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
        transition: "background 0.15s",
      }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#1d4ed8"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; }}
      >
        Create Buyer Account
      </button>

      <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "18px" }}>
        Already have an account?{" "}
        <Link to="/signin" style={{ color: "#2563eb", fontWeight: 600 }}>Sign in</Link>
      </p>
    </form>
    </div>
  );
};

/* ════════════════════════════════════
   SELLER FORM
════════════════════════════════════ */
const SellerForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phoneNumber: "", address: "", password: "", confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const pw = rules(form.password);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleGoogleSuccess = ({ user, access_token }) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Signed in with Google!");
    setTimeout(() => navigate("/seller/overview"), 1200);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName)    e.firstName = "Required";
    if (!form.lastName)     e.lastName  = "Required";
    if (!form.email)        e.email     = "Required";
    if (!form.phoneNumber)  e.phoneNumber = "Required";
    if (!form.address)      e.address   = "Required";
    if (!form.password)     e.password  = "Required";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreeTerms)        e.terms     = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    toast.promise(
      axios.post(`${BASE}/api/signup/`, {
        first_name: form.firstName, last_name: form.lastName,
        email: form.email, password: form.password,
        confirm_password: form.confirmPassword,
        phone_number: form.phoneNumber, address: form.address,
        user_type: "seller",
      }, { withCredentials: true }),
      {
        pending: "Creating your account…",
        success: { render() { setTimeout(() => navigate("/signin"), 2200); return "Account created! Please sign in to access your dashboard."; } },
        error:   { render({ data }) {
          const d = data?.response?.data;
          if (d && typeof d === "object") return Object.values(d).flat().join(" ") || "Sign up failed.";
          return "Sign up failed. Please try again.";
        }},
      }
    );
    setSubmitting(false);
  };

  return (
    <div style={{ animation: "slideDown 0.32s ease" }}>
      {/* Google sign-in */}
      <GoogleAuth
        userType="seller"
        onSuccess={handleGoogleSuccess}
        onError={(msg) => toast.error(msg)}
      />

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>or sign up with email</span>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>

    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <InputField label="First name" type="text" placeholder="Ada"
          value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <InputField label="Last name" type="text" placeholder="Okafor"
          value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <InputField label="Email address" type="email" placeholder="you@email.com"
        value={form.email} onChange={set("email")} error={errors.email} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <InputField label="Phone number" type="text" placeholder="+2348012345678"
          value={form.phoneNumber} onChange={set("phoneNumber")} error={errors.phoneNumber} />
        <InputField label="Address" type="text" placeholder="Lagos, Nigeria"
          value={form.address} onChange={set("address")} error={errors.address} />
      </div>
      <p style={{
        fontSize: "12px", color: "#94a3b8", margin: "-10px 0 20px",
        display: "flex", alignItems: "center", gap: "5px",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Not visible to buyers — used for package delivery only.
      </p>
      <InputField label="Password" type="password" placeholder="Create a password"
        value={form.password} onChange={set("password")} error={errors.password} />
      {form.password && (
        <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
          <RuleRow ok={pw.length}      label="At least 8 characters" />
          <RuleRow ok={pw.uppercase}   label="One uppercase letter" />
          <RuleRow ok={pw.lowercase}   label="One lowercase letter" />
          <RuleRow ok={pw.number}      label="One number" />
          <RuleRow ok={pw.specialChar} label="One special character" />
        </div>
      )}
      <InputField label="Confirm password" type="password" placeholder="Repeat your password"
        value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />

      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px",
        fontSize: "13px", color: "#374151", cursor: "pointer", marginBottom: "20px" }}>
        <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(v => !v)}
          style={{ marginTop: "2px", accentColor: "#2563eb" }} />
        <span>
          I agree to the{" "}
          <Link to="/terms-and-conditions" style={{ color: "#2563eb" }}>Terms and Conditions</Link>
        </span>
      </label>
      {errors.terms && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "-14px", marginBottom: "12px" }}>{errors.terms}</p>}

      <button type="submit" disabled={submitting} style={{
        width: "100%", padding: "13px", borderRadius: "10px", border: "none",
        background: "#f97316", color: "#fff", fontWeight: 700, fontSize: "15px",
        cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
        transition: "background 0.15s",
      }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#ea6c00"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; }}
      >
        Create Seller Account
      </button>

      <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "18px" }}>
        Already have an account?{" "}
        <Link to="/signin" style={{ color: "#2563eb", fontWeight: 600 }}>Sign in</Link>
      </p>
    </form>
    </div>
  );
};

/* ════════════════════════════════════
   ROLE PICKER ROW
════════════════════════════════════ */
const RoleRow = ({ icon, title, desc, accent, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "16px",
        padding: "18px 0", background: "none", border: "none",
        cursor: "pointer", textAlign: "left", transition: "opacity 0.15s",
        opacity: hov ? 1 : 0.85,
      }}
    >
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
        background: `${accent}14`, display: "flex", alignItems: "center",
        justifyContent: "center", color: accent,
        transition: "background 0.15s",
        ...(hov ? { background: `${accent}28` } : {}),
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "15px", color: "#0f172a", marginBottom: "2px" }}>{title}</div>
        <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5"
        style={{ flexShrink: 0, opacity: hov ? 1 : 0.4, transition: "opacity 0.15s" }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
};

/* ════════════════════════════════════
   MAIN JOIN PAGE
════════════════════════════════════ */
const Join = () => {
  const [step, setStep] = useState("pick"); // "pick" | "buyer" | "seller"

  const headings = {
    pick:   { title: "Join Abatrades",        sub: "How would you like to use the platform?" },
    buyer:  { title: "Create a buyer account", sub: "Discover and shop from verified Nigerian sellers." },
    seller: { title: "Create a seller account", sub: "Set up your store and start selling today." },
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px 60px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <ToastContainer position="top-right" />

      {/* Logo */}
      <a href="/">
        <img src={Logo} alt="Abatrades" style={{ height: "56px", marginBottom: "36px" }} />
      </a>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: step === "seller" ? "680px" : "560px",
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
        padding: "40px 40px 36px",
        transition: "max-width 0.3s ease",
      }}
        className="join-card"
      >
        {/* Back button */}
        {step !== "pick" && (
          <button
            onClick={() => setStep("pick")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "#64748b", fontSize: "13px", fontWeight: 600,
              padding: "0 0 20px", marginBottom: "4px",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#0f172a"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Choose a different role
          </button>
        )}

        {/* Heading */}
        <div style={{ marginBottom: "28px", animation: "slideDown 0.28s ease" }} key={step}>
          <h1 style={{ fontWeight: 500, fontSize: "24px", color: "#374151", margin: "0 0 6px" }}>
            {headings[step].title}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {headings[step].sub}
          </p>
        </div>

        {/* Step content */}
        {step === "pick" && (
          <div style={{ animation: "slideDown 0.32s ease" }}>
            <RoleRow
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              }
              title="I'm a Buyer"
              desc="Browse storefronts and shop from verified sellers across Nigeria."
              accent="#2563eb"
              onClick={() => setStep("buyer")}
            />
            <div style={{ height: "1px", background: "#f1f5f9" }} />
            <RoleRow
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              }
              title="I'm a Seller"
              desc="Create your store, list products, and reach thousands of buyers — commission-free."
              accent="#f97316"
              onClick={() => setStep("seller")}
            />
          </div>
        )}

        {step === "buyer"  && <BuyerForm  onBack={() => setStep("pick")} />}
        {step === "seller" && <SellerForm onBack={() => setStep("pick")} />}
      </div>

      {step === "pick" && (
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "#2563eb", fontWeight: 600 }}>Sign in</Link>
        </p>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 540px) {
          .join-card { padding: 28px 20px 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default Join;
