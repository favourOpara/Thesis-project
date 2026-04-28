import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopCard from "../components/ShopCard";
import "./CategoryPage.css";

const CATEGORIES = [
  { value: "Clothing materials", label: "Clothing materials", icon: "👕" },
  { value: "Body accessories", label: "Body accessories", icon: "👜" },
  { value: "Household items", label: "Household items", icon: "🏠" },
  { value: "Sports and fitness", label: "Sports & Fitness", icon: "⚽" },
  { value: "Gym and workout equipment", label: "Gym & Workout", icon: "🏋️" },
  { value: "Electronics and appliances", label: "Electronics", icon: "💻" },
  { value: "agriculture, food, and groceries", label: "Agriculture & Food", icon: "🌾" },
  { value: "Cosmetic and beauty products", label: "Beauty & Health", icon: "💄" },
  { value: "Arts and craft", label: "Arts & Crafts", icon: "🎨" },
  { value: "Stationery", label: "Stationery", icon: "✏️" },
  { value: "Furniture and home decor", label: "Furniture & Decor", icon: "🛋️" },
  { value: "Autoparts and accessories", label: "Autoparts", icon: "🚗" },
  { value: "Building materials", label: "Building Materials", icon: "🏗️" },
  { value: "Toys and children products", label: "Toys & Kids", icon: "🧸" },
  { value: "Books and media", label: "Books & Media", icon: "📚" },
  { value: "Health and medical", label: "Health & Medical", icon: "🏥" },
  { value: "Travel and luggage", label: "Travel & Luggage", icon: "🧳" },
  { value: "Musical instruments", label: "Musical Instruments", icon: "🎵" },
  { value: "Jewelry and watches", label: "Jewelry & Watches", icon: "💎" },
  { value: "Photography and cameras", label: "Photography & Cameras", icon: "📷" },
  { value: "Garden and outdoor", label: "Garden & Outdoor", icon: "🌱" },
  { value: "Services", label: "Services", icon: "🔧" },
  { value: "Office and business", label: "Office & Business", icon: "💼" },
  { value: "Baby and maternity", label: "Baby & Maternity", icon: "👶" },
  { value: "Food and beverages", label: "Food & Beverages", icon: "🍽️" },
  { value: "Party and events", label: "Party & Events", icon: "🎉" },
  { value: "Antiques and collectibles", label: "Antiques & Collectibles", icon: "🏺" },
  { value: "Religious and spiritual", label: "Religious & Spiritual", icon: "🕊️" },
  { value: "Pets and animals", label: "Pets & Animals", icon: "🐶" },
  { value: "Miscellaneous", label: "Miscellaneous", icon: "📦" },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const decoded = decodeURIComponent(categoryName);
  const category = CATEGORIES.find((c) => c.value === decoded);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/api/shops/?category=${encodeURIComponent(decoded)}`)
      .then((res) => setShops(res.data))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [decoded]);

  return (
    <>
      <Header />
      <div style={{ paddingTop: "90px", minHeight: "100vh", background: "#f8f9fa" }}>
        <div className="container" style={{ maxWidth: "1200px", padding: "32px 16px" }}>

          {/* Breadcrumb */}
          <nav style={{ marginBottom: "24px", fontSize: "14px", color: "#6c757d" }}>
            <span
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", color: "#3b7bf8" }}
            >
              Home
            </span>
            <span style={{ margin: "0 8px" }}>›</span>
            <span>{category?.label || decoded}</span>
          </nav>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {category?.icon && (
                <span style={{ fontSize: "36px" }}>{category.icon}</span>
              )}
              <div>
                <h1 style={{ fontWeight: 800, margin: 0, fontSize: "28px" }}>
                  {category?.label || decoded}
                </h1>
                <p style={{ color: "#6c757d", margin: "4px 0 0", fontSize: "14px" }}>
                  {loading ? "Loading..." : `${shops.length} seller${shops.length !== 1 ? "s" : ""} in this category`}
                </p>
              </div>
            </div>
          </div>

          {/* Shops grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
              Loading sellers...
            </div>
          ) : shops.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h4 style={{ fontWeight: 700 }}>No sellers in this category yet</h4>
              <p style={{ color: "#6c757d", marginBottom: "24px" }}>
                Be the first to sell in <strong>{category?.label || decoded}</strong>!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/")}
                >
                  Browse All Sellers
                </button>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#3b7bf8", border: "none" }}
                  onClick={() => navigate("/signup")}
                >
                  Become a Seller
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
