import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/img/abatrades-logo-other.png";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Categories data (replacing Calendar/Chat/Mailbox/etc.)
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
  const [activeCategory, setActiveCategory] = useState(null);

  // Close sidebar when clicking outside (except the hamburger button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".btn-toggle")
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Overlay (clicking it closes the sidebar) */}
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar container with ref */}
      <div
        ref={sidebarRef}
        className={`sidebar-wrapper sidebar-theme ${isOpen ? "open" : "closed"}`}
      >
        <nav id="sidebar">
          <div className="navbar-nav theme-brand flex-row text-center">
            <div className="nav-item sidebar-toggle">
              <button onClick={toggleSidebar} className="btn-toggle">
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
                  className="feather feather-chevrons-left"
                >
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div className="shadow-bottom"></div>

          <ul className="list-unstyled menu-categories" id="accordionExample">
            {/* Dashboard for sellers */}
            {user && user.user_type === "seller" && (
              <li className="menu">
                <Link to="/coming-soon" className="dropdown-toggle">
                  <div>
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
                      className="feather feather-grid"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Dashboard</span>
                  </div>
                  <div>
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
                      className="feather feather-chevron-right"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </Link>
              </li>
            )}

            {/* Categories Menu */}
            <li className="menu">
              <a
                href="#apps"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className="dropdown-toggle"
                data-bs-auto-close="false"
              >
                <div>
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
                    className="feather feather-grid"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Categories</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
              {/* Replace old items with your categoriesData */}
              <ul
                className="dropdown-menu submenu list-unstyled"
                id="apps"
                data-bs-parent="#accordionExample"
              >
                {categoriesData.map((cat, idx) => (
                  <li key={idx} className="sub-submenu dropend">
                    <a
                      href={`#cat-${idx}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="dropdown-toggle collapsed"
                      data-bs-auto-close="false"
                    >
                      {cat.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-chevron-right"
                        style={{ marginLeft: "5px" }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </a>

                    {/* Subcategories */}
                    {cat.subcategories.length > 0 ? (
                      <ul
                        className="dropdown-menu list-unstyled sub-submenu"
                        id={`cat-${idx}`}
                      >
                        {cat.subcategories.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link to="/pages/ComingSoon.jsx">{sub}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // If no subcategories, link directly
                      <Link to="/pages/ComingSoon.jsx" style={{ marginLeft: "15px" }}>
                        (No subcategories)
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            {/* Become A Seller */}
            {(user?.user_type === "buyer" || !user) && (
              <li className="menu">
                <Link
                  to="/becomeaseller"
                  className="dropdown-toggle"
                >
                  <div className="">
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
                      className="feather feather-user-check"
                    >
                      <path d="M16 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path>
                      <path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"></path>
                      <polyline points="17 8 19 10 23 6"></polyline>
                    </svg>

                    <span>Become A Seller</span>
                  </div>
                  <div>
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
                      className="feather feather-chevron-right"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </Link>
              </li>
            )}

            {/* Best sellers */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>

                  <span>Best sellers</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>

            {/* New stuff */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    className="feather feather-clock"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>

                  <span>New stuff</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>

            {/* Top deals */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    className="custom-tag-icon"
                  >
                    <path d="M4 9c0 1.656 1.344 3 3 3h10.586l4 4V9c0-1.656-1.344-3-3-3H7c-1.656 0-3 1.344-3 3z" />
                    <circle cx="8" cy="8" r="1" />
                  </svg>

                  <span>Top deals</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>

            {/* About */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    className="feather feather-users"
                  >
                    <path d="M5 20v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"></path>
                    <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path>
                    <path d="M17 9a4 4 0 0 1 4 4"></path>
                    <path d="M3 9a4 4 0 0 1 4-4"></path>
                  </svg>

                  <span>About</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>

            {/* Customer service */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    className="feather feather-mail"
                  >
                    <path d="M22 12l-10 7L2 12"></path>
                    <path d="M22 8H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"></path>
                  </svg>

                  <span>Customer service</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>

            {/* How To */}
            <li className="menu">
              <Link
                to="/coming-soon"
                className="dropdown-toggle"
              >
                <div className="">
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
                    className="feather feather-book"
                  >
                    <path d="M4 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                    <path d="M4 6h14"></path>
                    <path d="M4 10h14"></path>
                    <path d="M4 14h14"></path>
                    <path d="M4 18h14"></path>
                  </svg>

                  <span>How Tos</span>
                </div>
                <div>
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
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
