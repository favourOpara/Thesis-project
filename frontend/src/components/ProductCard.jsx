import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import "./ProductSection.css";

const ProductCard = ({ product }) => {
  const { showNotification } = useContext(NotificationContext);

  const handleAddToCart = (e) => {
    // Prevent the click event from bubbling up to the Link
    e.preventDefault();
    e.stopPropagation();
    // Here you can add your logic to add the product to the cart
    showNotification("Added to cart");
  };

  return (
    <div className="product-card">
      {/* Clicking on these details navigates to the product page */}
      <Link to={`/product/${product.id}`} className="product-card-details">
        <div className="product-card-image">
          <img
            src={product.main_image_url || "/default-product.png"} 
            alt={product.name}
            onError={(e) => { e.target.src = "/default-product.png"; }} // Handle broken images
            style={{ transition: "opacity 0.3s ease-in-out" }}
          />
        </div>
        <h5 className="product-card-title">{product.name}</h5>
        <div className="product-card-pricing">
          <span className="text-success">₦{product.price}</span>
          <span className="line-through text-muted">
            <del>₦{(product.price * 1.5).toFixed(2)}</del>
          </span>
        </div>
      </Link>
      {/* Clicking this button adds the product to the cart and shows a notification */}
      <button type="button" className="badge badge-danger" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;