import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext.jsx";
import { useAddToCartMutation } from "../redux/api/cartApi";
import "./ProductList.css";

const ProductCard = ({ product }) => {
  const { showNotification } = useContext(NotificationContext);
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product).unwrap();
      showNotification("Added to cart");
    } catch (error) {
      showNotification("Failed to add to cart");
    }
  };

  const productImage =
    product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-details">
        <div className="product-card-image">
          <img
            src={productImage}
            alt={product.name}
            onError={(e) => { e.target.src = "/OIP.png"; }}
          />
        </div>
        <h5 className="product-card-title">{product.name}</h5>
        <div className="product-card-pricing">
          <span className="text-success">
            ₦{product.price ? parseFloat(product.price).toLocaleString() : "N/A"}
          </span>
          <span className="line-through text-muted" style={{ marginLeft: "6px" }}>
            <del>
              ₦{product.price ? (parseFloat(product.price) * 1.5).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ""}
            </del>
          </span>
        </div>
      </Link>
      <button className="badge badge-danger" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
