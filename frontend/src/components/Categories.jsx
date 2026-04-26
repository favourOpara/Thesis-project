import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css";

const categoryOptions = [
  { value: "Clothing materials",             label: "Clothing",        icon: "👕", color: "#eff6ff" },
  { value: "Body accessories",               label: "Accessories",     icon: "👜", color: "#fdf4ff" },
  { value: "Household items",                label: "Household",       icon: "🏠", color: "#f0fdf4" },
  { value: "Sports and fitness",             label: "Sports",          icon: "⚽", color: "#fff7ed" },
  { value: "Gym and workout equipment",      label: "Gym & Workout",   icon: "🏋️", color: "#fef9c3" },
  { value: "Electronics and appliances",     label: "Electronics",     icon: "💻", color: "#eff6ff" },
  { value: "agriculture, food, and groceries", label: "Food & Agric",  icon: "🌾", color: "#f0fdf4" },
  { value: "Cosmetic and beauty products",   label: "Beauty",          icon: "💄", color: "#fdf2f8" },
  { value: "Arts and craft",                 label: "Arts & Crafts",   icon: "🎨", color: "#fdf4ff" },
  { value: "Furniture and home decor",       label: "Furniture",       icon: "🛋️", color: "#fff7ed" },
  { value: "Electronics and appliances",     label: "Appliances",      icon: "📱", color: "#eff6ff" },
  { value: "Jewelry and watches",            label: "Jewelry",         icon: "💎", color: "#fdf2f8" },
  { value: "Health and medical",             label: "Health",          icon: "🏥", color: "#f0fdf4" },
  { value: "Books and media",                label: "Books & Media",   icon: "📚", color: "#fefce8" },
  { value: "Toys and children products",     label: "Toys & Kids",     icon: "🧸", color: "#fff7ed" },
  { value: "Food and beverages",             label: "Food & Drinks",   icon: "🍽️", color: "#f0fdf4" },
  { value: "Building materials",             label: "Building",        icon: "🏗️", color: "#f8fafc" },
  { value: "Autoparts and accessories",      label: "Autoparts",       icon: "🚗", color: "#f8fafc" },
  { value: "Services",                       label: "Services",        icon: "🔧", color: "#eff6ff" },
  { value: "Pets and animals",               label: "Pets",            icon: "🐶", color: "#fdf4ff" },
];

const Categories = () => (
  <section style={{ padding: "48px 0", background: "#f8faff" }}>
    <div className="container" style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "#3b7bf8", fontWeight: 600, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 6px" }}>
          What are you looking for?
        </p>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(22px, 3vw, 30px)", margin: 0, color: "#111827" }}>
          Browse by Category
        </h2>
      </div>

      <div className="categories-grid">
        {categoryOptions.map((cat, i) => (
          <Link
            key={i}
            to={`/category/${encodeURIComponent(cat.value)}`}
            className="category-card"
            style={{ "--cat-bg": cat.color }}
          >
            <div className="category-icon">{cat.icon}</div>
            <p className="category-name">{cat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
