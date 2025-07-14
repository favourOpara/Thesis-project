import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import ProductCard from "../components/ProductCard"; // Import the ProductCard component
import "./CategoryPage.css";

// Complete categories data with all subcategories
const CATEGORIES = [
  {
    value: "Clothing materials",
    label: "Clothing materials",
    displayLabel: "Clothing materials",
    icon: "👕",
    subcategories: [
      "Traditional materials", "African prints", "Aso-ebi", "Wrappers", "Shirts", 
      "Baby wears", "Sweatshirts", "Hoodies", "Trousers", "Joggers", "Shorts", 
      "Gym wears", "Underwears", "Dresses", "Socks", "Headwears", "Shoes", 
      "Slippers", "Jewelry", "Other"
    ],
  },
  {
    value: "Body accessories",
    label: "Body accessories", 
    displayLabel: "Body accessories",
    icon: "👜",
    subcategories: ["Handbags", "Purses", "Wallets", "Belts", "Handwears", "Eyewear", "Other"],
  },
  {
    value: "Household items",
    label: "Household items",
    displayLabel: "Household items",
    icon: "🏠",
    subcategories: ["Kitchenware", "Cookware", "Plastic containers", "Storage bins", "Cleaning supplies", "Other"],
  },
  {
    value: "Sports and fitness",
    label: "Sports and fitness",
    displayLabel: "Sports & Fitness",
    icon: "⚽",
    subcategories: [
      "Football equipment", "Basketball equipment", "Tennis equipment", "Swimming gear", 
      "Running gear", "Cycling equipment", "Boxing equipment", "Golf equipment", 
      "Outdoor sports", "Team sports", "Other"
    ],
  },
  {
    value: "Gym and workout equipment",
    label: "Gym and workout equipment",
    displayLabel: "Gym & Workout",
    icon: "🏋️",
    subcategories: [
      "Weights and dumbbells", "Cardio machines", "Yoga and pilates", "Resistance bands", 
      "Exercise mats", "Fitness trackers", "Protein supplements", "Gym bags", 
      "Home gym equipment", "Other"
    ],
  },
  {
    value: "Electronics and appliances",
    label: "Electronics and appliances",
    displayLabel: "Electronics",
    icon: "💻",
    subcategories: [
      "Mobile phones", "Television", "DVD players", "Home theaters", "Air conditioners", 
      "Freezers", "Fan", "Pressing iron", "Lights", "Desktops", "Laptops", 
      "Musical instruments", "Headphones", "Digital watches", "Video games", "Other"
    ],
  },
  {
    value: "agriculture, food, and groceries",
    label: "agriculture, food, and groceries",
    displayLabel: "Agriculture & Food",
    icon: "🌾",
    subcategories: [
      "Fresh fruits", "Vegetables", "Grains", "Pulses", "Legumes", "Spices", 
      "Herbs", "Seasoning", "Meat", "Poultry", "Fish", "Packaged foods", 
      "Biscuits", "Other"
    ],
  },
  {
    value: "Cosmetic and beauty products",
    label: "Cosmetic and beauty products",
    displayLabel: "Beauty & Health",
    icon: "💄",
    subcategories: ["Skincare", "Haircare", "Mouthcare", "Makeups", "Perfumes", "Other"],
  },
  {
    value: "Arts and craft",
    label: "Arts and craft",
    displayLabel: "Arts & Crafts",
    icon: "🎨",
    subcategories: [
      "Handcrafted sculptures", "Carvings", "Paintings", "Drawings", "Artworks", 
      "Beadworks", "Traditional musical instruments", "Flowers", "Other"
    ],
  },
  {
    value: "Stationery",
    label: "Stationery",
    displayLabel: "Stationery",
    icon: "✏️",
    subcategories: ["Writing materials", "Office supplies", "Art supplies", "School supplies", "Other"],
  },
  {
    value: "Furniture and home decor",
    label: "Furniture and home decor",
    displayLabel: "Furniture & Decor",
    icon: "🛋️",
    subcategories: [
      "Chairs", "Tables", "Beds", "Mattresses", "Rugs", "Curtains", 
      "Dining set", "Cupboards", "Other"
    ],
  },
  {
    value: "Autoparts and accessories",
    label: "Autoparts and accessories",
    displayLabel: "Autoparts",
    icon: "🚗",
    subcategories: ["Vehicle spare parts", "Car accessories", "Car repair tools", "Other"],
  },
  {
    value: "Building materials",
    label: "Building materials",
    displayLabel: "Building Materials",
    icon: "🏗️",
    subcategories: [
      "Cement", "Sand", "Gravel", "Bricks", "Roofing materials", "Plumbing", 
      "Electric supplies", "Toilet building", "Construction tools", "Other"
    ],
  },
  {
    value: "Toys and children products",
    label: "Toys and children products",
    displayLabel: "Toys & Kids",
    icon: "🧸",
    subcategories: [
      "Dolls", "Action figures", "Stuffed animals", "Educational toys", 
      "Games", "Baby care products", "Other"
    ],
  },
  {
    value: "Books and media",
    label: "Books and media",
    displayLabel: "Books & Media",
    icon: "📚",
    subcategories: [
      "Fiction books", "Non-fiction books", "Educational books", "Children books", 
      "Religious books", "Magazines", "Newspapers", "DVDs and CDs", 
      "Audiobooks", "Comics and manga", "Other"
    ],
  },
  {
    value: "Health and medical",
    label: "Health and medical",
    displayLabel: "Health & Medical",
    icon: "🏥",
    subcategories: [
      "First aid supplies", "Medical devices", "Vitamins and supplements", "Personal care", 
      "Dental care", "Eye care", "Hearing aids", "Mobility aids", 
      "Health monitors", "Prescription items", "Other"
    ],
  },
  {
    value: "Travel and luggage",
    label: "Travel and luggage",
    displayLabel: "Travel & Luggage",
    icon: "🧳",
    subcategories: [
      "Suitcases", "Backpacks", "Travel bags", "Laptop bags", "Travel accessories", 
      "Travel pillows", "Passport holders", "Luggage locks", "Travel organizers", "Other"
    ],
  },
  {
    value: "Musical instruments",
    label: "Musical instruments",
    displayLabel: "Musical Instruments",
    icon: "🎵",
    subcategories: [
      "Guitars", "Keyboards and pianos", "Drums", "Wind instruments", "String instruments", 
      "DJ equipment", "Recording equipment", "Music accessories", "Traditional instruments", 
      "Sheet music", "Other"
    ],
  },
  {
    value: "Jewelry and watches",
    label: "Jewelry and watches",
    displayLabel: "Jewelry & Watches",
    icon: "💎",
    subcategories: [
      "Necklaces", "Earrings", "Rings", "Bracelets", "Watches", 
      "Engagement rings", "Wedding bands", "Fashion jewelry", "Traditional jewelry", 
      "Jewelry accessories", "Other"
    ],
  },
  {
    value: "Photography and cameras",
    label: "Photography and cameras",
    displayLabel: "Photography & Cameras",
    icon: "📷",
    subcategories: [
      "Digital cameras", "Film cameras", "Camera lenses", "Tripods", "Camera bags", 
      "Memory cards", "Lighting equipment", "Photo frames", "Photo albums", 
      "Video equipment", "Other"
    ],
  },
  {
    value: "Garden and outdoor",
    label: "Garden and outdoor",
    displayLabel: "Garden & Outdoor",
    icon: "🌱",
    subcategories: [
      "Plants and seeds", "Garden tools", "Pots and planters", "Fertilizers", 
      "Outdoor furniture", "BBQ and grills", "Garden decor", "Watering equipment", 
      "Lawn care", "Camping gear", "Other"
    ],
  },
  {
    value: "Services",
    label: "Services",
    displayLabel: "Services",
    icon: "🔧",
    subcategories: [
      "Cleaning services", "Repair services", "Tutoring", "Photography services", 
      "Event planning", "Transportation", "Home improvement", "Beauty services", 
      "IT services", "Consulting", "Other"
    ],
  },
  {
    value: "Office and business",
    label: "Office and business",
    displayLabel: "Office & Business",
    icon: "💼",
    subcategories: [
      "Office furniture", "Office supplies", "Printers and scanners", "Business equipment", 
      "Filing and storage", "Presentation equipment", "Communication devices", "Software", 
      "Industrial equipment", "Safety equipment", "Other"
    ],
  },
  {
    value: "Baby and maternity",
    label: "Baby and maternity",
    displayLabel: "Baby & Maternity",
    icon: "👶",
    subcategories: [
      "Baby clothing", "Baby gear", "Baby feeding", "Diapers and wipes", 
      "Baby furniture", "Maternity wear", "Baby toys", "Baby safety", 
      "Strollers and car seats", "Nursing supplies", "Other"
    ],
  },
  {
    value: "Food and beverages",
    label: "Food and beverages",
    displayLabel: "Food & Beverages",
    icon: "🍽️",
    subcategories: [
      "Beverages", "Snacks", "Condiments and sauces", "Baking supplies", 
      "Frozen foods", "Canned goods", "Dairy products", "Specialty foods", 
      "International foods", "Organic foods", "Other"
    ],
  },
  {
    value: "Party and events",
    label: "Party and events",
    displayLabel: "Party & Events",
    icon: "🎉",
    subcategories: [
      "Party supplies", "Decorations", "Birthday supplies", "Wedding supplies", 
      "Holiday decorations", "Balloons", "Party favors", "Catering supplies", 
      "Event furniture", "Entertainment", "Other"
    ],
  },
  {
    value: "Antiques and collectibles",
    label: "Antiques and collectibles",
    displayLabel: "Antiques & Collectibles",
    icon: "🏺",
    subcategories: [
      "Vintage items", "Rare books", "Coins and stamps", "Artwork", 
      "Memorabilia", "Antique furniture", "Vintage clothing", "Collectible toys", 
      "Historical items", "Other"
    ],
  },
  {
    value: "Religious and spiritual",
    label: "Religious and spiritual",
    displayLabel: "Religious & Spiritual",
    icon: "🕊️",
    subcategories: [
      "Religious books", "Prayer items", "Religious clothing", "Spiritual jewelry", 
      "Religious art", "Meditation supplies", "Candles and incense", "Religious music", 
      "Ceremonial items", "Other"
    ],
  },
  {
    value: "Pets and animals",
    label: "Pets and animals",
    displayLabel: "Pets & Animals",
    icon: "🐶",
    subcategories: [
      "Dogs", "Cats", "Birds", "Fish and aquariums", "Small animals", 
      "Reptiles", "Pet food", "Pet toys", "Pet accessories", "Pet grooming", 
      "Pet health", "Pet training", "Pet carriers", "Other"
    ],
  },
  {
    value: "Miscellaneous",
    label: "Miscellaneous",
    displayLabel: "Miscellaneous",
    icon: "📦",
    subcategories: [
      "Gift cards", "Tickets", "Vouchers", "Craft supplies", 
      "Hobby items", "Seasonal items", "Novelty items", "Custom items", 
      "Bulk items", "Other"
    ],
  },
  {
    value: "Adult",
    label: "Adult",
    displayLabel: "Adult",
    icon: "🔞",
    subcategories: [
      "Adult entertainment", "Adult toys", "Adult accessories", "Adult books and media", 
      "Adult clothing", "Wellness products", "Other"
    ],
  },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedGender, setSelectedGender] = useState("");

  const productsPerPage = 12;
  const decodedCategoryName = decodeURIComponent(categoryName);
  
  // Find the current category
  const currentCategory = CATEGORIES.find(cat => cat.value === decodedCategoryName);

  useEffect(() => {
    // Get parameters from URL
    const subcategory = searchParams.get('subcategory');
    const gender = searchParams.get('gender');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');

    if (subcategory) setSelectedSubcategory(subcategory);
    if (gender) setSelectedGender(gender);
    if (minPrice || maxPrice) setPriceRange({ min: minPrice || "", max: maxPrice || "" });
    if (sort) setSortBy(sort);
    if (page) setCurrentPage(parseInt(page));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [decodedCategoryName, selectedSubcategory, sortBy, currentPage, priceRange, selectedGender]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        category: decodedCategoryName,
        page: currentPage,
        page_size: productsPerPage,
        ordering: getSortingParam(sortBy),
      };

      if (selectedSubcategory) {
        params.sub_category = selectedSubcategory;
      }

      if (selectedGender) {
        params.gender = selectedGender;
      }

      if (priceRange.min) {
        params.min_price = priceRange.min;
      }

      if (priceRange.max) {
        params.max_price = priceRange.max;
      }

      const response = await axios.get("https://inspiring-spontaneity-production.up.railway.app/api/products/", {
        params
      });

      if (response.data.results) {
        // Paginated response
        setProducts(response.data.results);
        setTotalProducts(response.data.count);
      } else if (Array.isArray(response.data)) {
        // Simple array response
        setProducts(response.data);
        setTotalProducts(response.data.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const getSortingParam = (sortBy) => {
    switch (sortBy) {
      case "price_low": return "price";
      case "price_high": return "-price";
      case "name_az": return "name";
      case "name_za": return "-name";
      case "oldest": return "created_at";
      case "newest": 
      default: return "-created_at";
    }
  };

  const updateUrlParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams);
    const updatedParams = { ...currentParams, ...newParams };
    
    // Remove empty parameters
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key]) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
    updateUrlParams({ subcategory, page: null });
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCurrentPage(1);
    updateUrlParams({ gender, page: null });
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
    updateUrlParams({ min_price: min, max_price: max, page: null });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateUrlParams({ sort: newSort, page: null });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateUrlParams({ page: page > 1 ? page : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedSubcategory("");
    setSelectedGender("");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setCurrentPage(1);
    setSearchParams({});
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  // Check if category requires gender filter
  const genderRequiredCategories = [
    "Clothing materials",
    "Body accessories", 
    "Cosmetic and beauty products"
  ];
  const showGenderFilter = genderRequiredCategories.includes(decodedCategoryName);

  // Get active filters count
  const activeFiltersCount = [
    selectedSubcategory,
    selectedGender,
    priceRange.min,
    priceRange.max
  ].filter(Boolean).length;

  return (
    <>
      <Header />
      <div className="category-page-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="category-main-content">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="category-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span 
                  onClick={() => navigate('/')}
                  style={{ cursor: 'pointer', color: '#007bff' }}
                >
                  Home
                </span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {currentCategory?.displayLabel || decodedCategoryName}
              </li>
              {selectedSubcategory && (
                <li className="breadcrumb-item active" aria-current="page">
                  {selectedSubcategory}
                </li>
              )}
            </ol>
          </nav>

          {/* Page Header */}
          <div className="category-header">
            <div className="category-header-content">
              <div className="category-title-section">
                {currentCategory?.icon && (
                  <span className="category-icon-large">{currentCategory.icon}</span>
                )}
                <div>
                  <h1 className="category-title">
                    {currentCategory?.displayLabel || decodedCategoryName}
                    {selectedSubcategory && ` - ${selectedSubcategory}`}
                  </h1>
                  <p className="category-description">
                    {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
                    {activeFiltersCount > 0 && (
                      <span className="category-filters-applied">
                        • {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <button 
                  className="btn btn-outline-secondary category-clear-filters-btn"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="category-controls">
            <div className="category-filters">
              {/* Subcategory Filter */}
              {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
                <div className="category-filter-group">
                  <label htmlFor="subcategory-filter">Subcategory:</label>
                  <select
                    id="subcategory-filter"
                    className="form-select category-form-select"
                    value={selectedSubcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                  >
                    <option value="">All Subcategories</option>
                    {currentCategory.subcategories.map((sub, index) => (
                      <option key={index} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Gender Filter */}
              {showGenderFilter && (
                <div className="category-filter-group">
                  <label htmlFor="gender-filter">Gender:</label>
                  <select
                    id="gender-filter"
                    className="form-select category-form-select"
                    value={selectedGender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="category-filter-group category-price-filter">
                <label>Price Range (₦):</label>
                <div className="category-price-inputs">
                  <input
                    type="number"
                    className="form-control category-form-control"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    onBlur={() => handlePriceRangeChange(priceRange.min, priceRange.max)}
                  />
                  <span className="category-price-separator">-</span>
                  <input
                    type="number"
                    className="form-control category-form-control"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    onBlur={() => handlePriceRangeChange(priceRange.min, priceRange.max)}
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="category-sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                className="form-select category-form-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_az">Name: A to Z</option>
                <option value="name_za">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Products Section */}
          <div className="category-products">
            {loading ? (
              <div className="category-loading-container">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="category-error-container">
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Error!</h4>
                  <p>{error}</p>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={fetchProducts}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="category-no-products-container">
                <div className="text-center">
                  <div className="category-no-products-icon">📦</div>
                  <h3>No products found</h3>
                  <p>
                    {activeFiltersCount > 0 
                      ? "Try adjusting your filters to see more products."
                      : "No products are available in this category yet. Check back later!"
                    }
                  </p>
                  {activeFiltersCount > 0 ? (
                    <button 
                      className="btn btn-primary"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/')}
                    >
                      Browse Other Categories
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="category-results-info">
                  <div className="category-results-summary">
                    <p>
                      Showing {startProduct}-{endProduct} of {totalProducts} products
                      {selectedSubcategory && ` in ${selectedSubcategory}`}
                      {selectedGender && ` for ${selectedGender}`}
                    </p>
                  </div>
                  
                  {/* Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <div className="category-active-filters">
                      <span className="category-active-filters-label">Active filters:</span>
                      <div className="category-filter-tags">
                        {selectedSubcategory && (
                          <span className="category-filter-tag">
                            {selectedSubcategory}
                            <button 
                              className="category-filter-tag-remove"
                              onClick={() => handleSubcategoryChange("")}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedGender && (
                          <span className="category-filter-tag">
                            {selectedGender}
                            <button 
                              className="category-filter-tag-remove"
                              onClick={() => handleGenderChange("")}
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {(priceRange.min || priceRange.max) && (
                          <span className="category-filter-tag">
                            ₦{priceRange.min || '0'} - ₦{priceRange.max || '∞'}
                            <button 
                              className="category-filter-tag-remove"
                              onClick={() => handlePriceRangeChange("", "")}
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Products Grid */}
                <div className="category-products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Products pagination" className="category-pagination-container">
                    <div className="category-pagination-info">
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    
                    <ul className="pagination justify-content-center category-pagination">
                      {/* First Page */}
                      {currentPage > 3 && (
                        <>
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                          </li>
                          {currentPage > 4 && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                        </>
                      )}

                      {/* Previous Button */}
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        
                        // Show current page and 2 pages before/after
                        if (
                          pageNumber === currentPage ||
                          (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                        ) {
                          return (
                            <li 
                              key={pageNumber} 
                              className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          );
                        }
                        return null;
                      })}
                      
                      {/* Next Button */}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>

                      {/* Last Page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          </li>
                        </>
                      )}
                    </ul>

                    {/* Quick Page Jump */}
                    {totalPages > 10 && (
                      <div className="category-page-jump">
                        <span>Go to page:</span>
                        <input
                          type="number"
                          className="form-control category-page-jump-input"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page);
                            }
                          }}
                        />
                        <span>of {totalPages}</span>
                      </div>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;