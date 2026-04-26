import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSellerCtx, ac, BASE, fmtDate, fmtNGN, IconOrders } from "../components/SellerLayout";

const STATUS_OPTS = ["processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending:    { bg: "#fef9c3", color: "#854d0e" },
  paid:       { bg: "#dcfce7", color: "#15803d" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped:    { bg: "#e0e7ff", color: "#4338ca" },
  delivered:  { bg: "#f0fdf4", color: "#166534" },
  cancelled:  { bg: "#fee2e2", color: "#b91c1c" },
};

const SellerOrders = () => {
  const { setPageTitle, setTopbarActions } = useSellerCtx();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Orders");
    setTopbarActions(null);
  }, []);

  const fetchOrders = () => {
    axios.get(`${BASE}/api/orders/seller/`, ac())
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    await axios.patch(
      `${BASE}/api/orders/seller/${orderId}/status/`,
      { status: newStatus },
      ac()
    );
    fetchOrders();
  };

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (orders.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconOrders /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No orders yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>
          Orders from buyers will appear here once your products start selling.
        </p>
      </div>
    </div>
  );

  const revenue = orders.reduce((sum, o) =>
    sum + o.items.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0), 0);

  return (
    <div>
      <div className="sd-card" style={{ marginBottom: "16px" }}>
        <div className="sd-card-body" style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Revenue</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>{fmtNGN(revenue)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Orders</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{orders.length}</div>
          </div>
        </div>
      </div>

      <div className="sd-table-wrap">
        <table className="sd-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const myItems = order.items;
              const myTotal = myItems.reduce((s, i) => s + parseFloat(i.subtotal || 0), 0);
              return (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>#{order.id}</div>
                    <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700 }}>{fmtNGN(myTotal)}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{order.shipping_name}</div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{order.buyer_email}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "12.5px", color: "#374151" }}>
                      {myItems.map(i => `${i.product_name} ×${i.quantity}`).join(", ")}
                    </div>
                  </td>
                  <td style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {fmtDate(order.created_at)}
                  </td>
                  <td>
                    <span className="sd-pill" style={{ background: sc.bg, color: sc.color }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <select
                        style={{
                          fontSize: "12px", border: "1.5px solid #e2e8f0",
                          borderRadius: "6px", padding: "4px 8px",
                          outline: "none", cursor: "pointer", fontFamily: "inherit",
                        }}
                        defaultValue=""
                        onChange={e => { if (e.target.value) updateStatus(order.id, e.target.value); }}
                      >
                        <option value="" disabled>Change…</option>
                        {STATUS_OPTS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
