import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "./Spinner"; // Import the Spinner component
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

const SellerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const navigate = useNavigate();

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    width: "170px",
    backgroundColor: "#007BFF", // Default background color
    color: "#FFF", // Default text color
    transition: "background-color 0.3s, color 0.3s", // Smooth transition
    borderRadius: "15px", // Rounded buttons
  };

  const buttonContainerStyle = { marginTop: "10px", marginLeft: "36%" };

  const ProductStockBadge = ({ quantity }) => {
    if (quantity > 0) {
      return <span className="badge badge-success">In Stock</span>;
    } else {
      return <span className="badge badge-danger">Out of Stock</span>;
    }
  };

  const token = localStorage.getItem("accessToken");

  // Fetch products from Fake Store API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/owner-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  // If still loading, show the Spinner
  if (loading) {
    return <Spinner />;
  }

  const handleAddProductClick = () => {
    navigate("/add-product"); // Navigate to the /add-product page
  };

  return (
    <>
      <h3 style={{ marginTop: "80px", marginLeft: "10px", fontWeight: "bold" }}>
        Dashboard
      </h3>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleAddProductClick}>
          Add Product
        </button>
      </div>
      <div
        className="product-list-container"
        style={{ marginTop: "20px", marginRight: "10px", marginLeft: "10px" }}
      >
        <div className="row justify-content-center">
          {products.map((product) => (
            <div className="col-12 mb-4 col-sm-6" key={product.id}>
              <Link
                to={`/owner-product/${product.id}`}
                className="product-card-vertical"
              >
                <div className="d-flex align-items-center">
                  <div className="product-card-image">
                    {/* <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        maxWidth: "50px",
                        maxHeight: "50px",
                        marginLeft: "10px",
                      }}
                    /> */}
                  </div>
                  <div className="product-card-body ml-3">
                    <h5 className="product-card-title">{product.name}</h5>
                    <div className="product-card-pricing">
                      <span className="text-success">${product.price}</span>
                      <span className="line-through text-muted">
                        <del>${(product.price * 1.5).toFixed(2)}</del>
                      </span>
                    </div>
                    <ProductStockBadge quantity={product.quantity} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerProductList;
