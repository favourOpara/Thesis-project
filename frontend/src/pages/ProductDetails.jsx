import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import InquiryModal from "../components/InquiryModal";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { addProductToHistory } from "../utils/localHistory";
import { hasConsentedToCookies } from "../utils/cookieConsent";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { addToCart } = useCart();
  const { user }  = useAuth();
  const isSeller  = user?.user_type === "seller";

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [shop, setShop]             = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [qty, setQty]               = useState(1);
  const [adding, setAdding]         = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE}/api/products/${id}/`
        );
        const productData = response.data;
        setProduct(productData);

        // Fetch the shop that owns this product
        if (productData.owner) {
          const shopsRes = await axios.get(`${BASE}/api/shops/`);
          const ownerShop = shopsRes.data.find((s) => s.owner_email === productData.owner);
          if (ownerShop) setShop(ownerShop);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to load product details. Please try again.");
      }
    };

    fetchProductDetails();
  }, [id]);

  // ONLY SAVE TO HISTORY IF COOKIES ACCEPTED
  useEffect(() => {
    if (product && hasConsentedToCookies()) {
      addProductToHistory(product);
    }
  }, [product]);

  // Updated size selection handler for button clicks
  const handleSizeToggle = (size) => {
    setSelectedSizes(prevSizes => {
      if (prevSizes.includes(size)) {
        // Remove size if already selected
        return prevSizes.filter(s => s !== size);
      } else {
        // Add size if not selected
        return [...prevSizes, size];
      }
    });
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) return <Spinner />;
  if (!product) return <h2>Product not found!</h2>;

  const productImagesSet = new Set();
  if (product?.main_image_url) {
    const mainImage = product.main_image_url.startsWith("http")
      ? product.main_image_url
      : `${BASE}${product.main_image_url}`;
    productImagesSet.add(mainImage);
  }
  if (Array.isArray(product?.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      const imageUrl = img.image_url.startsWith("http")
        ? img.image_url
        : `${BASE}${img.image_url}`;
      productImagesSet.add(imageUrl);
    });
  }
  const productImagesArray = [...productImagesSet];
  if (productImagesArray.length === 0) {
    productImagesArray.push("/OIP.png");
  }

  // FIXED: Determine if we should show carousel or single image
  const hasMultipleImages = productImagesArray.length > 1;

  return (
    <>
      <Header />
      <div className="layout-px-spacing">
        <div className="middle-content container-xxl p-0">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
            <div className="widget-content widget-content-area br-8">
              <div className="row justify-content-center" style={{ marginTop: "130px" }}>
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7 col-sm-9 col-12 d-flex justify-content-center align-items-center">
                  {/* FIXED: Conditional rendering based on number of images */}
                  {hasMultipleImages ? (
                    <Splide
                      options={{
                        type: "loop",
                        perPage: 1,
                        autoplay: true,
                        arrows: true,
                        pagination: true,
                        gap: 0, // Remove gap between slides
                        padding: 0, // Remove padding
                      }}
                      className="product-image-carousel"
                    >
                      {productImagesArray.map((image, index) => (
                        <SplideSlide key={index} className="product-slide">
                          <img
                            src={image}
                            alt={`Product Image ${index + 1}`}
                            className="product-slide-image"
                            onError={(e) => {
                              e.target.src = "/OIP.png";
                            }}
                          />
                        </SplideSlide>
                      ))}
                    </Splide>
                  ) : (
                    /* FIXED: Single image display without carousel */
                    <div className="single-product-image">
                      <img
                        src={productImagesArray[0]}
                        alt="Product Image"
                        className="product-single-image"
                        onError={(e) => {
                          e.target.src = "/OIP.png";
                        }}
                      />
                    </div>
                  )}
                </div>

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

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Sub Category:</strong> {product.sub_category}</p>
                        {product.gender && <p><strong>Gender:</strong> {product.gender}</p>}
                        <p><strong>Available Sizes:</strong> {product.size.join(", ")}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Material:</strong> {product.material_type}</p>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>Available Qty:</strong> {product.quantity}</p>
                      </div>
                    </div>

                    {/* Updated Size Selection Section */}
                    <div className="row size-selector mb-4">
                      <div className="col-md-12">
                        <strong>Select Sizes:</strong>
                        <div className="product-size-buttons-container mt-2">
                          {product.size.map((size) => (
                            <button
                              key={size}
                              type="button"
                              className={`product-size-button ${selectedSizes.includes(size) ? 'product-size-selected' : ''}`}
                              onClick={() => handleSizeToggle(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        {selectedSizes.length > 0 && (
                          <div className="product-selected-sizes-display mt-2">
                            <small className="text-muted">
                              Selected: {selectedSizes.join(", ")}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    {shop && (
                      <div style={{ marginBottom: "16px" }}>
                        <a
                          href={`/shop/${shop.slug}`}
                          style={{ fontSize: "14px", color: "#3b7bf8", textDecoration: "none", fontWeight: 500 }}
                        >
                          Sold by {shop.name} →
                        </a>
                      </div>
                    )}

                    {/* Quantity picker */}
                    {!isSeller && product.quantity > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <span style={{ fontWeight: 600, fontSize: "13px" }}>Qty:</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "4px 10px" }}>
                          <button onClick={() => setQty(q => Math.max(1, q - 1))}
                            style={{ border: "none", background: "none", fontWeight: 700, fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{qty}</span>
                          <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))}
                            style={{ border: "none", background: "none", fontWeight: 700, fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>+</button>
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{product.quantity} available</span>
                      </div>
                    )}

                    {/* Add to Cart */}
                    {!isSeller && (
                      <button
                        className="btn w-100 mb-2"
                        onClick={async () => {
                          if (!user) { navigate("/signin"); return; }
                          setAdding(true);
                          try {
                            await addToCart(product.id, qty);
                            toast.success("Added to cart!");
                          } catch {
                            toast.error("Could not add to cart.");
                          } finally {
                            setAdding(false);
                          }
                        }}
                        disabled={adding || product.quantity === 0}
                        style={{
                          backgroundColor: product.quantity > 0 ? "#2563eb" : "#94a3b8",
                          color: "white", border: "none", borderRadius: "8px",
                          padding: "12px", fontWeight: 700, fontSize: "15px",
                        }}
                      >
                        {product.quantity === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
                      </button>
                    )}

                    <button
                      className="btn w-100 mb-3"
                      onClick={() => setShowInquiry(true)}
                      disabled={!shop}
                      style={{
                        backgroundColor: "transparent", color: "#2563eb",
                        border: "1.5px solid #2563eb", borderRadius: "8px",
                        padding: "11px", fontWeight: 600, fontSize: "15px",
                      }}
                    >
                      {shop ? "Ask Seller a Question" : "Loading seller info..."}
                    </button>

                    <hr className="mb-5 mt-4" />

                    <div className="accordion mt-4">
                      <div className="card">
                        <div className="card-header">
                          <h5 className="mb-0">
                            <button className="btn btn-link" data-bs-toggle="collapse" data-bs-target="#productDetails">
                              Full Product Details
                            </button>
                          </h5>
                        </div>
                        <div id="productDetails" className="collapse show">
                          <div className="card-body">
                            <p>{product.description}</p>
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

      {shop && (
        <InquiryModal
          show={showInquiry}
          onClose={() => setShowInquiry(false)}
          shop={shop}
          product={product}
        />
      )}
    </>
  );
};

export default ProductDetails;