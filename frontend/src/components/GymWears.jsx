import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSection.css";
import ProductCard from "./ProductCard";

const GymWears = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="product-section">
      <h3 className="section-title">Gym Wears</h3>
      <div className="product-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default GymWears;
