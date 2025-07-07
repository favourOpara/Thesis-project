import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSection.css";
import ProductCard from "./ProductCard";

const BuildwithAbatrades = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("inspiring-spontaneity-production.up.railway.app/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching BuildwithAbatrades:", err));
  }, []);

  return (
    <div className="product-section">
      <h3 className="section-title">Build with Abatrades</h3>
      <div className="product-grid">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default BuildwithAbatrades;
