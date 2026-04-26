import React, { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "./ShopCard";

const MostVisitedStores = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/shops/?ordering=-visit_count")
      .then(res => setShops(res.data.slice(0, 6)))
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
      </div>
    </section>
  );
};

export default MostVisitedStores;
