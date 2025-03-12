import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}/`
        );
        setProduct(response.data);
        setSelectedSize(response.data.size);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to load product details. Please try again.");
      }
    };

    

    fetchProductDetails();
  }, [id]);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) return <Spinner />;
  if (!product) return <h2>Product not found!</h2>;

  return (
    <>
      <Header />
      <div className="layout-px-spacing">
        <div className="middle-content container-xxl p-0">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
            <div className="widget-content widget-content-area br-8">
              <div className="row justify-content-center" style={{ marginTop: "130px" }}>
                {/* Image Gallery */}
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7 col-sm-9 col-12 pe-3">
                  <div className="splide">
                    <div className="splide__track">
                      <ul className="splide__list" style={{ listStyleType: "none" }}>
                        {product.images?.map((images, index) => (
                          <li className="splide__slide" key={index}>
                            <img
                              alt={product.name}
                              src={images}
                              className="img-fluid"
                              style={{
                                maxWidth: "100%",
                                height: "400px",
                                objectFit: "contain"
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-xxl-4 col-xl-5 col-lg-12 col-md-12 col-12 mt-xl-0 mt-5 align-self-center">
                  <div className="product-details-content">
                    <h3 className="product-title mb-3">{product.name}</h3>
                    
                    <div className="row mb-4">
                      <div className="col-md-9">
                        <div className="pricing">
                          <span className="regular-price">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="mb-4" />

                    {/* Product Specifications */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Sub Category:</strong> {product.sub_category}</p>
                        {product.gender && <p><strong>Gender:</strong> {product.gender}</p>}
                      </div>
                      <div className="col-md-6">
                        <p><strong>Material:</strong> {product.material_type}</p>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>Available Qty:</strong> {product.quantity}</p>
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div className="row size-selector mb-4">
                      <div className="col-md-6">
                        <strong>Size:</strong>
                      </div>
                      <div className="col-md-6">
                        <select
                          className="form-select form-control-sm"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {["S", "M", "L", "XL", "XXL"].map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="row quantity-selector mb-4">
                      <div className="col-md-6">
                        <strong>Quantity:</strong>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max={product.quantity}
                          value={quantity}
                          onChange={(e) => {
                            const value = Math.max(1, Math.min(product.quantity, e.target.value));
                            setQuantity(value);
                          }}
                        />
                      </div>
                    </div>

                    <hr className="mb-5 mt-4" />

                    {/* Add to Cart Section */}
                    <div className="action-button text-center">
                      <div className="row">
                        <div className="col-xxl-7 col-xl-7 col-sm-6 mb-sm-0 mb-3">
                          <button className="btn btn-primary w-100 btn-lg">
                            Add To Cart
                          </button>
                        </div>
                        <div className="col-xxl-5 col-xl-5 col-sm-6">
                          <button className="btn btn-success w-100 btn-lg">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Accordion */}
                    <div className="accordion mt-4">
                      <div className="card">
                        <div className="card-header">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link"
                              data-bs-toggle="collapse"
                              data-bs-target="#productDetails"
                            >
                              Full Product Details
                            </button>
                          </h5>
                        </div>
                        <div id="productDetails" className="collapse show">
                          <div className="card-body">
                            <p className="mb-4">{product.description}</p>
                            <div className="row">
                              <div className="col-md-6">
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Sub Category:</strong> {product.sub_category}</p>
                                {product.gender && <p><strong>Gender:</strong> {product.gender}</p>}
                              </div>
                              <div className="col-md-6">
                                <p><strong>Material:</strong> {product.material_type}</p>
                                <p><strong>Brand:</strong> {product.brand}</p>
                                <p><strong>Size:</strong> {product.size}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductDetails;