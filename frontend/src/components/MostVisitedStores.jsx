import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopCard from "./ShopCard";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MostVisitedStores = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE}/api/shops/?ordering=-visit_count`)
      .then(res => setShops(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (shops.length === 0) return null;

  return (
    <section style={{ padding: "48px 0", background: "white" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#3b7bf8", fontWeight: 600, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 6px" }}>
            Trending
          </p>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(22px, 3vw, 30px)", margin: 0, color: "#111827" }}>
            Most Visited Stores
          </h2>
          <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: "14px" }}>
            The sellers visitors keep coming back to
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}>
          {shops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button
            onClick={() => navigate("/browse")}
            style={{
              padding: "10px 32px",
              borderRadius: "8px",
              border: "2px solid #3b7bf8",
              background: "transparent",
              color: "#3b7bf8",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#3b7bf8"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3b7bf8"; }}
          >
            Show More
          </button>
        </div>
      </div>
    </section>
  );
};

export default MostVisitedStores;
