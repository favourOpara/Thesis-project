import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const Checkout = () => {
  const { cart } = useCart();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    shipping_name:    user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "",
    shipping_phone:   user?.phone_number || "",
    shipping_address: user?.address || "",
    shipping_city:    "",
    shipping_state:   "Lagos",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  if (!user) {
    return (
      <>
        <Header />
        <div style={styles.center}>
          <h3>Please <Link to="/signin">sign in</Link> to checkout.</h3>
        </div>
        <Footer />
      </>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <>
        <Header />
        <div style={styles.center}>
          <h3>Your cart is empty. <Link to="/">Shop now</Link></h3>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${BASE}/api/orders/checkout/`,
        form,
        { withCredentials: true }
      );
      if (data.payment_url) {
        window.location.href = data.payment_url; // redirect to Paystack
      } else {
        navigate(`/orders?ref=${data.reference}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const { items = [], total = 0 } = cart;

  return (
    <>
      <Header />
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Checkout</h1>

          <div style={styles.layout}>
            {/* Shipping Form */}
            <div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Delivery Information</h3>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div style={styles.formGrid}>
                    <div style={styles.formFull}>
                      <label style={styles.label}>Full Name *</label>
                      <input
                        style={styles.input}
                        name="shipping_name"
                        value={form.shipping_name}
                        onChange={handleChange}
                        required
                        placeholder="As on ID"
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Phone Number *</label>
                      <input
                        style={styles.input}
                        name="shipping_phone"
                        value={form.shipping_phone}
                        onChange={handleChange}
                        required
                        placeholder="+2348012345678"
                      />
                    </div>
                    <div>
                      <label style={styles.label}>City *</label>
                      <input
                        style={styles.input}
                        name="shipping_city"
                        value={form.shipping_city}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Lagos Island"
                      />
                    </div>
                    <div style={styles.formFull}>
                      <label style={styles.label}>Delivery Address *</label>
                      <textarea
                        style={{ ...styles.input, resize: "vertical" }}
                        name="shipping_address"
                        value={form.shipping_address}
                        onChange={handleChange}
                        required
                        rows={2}
                        placeholder="House/Flat number, street name, landmark"
                      />
                    </div>
                    <div style={styles.formFull}>
                      <label style={styles.label}>State *</label>
                      <select
                        style={styles.input}
                        name="shipping_state"
                        value={form.shipping_state}
                        onChange={handleChange}
                        required
                      >
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      ...styles.payBtn,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                    disabled={submitting}
                  >
                    {submitting ? "Processing…" : `Pay ${fmtNGN(total)} with Paystack`}
                  </button>
                  <p style={styles.secureNote}>🔒 Your payment is secured and encrypted by Paystack</p>
                </form>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Order Summary</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  {items.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                      <img
                        src={item.main_image_url || "/OIP.png"}
                        alt={item.product_name}
                        style={styles.orderThumb}
                        onError={(e) => { e.target.src = "/OIP.png"; }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={styles.orderName}>{item.product_name}</p>
                        <p style={styles.orderMeta}>Qty: {item.quantity} · {item.shop_name}</p>
                      </div>
                      <span style={styles.orderPrice}>{fmtNGN(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.divider} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>
                  <span>Total</span>
                  <span style={{ color: "#2563eb" }}>{fmtNGN(total)}</span>
                </div>
                {user?.loyalty_points > 0 && (
                  <div style={styles.loyaltyNote}>
                    You'll earn approx. <strong>{Math.floor(total / 100)}</strong> loyalty points on this order.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  page:       { background: "#f1f5f9", minHeight: "100vh", padding: "32px 0 64px" },
  container:  { maxWidth: "1000px", margin: "0 auto", padding: "0 20px" },
  title:      { fontWeight: 800, fontSize: "24px", color: "#0f172a", marginBottom: "24px" },
  layout:     { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  card:       { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "22px 24px" },
  cardTitle:  { fontWeight: 700, fontSize: "17px", color: "#0f172a", margin: "0 0 18px" },
  formGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" },
  formFull:   { gridColumn: "1 / -1" },
  label:      { display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "5px" },
  input:      { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "7px", fontSize: "13.5px", outline: "none", fontFamily: "inherit", color: "#1e293b", background: "#fff" },
  payBtn:     { width: "100%", background: "#059669", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontWeight: 700, fontSize: "15px" },
  secureNote: { textAlign: "center", fontSize: "11.5px", color: "#94a3b8", marginTop: "10px" },
  errorBox:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#b91c1c", fontSize: "13.5px" },
  orderItem:  { display: "flex", gap: "12px", alignItems: "center" },
  orderThumb: { width: "48px", height: "48px", borderRadius: "7px", objectFit: "cover" },
  orderName:  { fontWeight: 600, fontSize: "13px", color: "#0f172a", margin: "0 0 2px" },
  orderMeta:  { fontSize: "11.5px", color: "#64748b", margin: 0 },
  orderPrice: { fontWeight: 700, fontSize: "13.5px", color: "#0f172a", flexShrink: 0 },
  divider:    { borderTop: "1px solid #f1f5f9", margin: "14px 0" },
  loyaltyNote:{ marginTop: "12px", background: "#eff6ff", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#1d4ed8", textAlign: "center" },
  center:     { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" },
};

export default Checkout;
