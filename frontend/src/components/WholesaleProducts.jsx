import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdditionalSection.css";
import ProductCard from "./ProductCard";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const WholesaleProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE}/api/products/`)
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("Error fetching wholesale products:", error)
      );
  }, []);

  return (
    <div className="additional-section">
      <h3 className="section-title">Wholesale Products</h3>
      <div className="additional-grid">
        {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a href="/shop" className="shop-now">
        Shop now
      </a>
    </div>
  );
};

export default WholesaleProducts;
