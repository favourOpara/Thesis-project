import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

// Categories data
const categoriesData = [
  {
    name: "Clothing materials",
    subcategories: [
      "Traditional materials",
      "African prints",
      "Aso-ebi",
      "Wrappers",
      "Shirts",
      "Trousers",
      "Gym wears",
      "Underwears",
      "Dresses",
      "Socks",
      "Headwears",
      "Shoes",
      "Slippers",
      "Jewelry",
      "Other",
    ],
  },
  {
    name: "Body accessories",
    subcategories: [
      "Handbags",
      "Purses",
      "Wallets",
      "Belts",
      "Handwears",
      "Eyewear",
      "Other",
    ],
  },
  {
    name: "Household items",
    subcategories: [
      "Kitchenware",
      "Cookware",
      "Plastic containers",
      "Storage bins",
      "Cleaning supplies",
      "Other",
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      "Mobile phones",
      "Television",
      "DVD players",
      "Home theaters",
      "Air conditioners",
      "Freezers",
      "Fan",
      "Pressing iron",
      "Lights",
      "Desktops",
      "Laptops",
      "Musical instruments",
      "Headphones",
      "Digital watches",
      "Video games",
      "Other",
    ],
  },
  {
    name: "Agriculture & Food",
    subcategories: [
      "Fresh fruits",
      "Vegetables",
      "Grains",
      "Pulses",
      "Legumes",
      "Spices",
      "Herbs",
      "Seasoning",
      "Meat",
      "Poultry",
      "Fish",
      "Packaged foods",
      "Biscuits",
      "Other",
    ],
  },
  {
    name: "Beauty & Health",
    subcategories: [
      "Skincare",
      "Haircare",
      "Mouthcare",
      "Makeups",
      "Perfumes",
      "Other",
    ],
  },
  {
    name: "Arts & Crafts",
    subcategories: [
      "Handcrafted sculptures",
      "Carvings",
      "Paintings",
      "Drawings",
      "Artworks",
      "Beadworks",
      "Traditional musical instruments",
      "Flowers",
      "Other",
    ],
  },
  {
    name: "Stationery",
    subcategories: [
      "Writing materials",
      "Office supplies",
      "Art supplies",
      "School supplies",
      "Other",
    ],
  },
  {
    name: "Furniture & Decor",
    subcategories: [
      "Chairs",
      "Tables",
      "Beds",
      "Mattresses",
      "Rugs",
      "Curtains",
      "Dining set",
      "Cupboards",
      "Other",
    ],
  },
  {
    name: "Autoparts",
    subcategories: [
      "Vehicle spare parts",
      "Car accessories",
      "Car repair tools",
      "Other",
    ],
  },
  {
    name: "Building Materials",
    subcategories: [
      "Cement",
      "Sand",
      "Gravel",
      "Bricks",
      "Roofing materials",
      "Plumbing",
      "Electric supplies",
      "Toilet building",
      "Construction tools",
      "Other",
    ],
  },
  {
    name: "Toys & Kids",
    subcategories: [
      "Dolls",
      "Action figures",
      "Stuffed animals",
      "Educational toys",
      "Games",
      "Baby care products",
      "Other",
    ],
  },
  { name: "Miscellaneous", subcategories: [] },
  { name: "Animal Pets", subcategories: ["Pets", "Pet food", "Other"] },
  { name: "Adult", subcategories: ["Sex toys", "Lubricants", "Other"] },
];

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
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.mobile-menu-button')
      ) {
        toggleSidebar();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, toggleSidebar, isMobile]);

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

  // MOBILE VERSION
  if (isMobile) {
    return (
      <>
        {/* Backdrop - only show when open */}
        {isOpen && (
          <div 
            className="sidebar-backdrop"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Mobile Sidebar - always rendered for animation */}
        <div
          ref={sidebarRef}
          className={`mobile-sidebar ${isOpen ? 'open' : ''}`}
        >
          {/* Header with close button */}
          <div className="sidebar-header">
            <button
              onClick={toggleSidebar}
              className="close-btn"
            >
              ×
            </button>
          </div>

          {/* Dashboard for sellers */}
          {user && user.user_type === "seller" && (
            <div className="menu-item">
              <Link 
                to="/coming-soon" 
                className="menu-item-link"
                onClick={closeAllAndSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="menu-icon"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </Link>
            </div>
          )}

          {/* Categories with proper dropdown */}
          <div className="menu-item">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCategory('main-categories');
              }}
              className="dropdown-toggle"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="menu-icon"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
                Categories
              </div>
              <span className={`dropdown-arrow ${openCategories['main-categories'] ? 'open' : ''}`}>
                ▶
              </span>
            </button>
            
            {/* Categories dropdown */}
            <div className={`dropdown-content ${openCategories['main-categories'] ? 'open' : ''}`}>
              {categoriesData.map((category, idx) => (
                <div key={idx} className="category-item">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCategory(category.name);
                    }}
                    className="category-toggle"
                  >
                    <span>{category.name}</span>
                    {category.subcategories.length > 0 && (
                      <span className={`dropdown-arrow ${openCategories[category.name] ? 'open' : ''}`}>
                        ▶
                      </span>
                    )}
                  </button>
                  
                  {/* Sub-subcategories */}
                  {category.subcategories.length > 0 && (
                    <div className={`subcategory-content ${openCategories[category.name] ? 'open' : ''}`}>
                      {category.subcategories.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to="/pages/ComingSoon.jsx"
                          className="subcategory-link"
                          onClick={closeAllAndSidebar}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Other Menu Items */}
          {(user?.user_type === "buyer" || !user) && (
            <div className="menu-item">
              <Link 
                to="/becomeaseller"
                className="menu-item-link"
                onClick={closeAllAndSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="menu-icon"
                >
                  <path d="M16 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path>
                  <path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"></path>
                  <polyline points="17 8 19 10 23 6"></polyline>
                </svg>
                Become A Seller
              </Link>
            </div>
          )}

          {["Best sellers", "New stuff", "Top deals", "About", "Customer service", "How Tos"].map((item) => (
            <div key={item} className="menu-item">
              <Link 
                to="/coming-soon"
                className="menu-item-link"
                onClick={closeAllAndSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="menu-icon"
                >
                  {item === "Best sellers" && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
                  {item === "New stuff" && <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>}
                  {item === "Top deals" && <><path d="M4 9c0 1.656 1.344 3 3 3h10.586l4 4V9c0-1.656-1.344-3-3-3H7c-1.656 0-3 1.344-3 3z" /><circle cx="8" cy="8" r="1" /></>}
                  {item === "About" && <><path d="M5 20v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"></path><path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path><path d="M17 9a4 4 0 0 1 4 4"></path><path d="M3 9a4 4 0 0 1 4-4"></path></>}
                  {item === "Customer service" && <><path d="M22 12l-10 7L2 12"></path><path d="M22 8H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"></path></>}
                  {item === "How Tos" && <><path d="M4 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M4 6h14"></path><path d="M4 10h14"></path><path d="M4 14h14"></path><path d="M4 18h14"></path></>}
                </svg>
                {item}
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  }

  // DESKTOP VERSION - ALWAYS VISIBLE (like your image)
  return (
    <div
      ref={sidebarRef}
      className="desktop-sidebar"
    >
      {/* Categories with hamburger icon */}
      <div className="categories-dropdown">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCategory('desktop-categories');
          }}
          className="categories-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>Categories</span>
          <span className={`dropdown-arrow ${openCategories['desktop-categories'] ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {/* Categories Dropdown */}
        {openCategories['desktop-categories'] && (
          <div className="desktop-dropdown">
            {categoriesData.map((category, idx) => (
              <div key={idx} className="desktop-category-item">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCategory(`desktop-${category.name}`);
                  }}
                  className="desktop-category-toggle"
                >
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && (
                    <span className={`dropdown-arrow ${openCategories[`desktop-${category.name}`] ? 'open' : ''}`}>
                      ▶
                    </span>
                  )}
                </button>
                {openCategories[`desktop-${category.name}`] && category.subcategories.length > 0 && (
                  <div className={`desktop-subcategory-content ${openCategories[`desktop-${category.name}`] ? 'open' : ''}`}>
                    {category.subcategories.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        to="/pages/ComingSoon.jsx"
                        className="desktop-subcategory-link"
                        onClick={closeAllAndSidebar}
                      >
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

      {/* Dashboard for sellers */}
      {user && user.user_type === "seller" && (
        <Link 
          to="/coming-soon" 
          className="desktop-menu-link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Dashboard
        </Link>
      )}

      {/* Become A Seller */}
      {(user?.user_type === "buyer" || !user) && (
        <Link 
          to="/becomeaseller"
          className="desktop-menu-link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path>
            <path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"></path>
            <polyline points="17 8 19 10 23 6"></polyline>
          </svg>
          Become A Seller
        </Link>
      )}

      {/* Best sellers */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Best sellers
      </Link>

      {/* New stuff */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        New stuff
      </Link>

      {/* Top deals */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 9c0 1.656 1.344 3 3 3h10.586l4 4V9c0-1.656-1.344-3-3-3H7c-1.656 0-3 1.344-3 3z" />
          <circle cx="8" cy="8" r="1" />
        </svg>
        Top deals
      </Link>

      {/* About */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 20v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"></path>
          <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path>
          <path d="M17 9a4 4 0 0 1 4 4"></path>
          <path d="M3 9a4 4 0 0 1 4-4"></path>
        </svg>
        About
      </Link>

      {/* Customer service */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12l-10 7L2 12"></path>
          <path d="M22 8H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"></path>
        </svg>
        Customer service
      </Link>

      {/* How Tos */}
      <Link 
        to="/coming-soon"
        className="desktop-menu-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
          <path d="M4 6h14"></path>
          <path d="M4 10h14"></path>
          <path d="M4 14h14"></path>
          <path d="M4 18h14"></path>
        </svg>
        How Tos
      </Link>
    </div>
  );
};

export default SideBar;