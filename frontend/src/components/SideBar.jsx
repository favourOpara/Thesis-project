import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import categoriesData from "../data/categoriesData";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const sidebarRef = useRef(null);
  const [openCategories, setOpenCategories] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.mobile-menu-button')
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleSidebar, isMobile]);

  // Lock background page scroll while sidebar is open (iOS-safe)
  useEffect(() => {
    if (!isMobile) return;
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.sidebarScrollY = String(scrollY);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      const scrollY = Number(document.body.dataset.sidebarScrollY || 0);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      if (scrollY) window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [isOpen, isMobile]);

  const toggleCategory = (categoryName) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const closeAllAndSidebar = () => {
    setOpenCategories({});
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Generate category URL
  const getCategoryUrl = (categoryValue) => {
    return `/category/${encodeURIComponent(categoryValue)}`;
  };

  // Generate subcategory URL
  const getSubcategoryUrl = (categoryValue, subcategory) => {
    return `/category/${encodeURIComponent(categoryValue)}?subcategory=${encodeURIComponent(subcategory)}`;
  };

  // MOBILE VERSION
  const QUICK_CATS = [
    { label: "Fashion", icon: "👗", value: "Clothing materials" },
    { label: "Electronics", icon: "💻", value: "Electronics and appliances" },
    { label: "Beauty", icon: "💄", value: "Cosmetic and beauty products" },
    { label: "Food", icon: "🛒", value: "agriculture, food, and groceries" },
    { label: "Sports", icon: "🏋️", value: "Sports and fitness" },
    { label: "Home", icon: "🏠", value: "Furniture and home decor" },
  ];

  const NAV_LINKS = [
    { label: "Support", icon: "💬", to: "/coming-soon", bg: "#eff6ff", color: "#3b7bf8" },
    { label: "How It Works", icon: "❓", to: "/coming-soon", bg: "#f8fafc", color: "#64748b" },
  ];

  const MobileChevron = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}

        <div ref={sidebarRef} className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>

          {/* ── Top bar — fixed, never scrolls ── */}
          <div className="sidebar-header">
            <span className="sidebar-logo">aba<span>trades</span></span>
            <button onClick={toggleSidebar} className="close-btn" aria-label="Close menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* ── Scrollable content ── */}
          <div className="sidebar-scroll-body">

          {/* ── User greeting ── */}
          {user ? (
            <div className="sidebar-user-banner">
              <div className="sidebar-user-avatar">
                {(user.first_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="sidebar-user-name">
                  {user.first_name ? `Hi, ${user.first_name}` : "Welcome back"}
                </div>
                <div className="sidebar-user-type">
                  {user.user_type === "seller" ? "Seller account" : "Buyer account"}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "8px" }}>
              <Link to="/signin" onClick={closeAllAndSidebar} style={{ flex: 1, padding: "9px", background: "#3b7bf8", color: "white", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                Sign In
              </Link>
              <Link to="/sellersignup" onClick={closeAllAndSidebar} style={{ flex: 1, padding: "9px", background: "white", color: "#374151", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1.5px solid #e2e8f0" }}>
                Register
              </Link>
            </div>
          )}

          {/* ── Quick categories grid ── */}
          <div className="sidebar-section-label">Shop by Category</div>
          <div className="sidebar-category-grid">
            {QUICK_CATS.map(cat => (
              <Link
                key={cat.label}
                to={getCategoryUrl(cat.value)}
                className="sidebar-cat-tile"
                onClick={closeAllAndSidebar}
              >
                <span className="cat-icon">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>

          {/* ── All categories expandable row ── */}
          <button
            className="sidebar-nav-row"
            onClick={() => toggleCategory('mobile-all-cats')}
          >
            <div className="nav-icon" style={{ background: "#eff6ff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b7bf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </div>
            <span style={{ flex: 1, fontWeight: 600, color: "#111827" }}>All Categories</span>
            <span className="nav-chevron" style={{ transform: openCategories['mobile-all-cats'] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-flex' }}>
              <MobileChevron />
            </span>
          </button>

          {openCategories['mobile-all-cats'] && (
            <div style={{ background: '#f8fafc' }}>
              {categoriesData.map((cat, idx) => (
                <Link
                  key={idx}
                  to={getCategoryUrl(cat.value)}
                  className="sidebar-cat-row"
                  onClick={closeAllAndSidebar}
                >
                  {cat.name}
                  <MobileChevron />
                </Link>
              ))}
            </div>
          )}

          {/* ── Divider ── */}
          <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />
          <div className="sidebar-section-label">Explore</div>

          {/* ── Quick nav links ── */}
          {NAV_LINKS.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="sidebar-nav-row"
              onClick={closeAllAndSidebar}
              style={{ textDecoration: "none" }}
            >
              <div className="nav-icon" style={{ background: item.bg }}>
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
              </div>
              <span style={{ flex: 1, color: "#111827" }}>{item.label}</span>
              <span className="nav-chevron"><MobileChevron /></span>
            </Link>
          ))}

          {/* ── Seller dashboard ── */}
          {user?.user_type === "seller" && (
            <Link to="/seller/overview" className="sidebar-nav-row" onClick={closeAllAndSidebar} style={{ textDecoration: "none" }}>
              <div className="nav-icon" style={{ background: "#eff6ff" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b7bf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span style={{ flex: 1, color: "#111827", fontWeight: 600 }}>My Dashboard</span>
              <span className="nav-chevron"><MobileChevron /></span>
            </Link>
          )}

          {/* ── Bottom CTA ── */}
          {!user && (
            <div className="sidebar-bottom">
              <Link to="/sellersignup" className="sidebar-cta-btn" onClick={closeAllAndSidebar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Own a Store — It's Free
              </Link>
            </div>
          )}

          </div>{/* end sidebar-scroll-body */}
        </div>
      </>
    );
  }

  // Desktop: nav is now part of the merged header
  return null;
};

export default SideBar;