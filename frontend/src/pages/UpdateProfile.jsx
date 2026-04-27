import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/img/abatrades-logo-other.png";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ac = () => {
  const token = localStorage.getItem("access_token");
  return {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

/* ── Underline input field ── */
const Field = ({ label, type = "text", name, value, onChange, disabled, placeholder }) => (
  <div style={{ marginBottom: "24px" }}>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "6px" }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "8px 0", fontSize: "14px", color: disabled ? "#94a3b8" : "#0f172a",
        background: "transparent", border: "none", borderBottom: `2px solid ${disabled ? "#f1f5f9" : "#e2e8f0"}`,
        borderRadius: 0, outline: "none", transition: "border-color 0.2s",
        fontFamily: "inherit", boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : "auto",
      }}
      onFocus={e => { if (!disabled) e.target.style.borderBottomColor = "#2563eb"; }}
      onBlur={e => { if (!disabled) e.target.style.borderBottomColor = "#e2e8f0"; }}
    />
  </div>
);

/* ── Section divider ── */
const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "32px 0 24px" }}>
    <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
    <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.7px", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
  </div>
);

/* ── Password rule line ── */
const Rule = ({ met, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: met ? "#16a34a" : "#94a3b8", marginBottom: "3px" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {met ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
    </svg>
    {text}
  </div>
);

const UpdateProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ first_name: "", last_name: "", phone_number: "", address: "", email: "" });
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword]     = useState("");
  const [newPassword, setNewPassword]             = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPw, setChangingPw]               = useState(false);

  const rules = {
    length:      newPassword.length >= 8,
    uppercase:   /[A-Z]/.test(newPassword),
    lowercase:   /[a-z]/.test(newPassword),
    number:      /[0-9]/.test(newPassword),
    special:     /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  useEffect(() => {
    axios.get(`${BASE}/api/update-profile/`, ac())
      .then(r => setProfile(r.data))
      .catch(() => toast.error("Failed to load profile. Please try again."));
  }, []);

  const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${BASE}/api/update-profile/`, profile, ac());
      localStorage.setItem("profileUpdateSuccess", "true");
      navigate("/user-profile");
    } catch {
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) { toast.error("Passwords do not match."); return; }
    if (!Object.values(rules).every(Boolean)) { toast.error("Password does not meet requirements."); return; }
    setChangingPw(true);
    try {
      await axios.post(`${BASE}/api/change-password/`, { old_password: currentPassword, new_password: newPassword }, ac());
      toast.success("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await axios.delete(`${BASE}/api/delete-account/`, ac());
      await logout();
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not delete account. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <ToastContainer position="top-center" />

      {/* Topbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 20px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/browse"><img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} /></Link>
        <Link to="/user-profile" style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "5px 12px", borderRadius: "7px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </Link>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "32px 20px 60px" }}>

        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a", margin: "0 0 28px" }}>Edit Profile</h1>

        {/* Profile form */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} />
              <Field label="Last Name"  name="last_name"  value={profile.last_name}  onChange={handleChange} />
            </div>
            <Field label="Email" name="email" value={profile.email} disabled />
            <Field label="Phone Number" name="phone_number" value={profile.phone_number} onChange={handleChange} placeholder="+2348012345678" />
            <Field label="Address"      name="address"      value={profile.address}      onChange={handleChange} placeholder="Your delivery address" />

            <button
              type="submit"
              disabled={saving}
              style={{ width: "100%", padding: "11px", background: saving ? "#f1f5f9" : "#0f172a", color: saving ? "#94a3b8" : "#fff", border: "none", borderRadius: "9px", fontWeight: 600, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", transition: "background 0.15s" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", marginTop: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.7px", margin: "0 0 20px" }}>Change Password</p>
          <form onSubmit={handleChangePassword}>
            <Field label="Current Password"  type="password" value={currentPassword}    onChange={e => setCurrentPassword(e.target.value)} />
            <Field label="New Password"       type="password" value={newPassword}         onChange={e => setNewPassword(e.target.value)} />

            {newPassword.length > 0 && (
              <div style={{ marginTop: "-16px", marginBottom: "20px" }}>
                <Rule met={rules.length}    text="At least 8 characters" />
                <Rule met={rules.uppercase} text="One uppercase letter" />
                <Rule met={rules.lowercase} text="One lowercase letter" />
                <Rule met={rules.number}    text="One number" />
                <Rule met={rules.special}   text="One special character" />
              </div>
            )}

            <Field label="Confirm New Password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />

            <button
              type="submit"
              disabled={changingPw}
              style={{ width: "100%", padding: "11px", background: "#f8fafc", color: "#0f172a", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontWeight: 600, fontSize: "14px", cursor: changingPw ? "not-allowed" : "pointer" }}
            >
              {changingPw ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div style={{ marginTop: "16px", padding: "20px 24px", background: "#fff", borderRadius: "14px", border: "1px solid #fee2e2" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.7px", margin: "0 0 6px" }}>Danger Zone</p>
          <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: "0 0 14px" }}>Once deleted, your account and all data are permanently removed.</p>
          <button
            onClick={handleDeleteAccount}
            style={{ padding: "9px 20px", background: "transparent", color: "#ef4444", border: "1.5px solid #fca5a5", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateProfile;
