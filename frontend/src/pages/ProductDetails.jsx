import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import Header from "../components/Header";

const ProductDetails = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details when the component is mounted
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          // `https://fakestoreapi.com/products/${id}/`
          `http://127.0.0.1:8000/api/products/${id}/`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to load product details. Please try again.");
      }
    };

    fetchProductDetails();
  }, [id]); // Re-run when the product ID changes

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    ); // Loading indicator
  }

  if (!product) {
    return (
      <div>
        <h2>Product not found!</h2>
      </div>
    );
  }
  return (
    <>
      <Header />
      {/* <div id="content" className="main-content"> */}
      <div className="layout-px-spacing">
        <div className="middle-content container-xxl p-0">
          {" "}
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
            <div className="widget-content widget-content-area br-8">
              <div
                className="row justify-content-center"
                style={{ marginTop: "130px" }}
              >
                {/* image and splides for the product description */}
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7 col-sm-9 col-12 pe-3">
                  <div id="main-slider" className="splide">
                    <div className="splide__track">
                      <ul
                        className="splide__list"
                        style={{ listStyleType: "none", marginLeft: "10%" }}
                      >
                        <li className="splide__slide">
                          <a href={product.image} className="glightbox">
                            <img
                              alt={product.name}
                              src={product.image}
                              style={{
                                width: "300px",
                                height: "300px",
                              }}
                            ></img>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* <div id="thumbnail-slider" className="splide">
                    <div className="splide__track">
                      <ul className="splide__list">
                        <li className="splide__slide">
                          <img
                            alt="ecommerce"
                            src="../src/assets/img/ecommerce-1.jpg"
                          ></img>
                        </li>
                        <li className="splide__slide">
                          <img
                            alt="ecommerce"
                            src="../src/assets/img/ecommerce-2.jpg"
                          ></img>
                        </li>
                        <li className="splide__slide"><img alt="ecommerce" src="../src/assets/img/ecommerce-4.jpg"></li>
                            <li className="splide__slide"><img alt="ecommerce" src="../src/assets/img/ecommerce-5.jpg"></li>
                            <li className="splide__slide"><img alt="ecommerce" src="../src/assets/img/ecommerce-6.jpg"></li>
                      </ul>
                    </div>
                  </div> */}
                </div>

                {/* Product Description Info without image card. */}
                <div className="col-xxl-4 col-xl-5 col-lg-12 col-md-12 col-12 mt-xl-0 mt-5 align-self-center">
                  <div className="product-details-content">
                    <span className="badge badge-light-danger mb-3">
                      40% Sale off
                    </span>

                    <h3 className="product-title mb-0">{product.name}</h3>

                    {/* <div className="review mb-4">
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
                      className="feather feather-star"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="rating-score">
                      4.88 <span className="rating-count">(200 Reviews)</span>
                    </span>
                  </div> */}

                    <div className="row">
                      <div className="col-md-9 col-sm-9 col-9">
                        <div className="pricing">
                          {/* <span className="discounted-price">$20</span> */}
                          <span className="regular-price">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-3 text-end">
                        <div className="product-share">
                          <button className="btn btn-light-success btn-icon btn-rounded">
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
                              className="feather feather-share-2"
                            >
                              <circle cx="18" cy="5" r="3"></circle>
                              <circle cx="6" cy="12" r="3"></circle>
                              <circle cx="18" cy="19" r="3"></circle>
                              <line
                                x1="8.59"
                                y1="13.51"
                                x2="15.42"
                                y2="17.49"
                              ></line>
                              <line
                                x1="15.41"
                                y1="6.51"
                                x2="8.59"
                                y2="10.49"
                              ></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <hr className="mb-4" />

                    <div className="row color-swatch mb-4">
                      <div className="col-xl-3 col-lg-6 col-sm-6 align-self-center">
                        Color
                      </div>
                      <div className="col-xl-9 col-lg-6 col-sm-6">
                        <div className="color-options text-xl-end">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault3"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault4"
                              checked
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault5"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault6"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault7"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row size-selector mb-4">
                      <div className="col-xl-9 col-lg-6 col-sm-6 align-self-center">
                        Size
                      </div>
                      <div className="col-xl-3 col-lg-6 col-sm-6 align-self-center">
                        <select
                          className="form-select form-control-sm"
                          aria-label="Default select example"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L" selected>
                            L
                          </option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                        </select>
                        <a
                          href="javascript:void(0);"
                          className="product-helpers text-end d-block mt-2"
                        >
                          Size Chart
                        </a>
                      </div>
                    </div>

                    <div className="row quantity-selector mb-4">
                      <div className="col-xl-6 col-lg-6 col-sm-6 mt-sm-3">
                        Quantity
                      </div>
                      <div className="col-xl-6 col-lg-6 col-sm-6">
                        <input id="demo1" type="text" value="1" name="demo1" />
                        <p className="text-danger product-helpers text-end mt-2">
                          Low Stock
                        </p>
                      </div>
                    </div>

                    <hr className="mb-5 mt-4" />

                    <div className="action-button text-center">
                      <div className="row">
                        <div className="col-xxl-7 col-xl-7 col-sm-6 mb-sm-0 mb-3">
                          <button className="btn btn-primary w-100 btn-lg">
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
                              className="feather feather-shopping-cart"
                            >
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>{" "}
                            <span className="btn-text-inner">Add To Cart</span>
                          </button>
                        </div>

                        <div className="col-xxl-5 col-xl-5 col-sm-6">
                          <button className="btn btn-success w-100 btn-lg">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="secure-info mt-4">
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
                        className="feather feather-shield"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <p>
                        Safe and Secure Payments. Easy returns. 100% Authentic
                        products.
                      </p>
                    </div>

                    <div
                      id="iconsAccordion"
                      className="accordion-icons accordion"
                    >
                      {/* Product Details Accordion */}
                      <div className="card mt-2">
                        <div className="card-header" id="headingOne3">
                          <section className="mb-0 mt-0">
                            <div
                              role="menu"
                              className="collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#iconAccordionOne"
                              aria-expanded="false"
                              aria-controls="iconAccordionOne"
                            >
                              <div className="accordion-icon">
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
                                  className="feather feather-shopping-bag"
                                >
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                  <line x1="3" y1="6" x2="21" y2="6"></line>
                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                              </div>
                              Product Details{" "}
                              <div className="icons">
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
                                  className="feather feather-chevron-down"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </section>
                        </div>

                        <div
                          id="iconAccordionOne"
                          className="collapse"
                          aria-labelledby="headingOne3"
                          data-bs-parent="#iconsAccordion"
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <p className="mb-4">{product.description}</p>
                                {/* <p className="mb-5">
                                  Stripe shirts plain button-down collar
                                  short-sleeved three-color button navy
                                  top-fused collar. Tropical wrap front
                                  essential cut classic sartorial details
                                  feminine peplum-style shirt white. Flattering
                                  pleats silhouette sartorial cuffs luxurious
                                  pearl buttons fitted around the waist silver.
                                  Sophisticated kymono-style neckline satin
                                  finish manly cloth check black and red
                                  precious. Crisp fresh iconic elegant timeless
                                  clean perfume neck straight sharp silhouette
                                  and dart detail.
                                </p> */}

                                {/* <h5>
                                  <strong>Packaging & Delivery</strong>
                                </h5>
                                <hr />
                                <p className="mb-4">
                                  Sophisticated kymono-style neckline satin
                                  finish manly cloth check black and red
                                  precious. Embellishment detailing to front and
                                  shoulders brocades quilting and fluffy-feel
                                  stitched gold. Embroidered logo chest pocket
                                  locker loop button-flap breast pockets
                                  fastening jetted. Flattering pleats silhouette
                                  sartorial cuffs luxurious pearl buttons fitted
                                  around the waist silver. Cotton canvas chacket
                                  silk mixing classic quirky work wear primary
                                  colour cropped.
                                </p>
                                <p className="mb-5">
                                  Duis vehicula lectus condimentum, tincidunt
                                  odio a, posuere magna. Aliquam vitae orci a
                                  metus volutpat sagittis. Quisque volutpat,
                                  nulla non efficitur aliquet, turpis felis
                                  fringilla sem, quis pellentesque erat diam sit
                                  amet mi.
                                </p>

                                <h5>
                                  <strong>Specifications</strong>
                                </h5>
                                <hr />
                                <p className="mb-3">Etiam imperdiet nulla.</p>
                                <p className="mb-3">
                                  Maecenas fringilla posuere fringilla.
                                </p>
                                <p className="mb-5">
                                  Crisp fresh iconic elegant timeless clean
                                  perfume neck straight sharp silhouette and
                                  dart detail. Sophisticated kymono-style
                                  neckline satin finish manly cloth check black
                                  and red precious. Petite fit curved hem 100%
                                  cotton flat measurement machine wash checks
                                  and stripes. Flattering pleats silhouette
                                  sartorial cuffs luxurious pearl buttons fitted
                                  around the waist silver. Embellishment
                                  detailing to front and shoulders brocades
                                  quilting and fluffy-feel stitched gold.
                                </p>

                                <h5>
                                  <strong>
                                    Material And Washing Instructions
                                  </strong>
                                </h5>
                                <hr />
                                <p className="mb-3">
                                  Petite fit curved hem 100% cotton flat
                                  measurement machine wash checks and stripes.
                                  Embroidered logo chest pocket locker loop
                                  button-flap breast pockets fastening jetted.
                                  Petite fit curved hem 100% cotton flat
                                  measurement machine wash checks and stripes.
                                  Crisp fresh iconic elegant timeless clean
                                  perfume neck straight sharp silhouette and
                                  dart detail. Stripe shirts plain button-down
                                  collar short-sleeved three-color button navy
                                  top-fused collar.
                                </p> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div className="card mt-2">
                        <div className="card-header" id="headingOne4">
                          <section className="mb-0 mt-0">
                            <div
                              role="menu"
                              className="collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#iconAccordionFour"
                              aria-expanded="false"
                              aria-controls="iconAccordionFour"
                            >
                              <div className="accordion-icon">
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
                                  className="feather feather-truck"
                                >
                                  <rect
                                    x="1"
                                    y="3"
                                    width="15"
                                    height="13"
                                  ></rect>
                                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                              </div>
                              Shipping Information{" "}
                              <div className="icons">
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
                                  className="feather feather-chevron-down"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </section>
                        </div>

                        <div
                          id="iconAccordionFour"
                          className="collapse"
                          aria-labelledby="headingOne4"
                          data-bs-parent="#iconsAccordion"
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <h5>
                                  <strong>Shipping methods</strong>
                                </h5>
                                <hr />
                                <p className="mb-2">
                                  We ship with these shipping options:
                                </p>
                                <p className="mb-5">
                                  Duis vehicula lectus condimentum, tincidunt
                                  odio a, posuere magna. Aliquam vitae orci a
                                  metus volutpat sagittis. Quisque volutpat,
                                  nulla non efficitur aliquet, turpis felis
                                  fringilla sem, quis pellentesque erat diam sit
                                  amet mi.
                                </p>

                                <h5>
                                  <strong>DHL Express</strong>
                                </h5>
                                <hr />
                                <p className="mb-3">
                                  {" "}
                                  Worldwide shipping with DHL Express and you
                                  will get a tracking number for your order. All
                                  orders usually arrive within 1 business day in
                                  North American countries.
                                </p>
                                <p className="mb-5">
                                  Please see estimated delivery information at
                                  checkout.
                                </p>

                                <h5>
                                  <strong>Local pickup in Washington</strong>
                                </h5>
                                <hr />
                                <p className="mb-3">
                                  You can pickup your order from our office here
                                  in Washington. We will send you an E-mail when
                                  your order is ready for pickup. Please note:
                                  In the case of pickup orders, which need to be
                                  sent by US Post at the request of the
                                  customer, a processing fee of USD 10.00 will
                                  be charged in addition to the shipping costs.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reviews */}
                      <div className="card mt-2">
                        <div className="card-header" id="headingTwo3">
                          <section className="mb-0 mt-0">
                            <div
                              role="menu"
                              className="collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#iconAccordionTwo"
                              aria-expanded="false"
                              aria-controls="iconAccordionTwo"
                            >
                              <div className="accordion-icon">
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
                                  className="feather feather-message-circle"
                                >
                                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                              </div>
                              Reviews{" "}
                              <div className="icons">
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
                                  className="feather feather-chevron-down"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </section>
                        </div>
                        <div
                          id="iconAccordionTwo"
                          className="collapse"
                          aria-labelledby="headingTwo3"
                          data-bs-parent="#iconsAccordion"
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 mx-auto">
                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-2.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Kelly Young
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">a min ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-4.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Mary McDonald
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">40 mins ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-21.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Oscar Garner
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star empty-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">1 hr ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-24.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Daisy Anderson
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">15 hrs ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-5.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Andy King
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">1 day ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-30.png"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Andy King
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">2 days ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media mb-4">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-34.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Shaun Park
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">a week ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
                                  </div>
                                </div>

                                <div className="media">
                                  <div className="avatar me-sm-4 mb-sm-0 me-0 mb-3">
                                    <img
                                      alt="avatar"
                                      src="../src/assets/img/profile-32.jpeg"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h4 className="media-heading mb-1">
                                      Xavier
                                    </h4>
                                    <div className="stars">
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
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
                                        className="feather feather-star empty-star"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    </div>
                                    <div className="meta-tags">2 weeks ago</div>
                                    <p className="media-text mt-2">
                                      Fusce condimentum cursus mauris et ornare.
                                      Mauris fermentum mi id sollicitudin
                                      viverra. Aenean dignissim sed ante eget
                                      dapibus. Sed dapibus nulla elementum,
                                      rutrum neque eu, gravida neque.
                                    </p>
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
        </div>
      </div>
      {/* </div> */}

      {/* Second Card dormant */}
      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
        <div className="widget-content widget-content-area br-8">
          <div className="production-descriptions simple-pills">
            <div className="pro-des-content">
              {/* Star Review Part */}
              {/* <div className="row">
              <div className="col-xxl-6 col-xl-8 col-lg-9 col-md-9 col-sm-12 mx-auto">
                <div className="product-reviews mb-5">
                  <div className="row">
                    <div className="col-sm-6 align-self-center">
                      <div className="reviews">
                        <h1 className="mb-0">4.88</h1>
                        <span>(200 reviews)</span>
                        <div className="stars mt-3 mb-sm-0 mb-4">
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
                            className="feather feather-star"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
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
                            className="feather feather-star"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
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
                            className="feather feather-star"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
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
                            className="feather feather-star"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
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
                            className="feather feather-star empty-star"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row review-progress mb-sm-1 mb-3">
                        <div className="col-sm-4">
                          <p>5 Star</p>
                        </div>
                        <div className="col-sm-8 align-self-center">
                          <div className="progress">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              // style="width: 80%"
                              // style={{ width: "80%" }}
                              aria-valuenow="80"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="row review-progress mb-sm-1 mb-3">
                        <div className="col-sm-4">
                          <p>4 Star</p>
                        </div>
                        <div className="col-sm-8 align-self-center">
                          <div className="progress">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              // style="width: 40%"
                              aria-valuenow="40"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="row review-progress mb-sm-1 mb-3">
                        <div className="col-sm-4">
                          <p>3 Star</p>
                        </div>
                        <div className="col-sm-8 align-self-center">
                          <div className="progress">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              // style="width: 30%"
                              aria-valuenow="30"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="row review-progress mb-sm-1 mb-3">
                        <div className="col-sm-4">
                          <p>2 Star</p>
                        </div>
                        <div className="col-sm-8 align-self-center">
                          <div className="progress">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              // style="width: 20%"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="row review-progress mb-sm-1 mb-3">
                        <div className="col-sm-4">
                          <p>1 Star</p>
                        </div>
                        <div className="col-sm-8 align-self-center">
                          <div className="progress">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              // style="width: 10%"
                              aria-valuenow="10"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
