import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import "./ProductList.css";

const ProductCard = ({ product }) => {
  const { showNotification } = useContext(NotificationContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showNotification("Added to cart");
  };

  // Check if the product has images, fallback to default
  const productImage =
    product.main_image_url ||
    (product.images && product.images.length > 0 ? product.images[0].image_url : "/OIP.png");
  console.log("Product Image URL:", productImage);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-details">
        <div className="product-card-image">
          <img
            src={productImage}
            alt={product.name}
            onError={(e) => { e.target.src = "/OIP.png"; }}
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
      <button type="button" className="badge badge-danger" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
