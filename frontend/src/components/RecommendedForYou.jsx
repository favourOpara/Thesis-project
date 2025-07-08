// /src/components/RecommendedForYou.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSection.css";
import ProductCard from "./ProductCard";
import { hasConsentedToCookies } from "../utils/cookieConsent";

const LOCAL_HISTORY_KEY = "viewed_products";
const API_URL = "http://127.0.0.1:8000/api/recommended-for-you/";
const PRODUCT_DETAIL_URL = (id) => `http://127.0.0.1:8000/api/products/${id}/`;

const RecommendedForYou = () => {
  const [products, setProducts] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 1. Authenticated user: backend recommendations
    if (user && user.token) {
      axios
        .get(API_URL, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
          setProducts(response.data.slice(0, 4));
          setIsPersonalized(true);
        })
        .catch(() => {
          setProducts([]);
          setIsPersonalized(false);
        });
      return;
    }

    // 2. Guest user - use history IDs, fetch actual product info from backend
    if (hasConsentedToCookies()) {
      let local = [];
      try {
        local = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY)) || [];
      } catch {
        local = [];
      }
      if (local && local.length > 0) {
        const ids = local.slice(0, 4).map(p => p.id);
        Promise.all(ids.map(id => axios.get(PRODUCT_DETAIL_URL(id)).then(res => res.data)))
          .then((freshProducts) => {
            setProducts(freshProducts);
            setIsPersonalized(true);
          })
          .catch(() => {
            setProducts([]);
            setIsPersonalized(false);
          });
        return;
      }
    }

    // 3. Fallback: generic backend recommendations
    axios
      .get(API_URL)
      .then((response) => {
        setProducts(response.data.slice(0, 4));
        setIsPersonalized(false);
      })
      .catch(() => {
        setProducts([]);
        setIsPersonalized(false);
      });
  }, []);

  return (
    <div className="product-section">
      <h3 className="section-title">
        {isPersonalized ? "Recommended for You" : "Our Top Picks"}
      </h3>
      <div className="product-grid">
        {products.length === 0 && (
          <div style={{ padding: "1rem", color: "#888" }}>
            No recommendations yet.
          </div>
        )}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default RecommendedForYou;
