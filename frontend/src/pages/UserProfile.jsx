import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/img/abatrades-logo-other.png";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SectionLabel = ({ children }) => (
  <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>
    {children}
  </p>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: "13.5px", color: "#0f172a", fontWeight: 400, maxWidth: "60%", textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
  </div>
);

const ActionRow = ({ icon, label, sublabel, onClick, color = "#0f172a", danger, last }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", display: "flex", alignItems: "center", gap: "14px",
      padding: "13px 16px", background: danger ? "#fff5f5" : "#fff",
      border: "none", borderBottom: last ? "none" : "1px solid #f1f5f9",
      cursor: "pointer", textAlign: "left", transition: "background 0.12s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = danger ? "#fee2e2" : "#f8fafc"}
    onMouseLeave={e => e.currentTarget.style.background = danger ? "#fff5f5" : "#fff"}
  >
    <span style={{
      width: "36px", height: "36px", borderRadius: "10px",
      background: danger ? "#fee2e2" : "#f1f5f9",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, color: danger ? "#ef4444" : "#475569",
    }}>
      {icon}
    </span>
    <span style={{ flex: 1 }}>
      <span style={{ display: "block", fontSize: "13.5px", fontWeight: 500, color: danger ? "#ef4444" : color }}>{label}</span>
      {sublabel && <span style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "1px" }}>{sublabel}</span>}
    </span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={danger ? "#ef4444" : "#cbd5e1"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </button>
);

const Card = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "16px", ...style }}>
    {children}
  </div>
);

