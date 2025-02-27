import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Logo from "../assets/img/abatrades-logo-other.png";
import "./Header.css"; // Import your CSS file here
import SideBar from "./SideBar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import SearchContext from "../context/SearchContext";

const Header = () => {
  // const [user, setUser] = useState(null);
  // State to toggle mobile search
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { setSearchQuery, setProductsReload } = useContext(SearchContext);

  const { user, setUser, isLoggedIn } = useAuth();

  const location = useLocation();

  // Define which routes should show specific elements
  const hideSearchAndProfileOn = ["/user-profile"];
  const hideSearchAndCartOn = ["/cart"];

  // Check if the current path matches the product details route
  const productDetailsPattern = /^\/product\/\d+$/;
  const shouldHideSearchIcon = productDetailsPattern.test(location.pathname);

  // Check if the current path matches the condition
  const shouldHideSearchAndProfile = hideSearchAndProfileOn.includes(
    location.pathname
  );

  const shouldHideSearchAndCart = hideSearchAndCartOn.includes(
    location.pathname
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearch = () => {
    // Implement your search logic here
    setSearchQuery(searchTerm);
    setProductsReload(true);
  };

  return (
    <>
      <header className="fixed-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
            {/* Hamburger Icon for mobile */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="mobile-menu-button"
              style={{
                borderRadius: "50%",
                border: "none",
                padding: "8px",
                // display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#007BFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Logo */}
            <a className="navbar-brand mx-2" href="/">
              <img
                className="w-auto mb-2"
                src={Logo}
                alt="abatrades"
                style={{ height: "40px", marginTop: "10px" }}
              />
            </a>

            {/* Search Bar - Visible on larger screens */}
            <div className="search-animated flex-grow-1 mx-3 d-none d-lg-block">
              <form
                className="form-inline search-full"
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="search-bar position-relative d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control search-form-control rounded pe-5" // Add padding to the right
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
                    style={{ height: "38px" }} // Adjust height to match button height
                  />
                  <button
                    type="button" // Prevent form submission
                    className="btn btn-link search-icon position-absolute avatar-icon rounded-circle"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "white",
                    }} // Position the icon
                    onClick={() => handleSearch()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      // viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-search"
                      style={{
                        margin: "-10px -12px",
                      }}
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Left Side: Cart and Profile */}
            <div
              className="d-flex align-items-center ms-auto"
              style={{ marginRight: "10px" }}
            >
              {/* Collapsible Search Icon for mobile (Hidden on larger screens) */}
              {!shouldHideSearchAndProfile &&
                !shouldHideSearchAndCart &&
                !shouldHideSearchIcon && (
                  <>
                    <div className="d-lg-none mx-2 avatar-sm me-3">
                      <button
                        className="btn btn-link avatar-icon rounded-circle"
                        onClick={() => setSearchOpen(!isSearchOpen)}
                        style={{
                          backgroundColor: "#3b7bf8",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-search"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </button>

                      {isSearchOpen && (
                        <div className="search-bar-mobile">
                          <form
                            className="form-inline search-full"
                            role="search"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSearch();
                            }}
                          >
                            <div className="search-bar">
                              <input
                                type="text"
                                className="form-control search-form-control rounded"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </>
                )}

              {/* Shopping Cart */}
              {!shouldHideSearchAndCart && (
                <>
                  <Link to="/cart" className="avatar avatar-sm me-3">
                    <span
                      className="avatar-icon rounded-circle"
                      style={{
                        backgroundColor: "#3b7bf8",
                      }}
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
                        className="feather feather-shopping-cart"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </span>
                  </Link>
                </>
              )}

              {/* Profile */}
              {!shouldHideSearchAndProfile && (
                <>
                  <Link
                    to={user ? "/user-profile" : "/signin"}
                    className="avatar avatar-sm"
                  >
                    <span
                      className="avatar-icon rounded-circle"
                      style={{
                        backgroundColor: "#3b7bf8",
                      }}
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
                        className="feather feather-user"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                  </Link>
                </>
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
