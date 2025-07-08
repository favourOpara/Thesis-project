import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSection.css";
import ProductCard from "./ProductCard";

const SleepwithAbatrades = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://inspiring-spontaneity-production.up.railway.app/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching SleepwithAbatrades:", err));
  }, []);

  return (
    <div className="product-section">
      <h3 className="section-title">Sleep with Abatrades</h3>
      <div className="product-grid">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default SleepwithAbatrades;
