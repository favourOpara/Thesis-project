import React, { useState } from "react";
import axios from "axios";

const InquiryModal = ({ show, onClose, shop, product = null }) => {
  const [form, setForm] = useState({ visitor_name: "", visitor_email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        shop: shop.id,
        visitor_name: form.visitor_name,
        visitor_email: form.visitor_email,
        message: form.message,
      };
      if (product) payload.product = product.id;

      await axios.post("http://localhost:8000/api/inquiries/", payload);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ visitor_name: "", visitor_email: "", message: "" });
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "white", borderRadius: "12px",
          padding: "32px", width: "100%", maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Inquiry Sent!</h5>
            <p style={{ color: "#6c757d", marginBottom: "24px" }}>
              {shop.name} will get back to you at <strong>{form.visitor_email}</strong>.
            </p>
            <button
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#3b7bf8", border: "none", borderRadius: "8px", padding: "10px" }}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h5 style={{ fontWeight: 700, margin: 0 }}>
                  {product ? `Inquire about "${product.name}"` : `Contact ${shop.name}`}
                </h5>
                <small style={{ color: "#6c757d" }}>
                  {product ? `Sold by ${shop.name}` : "Send a message to this seller"}
                </small>
              </div>
              <button
                onClick={handleClose}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6c757d", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ borderRadius: "8px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", display: "block" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="visitor_name"
                  className="form-control"
                  placeholder="John Doe"
                  value={form.visitor_name}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", display: "block" }}>
                  Your Email
                </label>
                <input
                  type="email"
                  name="visitor_email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.visitor_email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontWeight: 600, fontSize: "14px", marginBottom: "6px", display: "block" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  className="form-control"
                  placeholder={product ? `Hi, I'm interested in "${product.name}". Could you tell me more about...` : "Hi, I'd like to know more about your shop..."}
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{ borderRadius: "8px", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                disabled={submitting}
                style={{
                  backgroundColor: "#3b7bf8", color: "white",
                  border: "none", borderRadius: "8px", padding: "12px",
                  fontWeight: 600, fontSize: "15px",
                }}
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
