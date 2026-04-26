import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  useSellerCtx, ac, BASE,
  IconProducts, IconPlus, IconEdit, IconTrash, IconEye, IconStar,
} from "../components/SellerLayout";

const fmtNGN = (n) =>
  parseFloat(n || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const SellerProducts = () => {
  const { setPageTitle, setTopbarActions } = useSellerCtx();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Products");
    setTopbarActions(
      <button className="sd-btn-primary" onClick={() => navigate("/add-product")}>
        <IconPlus /> Add Product
      </button>
    );
    return () => setTopbarActions(null);
  }, []);

  useEffect(() => {
    axios.get(`${BASE}/api/owner-products/`, ac())
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    await axios.delete(`${BASE}/api/owner-products/${id}/`, ac());
    setProducts(p => p.filter(x => x.id !== id));
  };

  const handleToggleFeatured = async (p) => {
    try {
      const fd = new FormData();
      fd.append("is_featured", !p.is_featured);
      await axios.patch(`${BASE}/api/owner-products/${p.id}/`, fd, ac());
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_featured: !p.is_featured } : x));
    } catch {}
  };

  if (loading) return (
    <div className="sd-loading" style={{ height: "200px" }}>
      <div className="spinner-border" style={{ color: "#2563eb", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (products.length === 0) return (
    <div className="sd-card">
      <div className="sd-empty">
        <div className="sd-empty-icon"><IconProducts /></div>
        <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No products yet</h4>
        <p style={{ color: "#64748b", fontSize: "13.5px", marginBottom: "16px" }}>
          Add your first product to start getting discovered by buyers.
        </p>
        <button className="sd-btn-primary" onClick={() => navigate("/add-product")}>
          <IconPlus /> Add Your First Product
        </button>
      </div>
    </div>
  );

  return (
    <div className="sd-table-wrap">
      <table className="sd-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={p.main_image_url || "/OIP.png"}
                    alt={p.name}
                    className="sd-table-thumb"
                    onError={e => { e.target.src = "/OIP.png"; }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", maxWidth: "180px",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "1px" }}>
                      ID #{p.id}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontSize: "13px", color: "#475569" }}>{p.category}</span>
              </td>
              <td>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{fmtNGN(p.price)}</span>
              </td>
              <td>
                <span style={{ fontSize: "13px", color: p.quantity > 0 ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  {p.quantity}
                </span>
              </td>
              <td>
                <span className={`sd-pill ${p.is_active ? "green" : "red"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleToggleFeatured(p)}
                  title={p.is_featured ? "Remove from featured" : "Mark as featured"}
                  style={{
                    background: p.is_featured ? "#fef3c7" : "#f8fafc",
                    border: `1.5px solid ${p.is_featured ? "#f59e0b" : "#e2e8f0"}`,
                    color: p.is_featured ? "#b45309" : "#94a3b8",
                    borderRadius: "8px", padding: "5px 10px",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px",
                    fontWeight: 600, fontSize: "12px", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.color = "#b45309"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = p.is_featured ? "#f59e0b" : "#e2e8f0";
                    e.currentTarget.style.color = p.is_featured ? "#b45309" : "#94a3b8";
                  }}
                >
                  <IconStar filled={p.is_featured} />
                  {p.is_featured ? "Pinned" : "Pin"}
                </button>
              </td>
              <td>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button className="sd-action-btn view" onClick={() => navigate(`/product/${p.id}`)}>
                    <IconEye /> View
                  </button>
                  <button className="sd-action-btn edit" onClick={() => navigate(`/edit-product/${p.id}`)}>
                    <IconEdit /> Edit
                  </button>
                  <button className="sd-action-btn del" onClick={() => handleDelete(p.id)}>
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerProducts;
