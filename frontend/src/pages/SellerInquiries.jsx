import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSellerCtx, ac, BASE, fmtDate, IconInquiries } from "../components/SellerLayout";

const SellerInquiries = () => {
  const { shop, refreshUnread, setPageTitle, setTopbarActions } = useSellerCtx();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setPageTitle("Inquiries");
    setTopbarActions(null);
  }, []);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    axios.get(`${BASE}/api/inquiries/mine/`, ac())
      .then(r => setInquiries(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shop]);

  const markRead = async (id) => {
    await axios.patch(`${BASE}/api/inquiries/${id}/read/`, {}, ac());
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    refreshUnread();
  };

  if (!shop) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconInquiries /></div>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>Set up your store to start receiving inquiries.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (inquiries.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconInquiries /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No inquiries yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px" }}>
          When buyers send you a message, they'll show up here.
        </p>
      </div>
    </div>
  );

  const unread = inquiries.filter(i => !i.is_read);
  const read   = inquiries.filter(i => i.is_read);

  const InquiryItem = ({ inq }) => (
    <div className={`sd-inq-item${!inq.is_read ? " unread" : ""}`}>
      <div className="sd-inq-meta">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="sd-inq-sender">{inq.visitor_name}</span>
            {!inq.is_read && <span className="sd-pill blue">New</span>}
          </div>
          <div className="sd-inq-email">
            <a href={`mailto:${inq.visitor_email}`} style={{ color: "#64748b", textDecoration: "none" }}>
              {inq.visitor_email}
            </a>
          </div>
          {inq.product_name && (
            <div className="sd-inq-product">Re: {inq.product_name}</div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{fmtDate(inq.created_at)}</div>
          {!inq.is_read && (
            <button
              onClick={() => markRead(inq.id)}
              style={{
                marginTop: "6px", background: "none", border: "1px solid #2563eb",
                color: "#2563eb", borderRadius: "6px", padding: "3px 10px",
                fontSize: "12px", cursor: "pointer", fontWeight: 600,
              }}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
      <div className="sd-inq-body">{inq.message}</div>
    </div>
  );

  return (
    <div>
      {unread.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <p className="sd-section-label">Unread ({unread.length})</p>
          <div className="sd-inq-list">
            {unread.map(i => <InquiryItem key={i.id} inq={i} />)}
          </div>
        </div>
      )}
      {read.length > 0 && (
        <div>
          <p className="sd-section-label">Earlier</p>
          <div className="sd-inq-list">
            {read.map(i => <InquiryItem key={i.id} inq={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInquiries;
