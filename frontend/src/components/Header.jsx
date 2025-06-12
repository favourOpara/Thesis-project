import React, { useState, useEffect, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/img/abatrades-logo-other.png";
import "./Header.css";
import SideBar from "./SideBar";
import { useAuth } from "../context/AuthContext";
import SearchContext from "../context/SearchContext";
import { useGetProductsQuery } from "../redux/api/productsApi";

const Header = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const { setSearchQuery, setProductsReload } = useContext(SearchContext);
  const { data: searchResults = [] } = useGetProductsQuery(searchTerm, {
    skip: searchTerm.trim().length === 0,
  });

  const { user } = useAuth();
  const location = useLocation();

  // Only use for hiding desktop search icon/profile/cart, not mobile!
  const hideSearchAndProfileOn = ["/user-profile"];
  const hideSearchAndCartOn = ["/cart"];
  const productDetailsPattern = /^\/product\/\d+$/;
  const shouldHideSearchIcon = productDetailsPattern.test(location.pathname);
  const shouldHideSearchAndProfile = hideSearchAndProfileOn.includes(location.pathname);
  const shouldHideSearchAndCart = hideSearchAndCartOn.includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Hide dropdown if search result is clicked
  const handleProductClick = (productId) => {
    setShowOverlay(false);
    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  // Click outside closes dropdown/overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest('.search-dropdown-desktop') ||
        event.target.closest('.search-bar-mobile')
      ) {
        return;
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOverlay(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setSearchOpen(true);
      setShowOverlay(true);
    }
  }, [searchTerm]);

  return (
    <>
      {showOverlay && (
        <div className="search-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 10000,
        }}></div>
      )}

      <header className="fixed-header" style={{ zIndex: 1050, position: "fixed" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
            <button type="button" onClick={toggleSidebar} className="mobile-menu-button"
              style={{
                borderRadius: "50%",
                border: "none",
                padding: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="#007BFF"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="feather feather-menu">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <a className="navbar-brand mx-2" href="/">
              <img className="w-auto mb-2" src={Logo} alt="abatrades"
                style={{ height: "40px", marginTop: "10px" }} />
            </a>

            {/* Desktop Search */}
            <div className="search-animated flex-grow-1 mx-3 d-none d-lg-block" style={{ position: "relative" }} ref={searchRef}>
              <form className="form-inline search-full" onSubmit={(e) => {
                e.preventDefault();
                setSearchQuery(searchTerm);
                setShowOverlay(false);      // <--- Close dropdown!
                setSearchOpen(false);        // <--- Close dropdown!
                navigate("/search");
              }}>
                <div className="search-bar position-relative d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control search-form-control rounded pe-5"
                    placeholder="Search..."
                    value={searchTerm}
                    onFocus={() => {
                      setSearchOpen(true);
                      setShowOverlay(true);
                      if (window.innerWidth >= 992) setSidebarOpen(false);
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ height: "38px" }}
                  />
                  <button type="button" className="btn btn-link search-icon position-absolute avatar-icon rounded-circle"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "white",
                    }}
                    onClick={() => {
                      setSearchQuery(searchTerm);
                      setShowOverlay(false);
                      setSearchOpen(false);
                      navigate("/search");
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      fill="none" stroke="black" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-search"
                      style={{ margin: "-10px -12px" }}>
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </form>

              {isSearchOpen && searchTerm && searchResults.length > 0 && (
                <div
                  className="search-dropdown-desktop"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    backgroundColor: "white",
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    zIndex: 10002,
                    marginTop: "2px"
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        cursor: "pointer",
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background-color 0.2s ease"
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", pointerEvents: "none" }}>
                        <div>
                          <div style={{ fontWeight: "500", fontSize: "14px" }}>{product.name}</div>
                          <small style={{ color: "#6c757d" }}>
                            {product.sub_category
                              ? `in ${product.sub_category} under ${product.category}`
                              : `in ${product.category}`}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile & Icon Buttons */}
            <div className="d-flex align-items-center ms-auto" style={{ marginRight: "10px" }}>
              {/* Always show search icon on mobile */}
              <div className="d-lg-none mx-2 avatar-sm me-3" ref={searchRef}>
                <button
                  className="btn btn-link avatar-icon rounded-circle"
                  onClick={() => {
                    setSearchOpen(true);
                    setShowOverlay(true);
                  }}
                  style={{ backgroundColor: "#3b7bf8" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>

                {isSearchOpen && (
                  <div className="search-bar-mobile" style={{
                    position: 'fixed',
                    top: '70px',
                    left: '10px',
                    right: '10px',
                    zIndex: 10001,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setSearchQuery(searchTerm);
                      setShowOverlay(false);   // <--- Close dropdown!
                      setSearchOpen(false);    // <--- Close dropdown!
                      navigate("/search");
                    }}>
                      <input
                        type="text"
                        className="form-control search-form-control rounded"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: '10px' }}
                      />
                    </form>

                    {showOverlay && searchTerm && searchResults.length > 0 && (
                      <ul className="list-unstyled" style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        margin: 0
                      }}>
                        {searchResults.map((product) => (
                          <li
                            key={product.id}
                            style={{
                              cursor: "pointer",
                              padding: "10px",
                              borderBottom: "1px solid #f0f0f0",
                              borderRadius: "4px"
                            }}
                            onClick={() => handleProductClick(product.id)}
                          >
                            <div style={{ fontWeight: "500", fontSize: "14px" }}>{product.name}</div>
                            <small className="text-muted">
                              {product.sub_category
                                ? `in ${product.sub_category} under ${product.category}`
                                : `in ${product.category}`}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {!shouldHideSearchAndCart && (
                <Link to="/cart" className="avatar avatar-sm me-3">
                  <span className="avatar-icon rounded-circle" style={{ backgroundColor: "#3b7bf8" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-shopping-cart">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </span>
                </Link>
              )}

              {!shouldHideSearchAndProfile && (
                <Link to={user ? "/user-profile" : "/signin"} className="avatar avatar-sm">
                  <span className="avatar-icon rounded-circle" style={{ backgroundColor: "#3b7bf8" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-user">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
