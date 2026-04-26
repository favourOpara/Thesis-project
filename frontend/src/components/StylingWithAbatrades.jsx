import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSection.css";
import ProductCard from "./ProductCard";

const StylingWithAbatrades = () => {
  const [outfitData, setOutfitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use environment variable or default to production
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    axios
      .get(`${baseURL}/api/recommendations/styling-outfit/`)
      .then((response) => {
        setOutfitData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching outfit:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="product-section">
        <h3 className="section-title">Styling With Abatrades</h3>
        <p>Loading...</p>
      </div>
    );
  }

  // Check if we have an outfit bundle or fallback products
  const products = outfitData?.outfit_bundle?.products || outfitData?.products || [];
  const themeName = outfitData?.outfit_bundle?.theme_display || "Styling With Abatrades";
  const outfitName = outfitData?.outfit_bundle?.name;

  return (
    <div className="product-section outfit-bundle-section">
      <div className="section-header">
        <h3 className="section-title">Styling With Abatrades</h3>
        {outfitName && (
          <p className="outfit-theme">
            <span className="theme-badge">{themeName}</span>
            <span className="outfit-name">{outfitName}</span>
          </p>
        )}
      </div>
      <div className="product-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default StylingWithAbatrades;
