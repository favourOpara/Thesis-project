import React, { useState, useEffect, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/img/abatrades-logo-other.png";
import "./Header.css";
import SideBar from "./SideBar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchContext from "../context/SearchContext";
import { useGetProductsQuery } from "../redux/api/productsApi";
import categoriesData from "../data/categoriesData";

const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronRight = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Header = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [desktopCatsOpen, setDesktopCatsOpen] = useState(false);
  const [openDesktopSubs, setOpenDesktopSubs] = useState({});

  const searchRef = useRef(null);
  const desktopCatsRef = useRef(null);
  const navigate = useNavigate();

  const { setSearchQuery, setProductsReload } = useContext(SearchContext);
  const { data: searchResults = [] } = useGetProductsQuery(searchTerm, {
    skip: searchTerm.trim().length === 0,
  });

  const { user } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const isSeller = user?.user_type === "seller";

  const hideSearchAndProfileOn = ["/user-profile"];
  const productDetailsPattern = /^\/product\/\d+$/;
  const shouldHideSearchIcon = productDetailsPattern.test(location.pathname);
  const shouldHideSearchAndProfile = hideSearchAndProfileOn.includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const getCategoryUrl = (val) => `/category/${encodeURIComponent(val)}`;
  const getSubcategoryUrl = (val, sub) => `/category/${encodeURIComponent(val)}?subcategory=${encodeURIComponent(sub)}`;
  const toggleDesktopSub = (name) => setOpenDesktopSubs(p => ({ ...p, [name]: !p[name] }));

  const handleProductClick = (productId) => {
    setShowOverlay(false);
    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest('.sidebar-wrapper') ||
        event.target.closest('.mobile-menu-button') ||
        event.target.closest('.btn-toggle')
      ) return;

      if (
        event.target.closest('.search-dropdown-desktop') ||
        event.target.closest('.search-bar-mobile')
      ) return;

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOverlay(false);
        setSearchOpen(false);
      }

      if (desktopCatsRef.current && !desktopCatsRef.current.contains(event.target)) {
        setDesktopCatsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {showOverlay && (
        <div className="search-overlay" style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", zIndex: 10000,
        }} />
      )}

      <header className="fixed-header" style={{ zIndex: 1050, position: "fixed" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid" style={{ flexWrap: "nowrap" }}>

            {/* Logo */}
            <a className="navbar-brand mx-2" href="/">
              <img src={Logo} alt="abatrades" style={{ height: "34px", display: "block" }} />
            </a>

            {/* ── Desktop nav (replaces search bar + second header) ── */}
            <div className="d-none d-lg-flex align-items-center flex-grow-1 mx-2" style={{ gap: "2px", minWidth: 0 }}>

              {/* All Categories dropdown */}
              <div ref={desktopCatsRef} style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => { setDesktopCatsOpen(p => !p); if (desktopCatsOpen) setOpenDesktopSubs({}); }}
                  className="categories-btn"
                  style={{ fontSize: "12px", padding: "0 10px", height: "30px" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  All Categories
                  <ChevronDown />
                </button>

                {desktopCatsOpen && (
                  <div className="desktop-dropdown">
                    {categoriesData.map((category, idx) => (
                      <div key={idx} className="desktop-category-item">
                        <div className="desktop-category-header">
                          <Link
                            to={getCategoryUrl(category.value)}
                            className="desktop-category-main-link"
                            onClick={() => setDesktopCatsOpen(false)}
                            style={{ color: '#1f2937', textDecoration: 'none', flex: 1, fontSize: '13.5px', fontWeight: 500 }}
                          >
                            {category.name}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDesktopSub(category.name); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                            >
                              <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: openDesktopSubs[category.name] ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                <ChevronRight />
                              </span>
                            </button>
                          )}
                        </div>
                        {openDesktopSubs[category.name] && (
                          <div className="desktop-subcategory-content open">
                            {category.subcategories.map((sub, i) => (
                              <Link key={i} to={getSubcategoryUrl(category.value, sub)} className="desktop-subcategory-link" onClick={() => setDesktopCatsOpen(false)}>
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warehouse & Logistics — stacked label, beside categories */}
              <Link to="/services" style={{
                display: "flex", flexDirection: "column", padding: "0 12px",
                borderLeft: "1px solid #e5e7eb", textDecoration: "none",
                height: "36px", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500, lineHeight: 1.2 }}>Storage &amp; delivery</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Warehouse &amp; Logistics</span>
              </Link>

              <div style={{ width: "1px", height: "18px", background: "#e5e7eb", flexShrink: 0, margin: "0 6px" }} />

              {/* Nav links */}
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-evenly", minWidth: 0 }}>
                <Link to="/coming-soon" className="desktop-menu-link" style={{ fontSize: "12px", padding: "4px 8px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Trending
                </Link>
                <Link to="/coming-soon" className="desktop-menu-link" style={{ fontSize: "12px", padding: "4px 8px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  New Arrivals
                </Link>
                <Link to="/coming-soon" className="desktop-menu-link" style={{ fontSize: "12px", padding: "4px 8px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Top Deals
                </Link>
                <Link to="/coming-soon" className="desktop-menu-link" style={{ fontSize: "12px", padding: "4px 8px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Support
                </Link>
                <Link to="/join" className="desktop-menu-link" style={{ fontSize: "12px", padding: "4px 8px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  How It Works
                </Link>
              </div>

              <div style={{ width: "1px", height: "18px", background: "#e5e7eb", flexShrink: 0, margin: "0 6px" }} />

              {/* Own a Store CTA */}
              {!user && (
                <Link to="/join" className="desktop-menu-link cta-btn" style={{ flexShrink: 0, fontSize: "12px", padding: "4px 10px", height: "28px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Own a Store
                </Link>
              )}
            </div>

            {/* Warehouse & Logistics — mobile stacked label */}
            <Link to="/services" className="d-lg-none" style={{
              display: "flex", flexDirection: "column", padding: "0 7px",
              borderLeft: "1px solid #e5e7eb", textDecoration: "none",
              height: "30px", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "8px", color: "#9ca3af", fontWeight: 500, lineHeight: 1.2 }}>Storage &amp; delivery</span>
              <span style={{ fontSize: "9.5px", fontWeight: 700, color: "#111827", lineHeight: 1.2, whiteSpace: "nowrap" }}>Warehouse &amp; Logistics</span>
            </Link>

            {/* ── Right icons ── */}
            <div className="d-flex align-items-center ms-auto" style={{ gap: "4px" }}>

              {/* Mobile search */}
              <div className="d-lg-none" ref={searchRef}>
                <button
                  className="btn btn-link avatar-icon rounded-circle"
                  onClick={() => { setSearchOpen(true); setShowOverlay(true); }}
                  style={{ backgroundColor: "#f1f5f9", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#f97316" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>

                {isSearchOpen && (
                  <div className="search-bar-mobile" style={{
                    position: 'fixed', top: '56px', left: '10px', right: '10px',
                    zIndex: 10001, backgroundColor: 'white', borderRadius: '8px',
                    padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setSearchQuery(searchTerm);
                      setShowOverlay(false);
                      setSearchOpen(false);
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
                      <ul className="list-unstyled" style={{ maxHeight: "300px", overflowY: "auto", margin: 0 }}>
                        {searchResults.map((product) => (
                          <li key={product.id}
                            style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #f0f0f0", borderRadius: "4px" }}
                            onClick={() => handleProductClick(product.id)}
                          >
                            <div style={{ fontWeight: "500", fontSize: "14px" }}>{product.name}</div>
                            <small className="text-muted">
                              {product.sub_category ? `in ${product.sub_category} under ${product.category}` : `in ${product.category}`}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              {!shouldHideSearchAndProfile && (
                <Link to={user ? (isSeller ? "/seller/overview" : "/user-profile") : "/signin"} style={{ display: "inline-flex" }}>
                  <span className="avatar-icon rounded-circle" style={{
                    backgroundColor: user ? "#eff6ff" : "#f1f5f9",
                    width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={user ? "#2563eb" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                </Link>
              )}

              {/* Hamburger — mobile only, far right */}
              <button type="button" onClick={toggleSidebar} className="mobile-menu-button d-lg-none"
                style={{ borderRadius: "8px", border: "none", background: "none", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>

          </div>
        </nav>
      </header>

      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
