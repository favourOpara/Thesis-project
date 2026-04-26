import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductCard = ({ product }) => {
  const productImage =
    product.main_image_url ||
    (product.images?.length > 0 ? product.images[0].image_url : "/OIP.png");

  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{ textDecoration: "none", color: "inherit" }}>
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
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    main_image_url: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({ image_url: PropTypes.string })
    ),
  }).isRequired,
};

export default ProductCard;
