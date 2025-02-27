import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css"; // Import the CSS file

// Define the category data (same as provided in the second image)
const categoryOptions = [
  { value: "Clothing materials", label: "Clothing materials", icon: "👕" },
  { value: "Body accessories", label: "Body accessories", icon: "👜" },
  { value: "Household items", label: "Household items", icon: "🏠" },
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
  { value: "Miscellaneous", label: "Miscellaneous", icon: "📦" },
  { value: "Animal pets", label: "Animal Pets", icon: "🐶" },
  { value: "Adult", label: "Adult", icon: "🔞" },
];

const Categories = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Categories</h2>
      <div className="categories-grid">
        {categoryOptions.map((category, index) => (
          <Link key={index} to="/coming-soon" className="category-card">
            <div className="category-icon">{category.icon}</div>
            <p className="category-name">{category.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
