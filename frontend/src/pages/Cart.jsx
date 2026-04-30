import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const CartPage = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(null);

  const handleQty = async (itemId, newQty, maxQty) => {
    if (newQty < 1 || newQty > maxQty) return;
    setBusy(itemId);
    try { await updateItem(itemId, newQty); } finally { setBusy(null); }
  };

  const handleRemove = async (itemId) => {
    setBusy(itemId);
    try { await removeItem(itemId); } finally { setBusy(null); }
  };

  /* ── Loading ── */
  if (loading) return (
    <>
      <Header />
      <div className="cart-page" style={{ paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="spinner-border" style={{ color: "#f97316" }} />
      </div>
      <Footer />
    </>
  );

  const { items = [], total = 0, item_count = 0 } = cart;

  return (
    <>
      <Header />
      <div className="cart-page" style={{ paddingTop: "80px" }}>
        <div className="cart-container">

          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d5d9d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <h3 style={{ fontWeight: 700, fontSize: "20px", color: "#0f172a", margin: "0 0 8px" }}>Your cart is empty</h3>
              <p style={{ color: "#565959", fontSize: "14px", margin: "0 0 20px" }}>Browse our marketplace and add items you love.</p>
              <button onClick={() => navigate(-1)} style={{ background: "#f97316", color: "#fff", borderRadius: "20px", padding: "9px 28px", fontWeight: 600, fontSize: "14px", border: "1px solid #e07b0d", cursor: "pointer" }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-columns">

              {/* ── Left: items ── */}
              <div className="cart-items-panel">
                <div className="cart-panel-header">
                  <h1 className="cart-panel-title">Shopping Cart</h1>
                  <span className="cart-price-col-label">Price</span>
                </div>

                {items.map((item) => (
                  <div key={item.id} className={`cart-item-row${!item.in_stock ? " oos" : ""}`}>

                    {/* Image */}
                    <Link to={`/product/${item.product}`} className="cart-item-img-wrap">
                      <img
                        src={item.main_image_url || "/OIP.png"}
                        alt={item.product_name}
                        className="cart-item-img"
                        onError={e => { e.target.src = "/OIP.png"; }}
                      />
                    </Link>

                    {/* Body */}
                    <div className="cart-item-body">
                      <Link to={`/product/${item.product}`} className="cart-item-name">
                        {item.product_name}
                      </Link>

                      {item.shop_name && (
                        <Link to={`/shop/${item.shop_slug}`} className="cart-item-store">
                          Sold by <span>{item.shop_name}</span>
                        </Link>
                      )}

                      {item.in_stock
                        ? <span className="cart-in-stock">In Stock</span>
                        : <span className="cart-out-stock">Currently unavailable</span>
                      }

                      {/* Controls */}
                      <div className="cart-controls">
                        <div className="cart-qty-box">
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleQty(item.id, item.quantity - 1, item.max_qty)}
                            disabled={busy === item.id || item.quantity <= 1}
                          >−</button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleQty(item.id, item.quantity + 1, item.max_qty)}
                            disabled={busy === item.id || item.quantity >= item.max_qty}
                          >+</button>
                        </div>

                        <span className="cart-ctrl-sep">|</span>
                        <button
                          className="cart-txt-btn red"
                          onClick={() => handleRemove(item.id)}
                          disabled={busy === item.id}
                        >
                          Delete
                        </button>
                        <span className="cart-ctrl-sep">|</span>
                        <Link to={`/product/${item.product}`} className="cart-txt-btn" style={{ textDecoration: "none" }}>
                          View item
                        </Link>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="cart-item-price-col">
                      <span className="cart-item-price">{fmtNGN(item.subtotal)}</span>
                    </div>
                  </div>
                ))}

                {/* Bottom subtotal bar */}
                <div style={{ padding: "14px 22px", borderTop: "1px solid #e8ecee", background: "#fafafa", borderRadius: "0 0 6px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <button
                    onClick={() => navigate(-1)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13.5px", color: "#2563eb", fontWeight: 500, padding: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Continue Shopping
                  </button>
                  <span style={{ fontSize: "17px", fontWeight: 400, color: "#0f172a" }}>
                    Subtotal ({item_count} {item_count === 1 ? "item" : "items"}):&nbsp;
                    <strong style={{ fontWeight: 700 }}>{fmtNGN(total)}</strong>
                  </span>
                </div>
              </div>

              {/* ── Right: summary ── */}
              <div className="cart-summary-box">
                <p className="cart-subtotal">
                  Subtotal ({item_count} {item_count === 1 ? "item" : "items"}):<br />
                  <strong>{fmtNGN(total)}</strong>
                </p>

                {user?.loyalty_points > 0 && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", color: "#92400e", fontWeight: 600, marginBottom: "12px" }}>
                    🎁 {user.loyalty_points.toLocaleString()} loyalty points available
                  </div>
                )}

                <button
                  className="cart-checkout-btn"
                  onClick={() => {
                    if (!user) {
                      navigate("/signin", { state: { next: "/checkout" } });
                    } else {
                      navigate("/checkout");
                    }
                  }}
                  disabled={items.every(i => !i.in_stock)}
                >
                  Proceed to Checkout
                </button>

                <p className="cart-secure">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Secure checkout · Powered by Paystack
                </p>

                <hr className="cart-summary-divider" />

                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: "#007600", fontWeight: 600 }}>Calculated at checkout</span>
                </div>
                <div className="cart-summary-row" style={{ fontWeight: 700, fontSize: "14px" }}>
                  <span>Order Total</span>
                  <span>{fmtNGN(total)}</span>
                </div>

                <button onClick={() => navigate(-1)} className="cart-continue" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Continue shopping</button>
              </div>

            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
