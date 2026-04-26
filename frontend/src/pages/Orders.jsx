import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const STATUS_COLORS = {
  pending:    { bg: "#fef9c3", color: "#854d0e" },
  paid:       { bg: "#dcfce7", color: "#15803d" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped:    { bg: "#e0e7ff", color: "#4338ca" },
  delivered:  { bg: "#f0fdf4", color: "#166534" },
  cancelled:  { bg: "#fee2e2", color: "#b91c1c" },
  refunded:   { bg: "#f1f5f9", color: "#475569" },
};

const Orders = () => {
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  // Verify payment if redirected back from Paystack
  useEffect(() => {
    if (ref) {
      axios.get(`${BASE}/api/orders/verify/${ref}/`, { withCredentials: true })
        .then(() => fetchCart())
        .catch(() => {});
    }
  }, [ref]);

  useEffect(() => {
    if (!user) return;
    axios.get(`${BASE}/api/orders/my/`, { withCredentials: true })
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <>
      <Header />
      <div style={styles.center}>
        <h3>Please <Link to="/signin">sign in</Link> to view your orders.</h3>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>My Orders</h1>

          {loading ? (
            <div style={styles.center}>
              <div className="spinner-border" style={{ color: "#2563eb" }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "48px", margin: 0 }}>📦</p>
              <h3 style={styles.emptyTitle}>No orders yet</h3>
              <p style={{ color: "#64748b" }}>Your purchased items will appear here.</p>
              <Link to="/" style={styles.ctaBtn}>Start Shopping</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orders.map((order) => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                return (
                  <div key={order.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div>
                        <span style={styles.orderId}>Order #{order.id}</span>
                        <span style={{ ...styles.statusPill, background: sc.bg, color: sc.color }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div style={styles.headerRight}>
                        <span style={styles.date}>
                          {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        <span style={styles.totalBadge}>{fmtNGN(order.total_amount)}</span>
                      </div>
                    </div>

                    <div style={styles.itemList}>
                      {order.items.map((item) => (
                        <div key={item.id} style={styles.itemRow}>
                          <span style={styles.itemName}>{item.product_name}</span>
                          <span style={styles.itemQty}>× {item.quantity}</span>
                          <span style={styles.itemPrice}>{fmtNGN(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={styles.cardFooter}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        Ref: {order.payment_ref}
                      </span>
                      {order.points_earned > 0 && (
                        <span style={styles.pointsBadge}>
                          +{order.points_earned} loyalty points earned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  page:        { background: "#f1f5f9", minHeight: "100vh", padding: "32px 0 64px" },
  container:   { maxWidth: "800px", margin: "0 auto", padding: "0 20px" },
  title:       { fontWeight: 800, fontSize: "24px", color: "#0f172a", marginBottom: "24px" },
  center:      { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "12px", flexDirection: "column" },
  empty:       { textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  emptyTitle:  { fontWeight: 700, fontSize: "20px", color: "#0f172a", margin: 0 },
  ctaBtn:      { background: "#2563eb", color: "#fff", borderRadius: "9px", padding: "10px 24px", fontWeight: 700, fontSize: "14px", textDecoration: "none" },
  card:        { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" },
  cardHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: "8px" },
  orderId:     { fontWeight: 700, color: "#0f172a", fontSize: "14px", marginRight: "10px" },
  statusPill:  { borderRadius: "999px", padding: "2px 10px", fontSize: "12px", fontWeight: 600 },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  date:        { fontSize: "12.5px", color: "#94a3b8" },
  totalBadge:  { fontWeight: 800, color: "#2563eb", fontSize: "15px" },
  itemList:    { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" },
  itemRow:     { display: "flex", alignItems: "center", gap: "12px", fontSize: "13.5px" },
  itemName:    { flex: 1, color: "#374151", fontWeight: 500 },
  itemQty:     { color: "#94a3b8", fontWeight: 600 },
  itemPrice:   { color: "#0f172a", fontWeight: 700, flexShrink: 0 },
  cardFooter:  { padding: "10px 18px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  pointsBadge: { background: "#eff6ff", color: "#1d4ed8", borderRadius: "999px", padding: "2px 10px", fontSize: "12px", fontWeight: 600 },
};

export default Orders;
