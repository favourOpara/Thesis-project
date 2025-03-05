import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "./Spinner"; // Import the Spinner component
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

const SellerProductListTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const handleAddProductClick = () => {
    navigate("/add-product"); // Navigate to the /add-product page
  };

  const handleViewProduct = (productId) => {
    axios
      .get(`http://127.0.0.1:8000/api/owner-products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert(`Product Details:\n\n${JSON.stringify(response.data, null, 2)}`);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  };
  
  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`); // Redirect to edit page
  };
  
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
  
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return; // Stop if user cancels
    }
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/owner-products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update state: Remove deleted product from the list
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
  
      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };  
  

  const ProductStockBadge = ({ quantity }) => {
    if (quantity > 0) {
      return <span className="badge badge-success">In Stock</span>;
    } else {
      return <span className="badge badge-danger">Out of Stock</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle cases where dateString is null or undefined

    try {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, "0"); // Pad with leading zero if needed
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date"; // Or handle the error as you see fit
    }
  };

  const formatCurrency = (amount) => {
    let num;

    if (typeof amount === "number") {
      num = amount;
    } else if (typeof amount === "string") {
      // Attempt to parse the string as a number
      num = Number(amount.replace(/,/g, "")); // Remove commas before parsing
      if (isNaN(num)) {
        return "Invalid Input";
      }
    } else {
      return "Invalid Input"; // Handle other non-numeric types
    }

    return num
      .toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
      })
      .replace("₦", "")
      .trim();
  };

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

  return (
    <>
      <h3 style={{ marginTop: "100px", marginLeft: "0px", fontWeight: "bold" }}>
        Dashboard
      </h3>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleAddProductClick}>
          Add Product
        </button>
      </div>
      <div className="row layout-top-spacing">
        <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
          <div className="widget-content widget-content-area br-8">
            <div className="table-responsive">
              <table
                id="ecommerce-list"
                className="table table-bordered"
                style={{ width: "90%" }}
              >
                <thead>
                  <tr>
                    <th className="checkbox-column"></th>
                    <th>Product</th>
                    <th>Added on</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th className="no-content text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      {" "}
                      {/* Important: Add a unique key */}
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex justify-content-left align-items-center">
                          {/* <div className="avatar me-3">
                          <img
                            src={product.image} // Use dynamic image source
                            alt={product.name} // Use dynamic alt text
                            width="64"
                            height="64"
                          />
                        </div> */}
                          <div className="d-flex flex-column">
                            <span className="text-truncate fw-bold">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(product.created_at)}</td>
                      <td>
                        <ProductStockBadge quantity={product.quantity} />
                      </td>
                      <td>₦ {formatCurrency(product.price)}</td>
                      <td className="text-center">
                        <div className="dropdown">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink25"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="true"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-more-horizontal"
                            >
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </a>

                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuLink25"
                          >
                            <a
                              className="dropdown-item" onClick={() => handleViewProduct(product.id)}
                            >
                              View
                            </a>
                            <a
                              className="dropdown-item" onClick={() => handleEditProduct(product.id)}
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item" href="javascript:void(0);" onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProductListTest;
