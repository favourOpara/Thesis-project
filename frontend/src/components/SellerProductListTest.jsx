import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "./Spinner";
import "./SellerProductListTest.css"; // Uses new scoped CSS

const SellerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("inspiring-spontaneity-production.up.railway.app/api/owner-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleAddProductClick = () => navigate("/add-product");
  const handleViewProduct = (productId) => navigate(`/product/${productId}`); // ✅ Correctly routes to ProductDetails
  const handleEditProduct = (productId) => navigate(`/edit-product/${productId}`);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`inspiring-spontaneity-production.up.railway.app/api/owner-products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));

      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1).toString().padStart(2, "0")}/${date.getUTCFullYear()}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return parseFloat(amount)
      .toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      })
      .replace("₦", "")
      .trim();
  };

  if (loading) return <Spinner />;

  return (
    <div className="seller-product-list"> {/*Scoped for CSS isolation */}
      <h3 className="title">Your Products</h3>
      <div className="button-container">
        <button className="add-product-btn" onClick={handleAddProductClick}>
          Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="fixed-column">Product</th>
              <th>Added on</th>
              <th>Status</th>
              <th>Price</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="fixed-column">
                  <div className="product-info">
                    <img
                      src={product.main_image_url || "/OIP.png"}
                      alt={product.name}
                      className="product-img"
                      onError={(e) => (e.target.src = "/OIP.png")}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleViewProduct(product.id)}
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{formatDate(product.created_at)}</td>
                <td>
                  {product.quantity > 0 ? (
                    <span className="badge-success">In Stock</span>
                  ) : (
                    <span className="badge-danger">Out of Stock</span>
                  )}
                </td>
                <td>₦ {formatCurrency(product.price)}</td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button className="view-btn" onClick={() => handleViewProduct(product.id)}>View</button>  {/* ✅ Navigates to ProductDetails */}
                    <button className="edit-btn" onClick={() => handleEditProduct(product.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerProductList;
