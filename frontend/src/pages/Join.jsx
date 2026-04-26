import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/img/abatrades-large-logo.png";

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

/* ── Shared input style ── */
const inp = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1.5px solid #e2e8f0", fontSize: "14px", color: "#0f172a",
  outline: "none", background: "#fff", boxSizing: "border-box",
  transition: "border-color 0.15s",
};
const InputField = ({ label, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600,
        color: "#374151", marginBottom: "6px" }}>{label}</label>
      <input
        {...props}
        style={{ ...inp, borderColor: error ? "#ef4444" : focused ? "#2563eb" : "#e2e8f0" }}
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
    <form onSubmit={handleSubmit} style={{ animation: "slideDown 0.32s ease" }}>
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
    <form onSubmit={handleSubmit} style={{ animation: "slideDown 0.32s ease" }}>
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
  );
};

/* ════════════════════════════════════
   ROLE PICKER
════════════════════════════════════ */
const RoleCard = ({ icon, title, desc, accent, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "1 1 240px", padding: "32px 24px", borderRadius: "16px",
        border: `2px solid ${hov ? accent : "#e2e8f0"}`,
        background: hov ? `${accent}08` : "#fff",
        cursor: "pointer", textAlign: "left",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 32px ${accent}22` : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{
        width: "52px", height: "52px", borderRadius: "14px",
        background: `${accent}18`, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: "18px",
        color: accent, fontSize: "24px",
      }}>
        {icon}
      </div>
      <div style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>
        {title}
      </div>
      <div style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.6 }}>
        {desc}
      </div>
      <div style={{
        marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "13px", fontWeight: 700, color: accent,
      }}>
        Get started
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </button>
  );
};

/* ════════════════════════════════════
   MAIN JOIN PAGE
════════════════════════════════════ */
const Join = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState("pick"); // "pick" | "buyer" | "seller"

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "buyer" || type === "seller") setStep(type);
  }, []);

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
          <h1 style={{ fontWeight: 800, fontSize: "24px", color: "#0f172a", margin: "0 0 6px" }}>
            {headings[step].title}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {headings[step].sub}
          </p>
        </div>

        {/* Step content */}
        {step === "pick" && (
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", animation: "slideDown 0.32s ease" }}>
            <RoleCard
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              }
              title="I'm a Buyer"
              desc="Browse storefronts, discover products, and shop from verified sellers across Nigeria."
              accent="#2563eb"
              onClick={() => setStep("buyer")}
            />
            <RoleCard
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              }
              title="I'm a Seller"
              desc="Create your own store, list your products, and reach thousands of buyers — commission-free."
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
