import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "./Spinner";
import "./ProductList.css";
import SearchContext from "../context/SearchContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, productsReload, setProductsReload } = useContext(SearchContext);

  // Fetch the full product list
  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  // Fetch products based on search
  useEffect(() => {
    if (searchQuery && productsReload) {
      axios
        .get("http://127.0.0.1:8000/api/products/", { params: { search: searchQuery } })
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
      setProductsReload(false);
    } else {
      fetchProducts();
    }
  }, [productsReload]);

  // Show Spinner while loading
  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // Function to render product cards
  const renderProductCards = (productList) => {
    return productList.slice(0, 6).map((product) => (
      <Link key={product.id} to={`/product/${product.id}`} className="product-card-vertical">
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card-body">
          <h5 className="product-card-title">{product.name}</h5>
          <div className="product-card-pricing">
            <span className="text-success">${product.price}</span>
            <span className="line-through text-muted">
              <del>${(product.price * 1.5).toFixed(2)}</del>
            </span>
          </div>
          <span className="badge badge-danger">SAE</span>
        </div>
      </Link>
    ));
  };

  
};

export default ProductList;
