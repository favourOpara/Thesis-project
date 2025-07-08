import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdditionalSection.css";
import ProductCard from "./ProductCard";

const MostVisitedStores = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("Error fetching most visited stores:", error)
      );
  }, []);

  return (
    <div className="additional-section">
      <h3 className="section-title">Most Visited Stores</h3>
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

export default MostVisitedStores;