const CardHead = ({ children }) => (
  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
    <SectionLabel>{children}</SectionLabel>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const [switching, setSwitching] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("profileUpdateSuccess") === "true") {
      toast.success("Profile updated successfully!");
      localStorage.removeItem("profileUpdateSuccess");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("access_token");
    axios.get(`${BASE}/api/orders/my/`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => setOrders(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleSwitchToSeller = async () => {
    setSwitching(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${BASE}/api/switch-role/`, {}, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await refreshUser();
      navigate("/seller/overview");
    } catch {
      toast.error("Could not switch role. Please try again.");
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${BASE}/api/delete-account/`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await logout();
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not delete account. Please try again.");
      setDeleting(false);
    }
  };

  const fmtNGN = n => parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
  const fmtDate = d => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const STATUS_COLOR = {
    pending:    "#854d0e", paid: "#15803d", processing: "#1d4ed8",
    shipped:    "#4338ca", delivered: "#166534", cancelled: "#b91c1c",
  };
  const STATUS_BG = {
    pending:    "#fef9c3", paid: "#dcfce7", processing: "#dbeafe",
    shipped:    "#e0e7ff", delivered: "#f0fdf4", cancelled: "#fee2e2",
  };

  const initials = ((user?.first_name || user?.email || "U").charAt(0)).toUpperCase();
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.email;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <ToastContainer position="bottom-center" />

      {/* ── Topbar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 20px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/browse"><img src={Logo} alt="Abatrades" style={{ height: "26px", display: "block" }} /></Link>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "13px", fontWeight: 500, background: "#f8fafc", padding: "5px 12px", borderRadius: "7px", border: "1px solid #e2e8f0", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      {/* ── Page ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Name + avatar hero */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "28px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "linear-gradient(135deg, #3b7bf8, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>{displayName}</h1>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 600, background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "999px" }}>Buyer Account</span>
              {user?.loyalty_points > 0 && (
                <span style={{ fontSize: "11.5px", fontWeight: 600, background: "#fef9c3", color: "#854d0e", padding: "3px 10px", borderRadius: "999px" }}>
                  {user.loyalty_points.toLocaleString()} loyalty pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column grid on desktop, single on mobile ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0 24px", alignItems: "start" }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Account details */}
            <Card>
              <CardHead>Account Details</CardHead>
              <div style={{ padding: "0 16px" }}>
                <InfoRow label="Full name" value={displayName} />
                <InfoRow label="Email" value={user?.email} />
                <InfoRow label="Phone" value={user?.phone_number} />
                <InfoRow label="Address" value={user?.address} />
              </div>
              <ActionRow
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                label="Edit Profile"
                sublabel="Update your name, phone, and address"
                onClick={() => navigate("/edit-profile")}
                last
              />
            </Card>

            {/* Account actions */}
            <Card>
              <CardHead>Account</CardHead>
              <ActionRow
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                label={switching ? "Switching…" : "Switch to Seller Account"}
                sublabel="Start selling on Abatrades"
                onClick={handleSwitchToSeller}
                color="#15803d"
              />
              <ActionRow
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                label="Sign Out"
                onClick={handleLogout}
                danger
                last
              />
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Quick links */}
            <Card>
              <CardHead>Quick Links</CardHead>
              <ActionRow
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
                label="My Cart"
                sublabel="View items saved in your cart"
                onClick={() => navigate("/cart")}
              />
              <ActionRow
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                label="Browse Stores"
                sublabel="Discover sellers on Abatrades"
                onClick={() => navigate("/browse")}
                last
              />
            </Card>

            {/* Recent orders */}
            <Card>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionLabel>Recent Orders</SectionLabel>
                <button onClick={() => navigate("/orders")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#2563eb", fontWeight: 600, padding: 0 }}>
                  View all →
                </button>
              </div>

              {ordersLoading ? (
                <div style={{ padding: "28px", textAlign: "center" }}>
                  <div className="spinner-border" style={{ width: "1.4rem", height: "1.4rem", color: "#2563eb" }} />
                </div>
              ) : orders.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: "32px", margin: "0 0 8px" }}>📦</p>
                  <p style={{ fontSize: "13.5px", color: "#0f172a", fontWeight: 500, margin: "0 0 4px" }}>No orders yet</p>
                  <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: "0 0 14px" }}>Your purchases will appear here.</p>
                  <button onClick={() => navigate("/browse")} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div>
                  {orders.map((order, i) => {
                    const bg = ({ pending:"#fef9c3",paid:"#dcfce7",processing:"#dbeafe",shipped:"#e0e7ff",delivered:"#f0fdf4",cancelled:"#fee2e2" })[order.status] || "#f1f5f9";
                    const cl = ({ pending:"#854d0e",paid:"#15803d",processing:"#1d4ed8",shipped:"#4338ca",delivered:"#166534",cancelled:"#b91c1c" })[order.status] || "#475569";
                    return (
                      <div key={order.id} style={{ padding: "12px 16px", borderBottom: i < orders.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                        <div>
                          <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 3px" }}>Order #{order.id}</p>
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                            {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            {" · "}{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                            {parseFloat(order.total_amount || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}
                          </p>
                          <span style={{ fontSize: "11px", fontWeight: 600, background: bg, color: cl, padding: "2px 8px", borderRadius: "999px" }}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

        </div>

        {/* ── Danger zone — always last, full width, far from sign out ── */}
        <div style={{ marginTop: "48px", borderTop: "1px solid #fee2e2", paddingTop: "32px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px" }}>
            Danger Zone
          </p>

          {!showDeleteConfirm ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px 20px" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", marginBottom: "2px" }}>Delete Account</div>
                <div style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5 }}>Permanently remove your profile, order history, and all data. This cannot be undone.</div>
              </div>
              <button
                onClick={() => { setShowDeleteConfirm(true); setDeleteInput(""); }}
                style={{ padding: "8px 18px", background: "transparent", color: "#b91c1c", border: "1.5px solid #fecaca", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div style={{ background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#b91c1c", marginBottom: "8px" }}>Are you sure?</div>
              <p style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: 1.65, margin: "0 0 14px" }}>
                This is permanent. Your profile, order history, and any store data will be deleted and cannot be recovered.
              </p>
              <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 8px", fontWeight: 500 }}>
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", fontSize: "13.5px", border: "1.5px solid #fecaca", outline: "none", marginBottom: "12px", fontFamily: "monospace", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deleting}
                  style={{ padding: "8px 20px", background: deleteInput === "DELETE" && !deleting ? "#b91c1c" : "#94a3b8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: deleteInput === "DELETE" && !deleting ? "pointer" : "not-allowed" }}
                >
                  {deleting ? "Deleting…" : "Delete my account"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ padding: "8px 16px", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 500, fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
