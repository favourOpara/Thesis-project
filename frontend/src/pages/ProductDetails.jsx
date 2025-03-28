import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}/`
        );
        console.log("Product Data:", response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        toast.error("Failed to load product details. Please try again.");
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSizeSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    const invalidSizes = selectedOptions.filter(size => !product.size.includes(size));
    
    if (invalidSizes.length > 0) {
      toast.error(`Size not available: ${invalidSizes.join(', ')}`);
      return;
    }
    
    setSelectedSizes(selectedOptions);
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
      : `http://127.0.0.1:8000${product.main_image_url}`;
    productImagesSet.add(mainImage);
  }
  if (Array.isArray(product?.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      const imageUrl = img.image_url.startsWith("http")
        ? img.image_url
        : `http://127.0.0.1:8000${img.image_url}`;
      productImagesSet.add(imageUrl);
    });
  }
  const productImagesArray = [...productImagesSet];
  if (productImagesArray.length === 0) {
    productImagesArray.push("/OIP.png");
  }

  return (
    <>
      <Header />
      <div className="layout-px-spacing">
        <div className="middle-content container-xxl p-0">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
            <div className="widget-content widget-content-area br-8">
              <div className="row justify-content-center" style={{ marginTop: "130px" }}>
                
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7 col-sm-9 col-12 d-flex justify-content-center align-items-center">
                  <Splide
                    options={{
                      type: "loop",
                      perPage: 1,
                      autoplay: true,
                      arrows: true,
                      pagination: true,
                    }}
                    className="w-100"
                  >
                    {productImagesArray.map((image, index) => (
                      <SplideSlide key={index} className="d-flex justify-content-center">
                        <img
                          src={image}
                          alt={`Product Image ${index + 1}`}
                          className="img-fluid"
                          style={{
                            maxWidth: "100%",
                            height: "400px",
                            objectFit: "contain",
                            display: "block",
                            margin: "auto",
                          }}
                          onError={(e) => {
                            e.target.src = "/OIP.png";
                          }}
                        />
                      </SplideSlide>
                    ))}
                  </Splide>
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

                    <div className="row size-selector mb-4">
                      <div className="col-md-12">
                        <strong>Select Sizes:</strong>
                        <select
                          multiple
                          className="form-select form-control-sm mt-2"
                          value={selectedSizes}
                          onChange={handleSizeSelection}
                          style={{ minHeight: "100px" }}
                        >
                          {product.size.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <small className="text-muted">Hold CTRL/CMD to select multiple sizes</small>
                      </div>
                    </div>

                    <div className="row quantity-selector mb-4">
                      <div className="col-md-6">
                        <strong>Quantity:</strong>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text" 
                          className="form-control custom-input"
                          value={quantity}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value === "") {
                              setQuantity("");
                            } else {
                              const numericValue = parseInt(value, 10);
                              if (numericValue > product.quantity) {
                                toast.error("Quantity exceeds available stock!");
                              } else {
                                setQuantity(numericValue);
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

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
    </>
  );
};

export default ProductDetails;