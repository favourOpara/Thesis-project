import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const CartPage = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [busy, setBusy]   = useState(null); // item id being updated

  if (!user) {
    return (
      <>
        <Header />
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🛒</div>
          <h3 style={styles.emptyTitle}>Sign in to view your cart</h3>
          <p style={styles.emptyText}>Your cart is saved to your account.</p>
          <Link to="/signin" style={styles.ctaBtn}>Sign In</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleQty = async (itemId, newQty, maxQty) => {
    if (newQty < 1 || newQty > maxQty) return;
    setBusy(itemId);
    try { await updateItem(itemId, newQty); } finally { setBusy(null); }
  };

  const handleRemove = async (itemId) => {
    setBusy(itemId);
    try { await removeItem(itemId); } finally { setBusy(null); }
  };

  if (loading) return (
    <>
      <Header />
      <div style={{ ...styles.empty, gap: 0 }}>
        <div className="spinner-border" style={{ color: "#2563eb" }} />
      </div>
      <Footer />
    </>
  );

  const { items = [], total = 0, item_count = 0 } = cart;

  return (
    <>
      <Header />
      <div style={styles.page}>
        <div style={styles.container}>

          {/* Header row */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>
              Shopping Cart
              {item_count > 0 && <span style={styles.countBadge}>{item_count}</span>}
            </h1>
            <Link to="/" style={styles.continueLink}>← Continue Shopping</Link>
          </div>

          {items.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🛒</div>
              <h3 style={styles.emptyTitle}>Your cart is empty</h3>
              <p style={styles.emptyText}>Browse our marketplace and add items you love.</p>
              <Link to="/" style={styles.ctaBtn}>Start Shopping</Link>
            </div>
          ) : (
            <div style={styles.layout}>
              {/* Items */}
              <div style={styles.itemsCol}>
                {items.map((item) => (
                  <div key={item.id} style={styles.itemCard}>
                    <Link to={`/product/${item.product}`}>
                      <img
                        src={item.main_image_url || "/OIP.png"}
                        alt={item.product_name}
                        style={styles.thumb}
                        onError={(e) => { e.target.src = "/OIP.png"; }}
                      />
                    </Link>
                    <div style={styles.itemInfo}>
                      <Link to={`/product/${item.product}`} style={{ textDecoration: "none" }}>
                        <p style={styles.itemName}>{item.product_name}</p>
                      </Link>
                      {item.shop_name && (
                        <Link to={`/shop/${item.shop_slug}`} style={styles.shopLink}>
                          {item.shop_name}
                        </Link>
                      )}
                      <p style={styles.unitPrice}>{fmtNGN(item.product_price)} each</p>
                      {!item.in_stock && (
                        <span style={styles.oosTag}>Out of Stock</span>
                      )}
                    </div>

                    {/* Qty + subtotal */}
                    <div style={styles.itemRight}>
                      <div style={styles.qtyRow}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => handleQty(item.id, item.quantity - 1, item.max_qty)}
                          disabled={busy === item.id || item.quantity <= 1}
                        >−</button>
                        <span style={styles.qtyVal}>{item.quantity}</span>
                        <button
                          style={styles.qtyBtn}
                          onClick={() => handleQty(item.id, item.quantity + 1, item.max_qty)}
                          disabled={busy === item.id || item.quantity >= item.max_qty}
                        >+</button>
                      </div>
                      <p style={styles.subtotal}>{fmtNGN(item.subtotal)}</p>
                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(item.id)}
                        disabled={busy === item.id}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div style={styles.summaryCol}>
                <div style={styles.summaryCard}>
                  <h3 style={styles.summaryTitle}>Order Summary</h3>

                  <div style={styles.summaryRow}>
                    <span>Subtotal ({item_count} items)</span>
                    <span>{fmtNGN(total)}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Shipping</span>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>Calculated at checkout</span>
                  </div>

                  <div style={styles.summaryDivider} />

                  <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: "16px" }}>
                    <span>Total</span>
                    <span style={{ color: "#2563eb" }}>{fmtNGN(total)}</span>
                  </div>

                  {user?.loyalty_points > 0 && (
                    <div style={styles.loyaltyBadge}>
                      You have {user.loyalty_points.toLocaleString()} loyalty points
                    </div>
                  )}

                  <button
                    style={styles.checkoutBtn}
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout →
                  </button>
                  <p style={styles.secureNote}>🔒 Secure checkout powered by Paystack</p>
                </div>
              </div>
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
  container:   { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  pageHeader:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" },
  pageTitle:   { fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "10px" },
  countBadge:  { background: "#2563eb", color: "#fff", borderRadius: "999px", padding: "2px 10px", fontSize: "13px", fontWeight: 700 },
  continueLink:{ fontSize: "13.5px", color: "#2563eb", textDecoration: "none", fontWeight: 600 },
  layout:      { display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" },
  itemsCol:    { display: "flex", flexDirection: "column", gap: "12px" },
  itemCard:    { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px", display: "flex", gap: "16px", alignItems: "flex-start" },
  thumb:       { width: "90px", height: "90px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 },
  itemInfo:    { flex: 1, minWidth: 0 },
  itemName:    { fontWeight: 700, fontSize: "14px", color: "#0f172a", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  shopLink:    { fontSize: "12px", color: "#2563eb", textDecoration: "none", display: "block", marginBottom: "4px" },
  unitPrice:   { fontSize: "13px", color: "#64748b", margin: "0 0 4px" },
  oosTag:      { display: "inline-block", background: "#fee2e2", color: "#b91c1c", borderRadius: "999px", padding: "1px 8px", fontSize: "11px", fontWeight: 600 },
  itemRight:   { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 },
  qtyRow:      { display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "4px 8px" },
  qtyBtn:      { border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: "16px", color: "#374151", padding: "0 4px", lineHeight: 1 },
  qtyVal:      { fontWeight: 700, fontSize: "15px", color: "#0f172a", minWidth: "24px", textAlign: "center" },
  subtotal:    { fontWeight: 700, fontSize: "15px", color: "#0f172a", margin: 0 },
  removeBtn:   { border: "none", background: "none", color: "#ef4444", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", padding: 0 },
  summaryCol:  { position: "sticky", top: "80px" },
  summaryCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px 22px" },
  summaryTitle:{ fontWeight: 800, fontSize: "17px", color: "#0f172a", margin: "0 0 16px" },
  summaryRow:  { display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#374151", marginBottom: "10px" },
  summaryDivider: { borderTop: "1px solid #f1f5f9", margin: "14px 0" },
  loyaltyBadge:{ background: "#eff6ff", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#1d4ed8", fontWeight: 600, marginBottom: "14px", textAlign: "center" },
  checkoutBtn: { width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", padding: "13px", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "6px" },
  secureNote:  { textAlign: "center", fontSize: "11.5px", color: "#94a3b8", margin: "10px 0 0" },
  empty:       { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", textAlign: "center" },
  emptyIcon:   { fontSize: "56px" },
  emptyTitle:  { fontWeight: 700, fontSize: "22px", color: "#0f172a", margin: 0 },
  emptyText:   { color: "#64748b", fontSize: "14px", margin: 0 },
  ctaBtn:      { background: "#2563eb", color: "#fff", borderRadius: "9px", padding: "11px 28px", fontWeight: 700, fontSize: "14px", textDecoration: "none", display: "inline-block", marginTop: "8px" },
};

export default CartPage;
