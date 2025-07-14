import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css"; // Import the CSS file

// Define the complete category data with all the expanded categories
const categoryOptions = [
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
  { value: "Adult", label: "Adult", icon: "🔞" },
];

const Categories = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Categories</h2>
      <div className="categories-grid">
        {categoryOptions.map((category, index) => (
          <Link 
            key={index} 
            to={`/category/${encodeURIComponent(category.value)}`} 
            className="category-card"
          >
            <div className="category-icon">{category.icon}</div>
            <p className="category-name">{category.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;