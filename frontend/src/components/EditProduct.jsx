import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { getFieldConfig, getSizeOptions } from "../utils/productConfig";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sub_category: "",
    description: "",
    price: "",
    discount_percentage: "",
    quantity: "",
    material_type: "",
    brand: "",
    gender: "",
    extra_fields: {},
  });

  const [sizeVariants, setSizeVariants] = useState([{ size: "", qty: "" }]);

  // Unified image slots: { key, type:'existing'|'new', url, file?, serverId? }
  const [imageSlots, setImageSlots] = useState([]);
  const [oversizedFiles, setOversizedFiles] = useState([]);
  const dragIdx = useRef(null);
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fieldConfig = useMemo(
    () => getFieldConfig(formData.category, formData.sub_category),
    [formData.category, formData.sub_category]
  );
  const sizeOptions = useMemo(() => getSizeOptions(fieldConfig.sizeType), [fieldConfig.sizeType]);

  // Complete Categories and Subcategories Configuration
  const CATEGORIES = [
    {
      value: "Clothing materials",
      label: "Clothing materials",
      subcategories: [
        { value: "Traditional materials", label: "Traditional materials" },
        { value: "African prints", label: "African prints" },
        { value: "Aso-ebi", label: "Aso-ebi" },
        { value: "Wrappers", label: "Wrappers" },
        { value: "Shirts", label: "Shirts" },
        { value: "Baby wears", label: "Baby wears" },
        { value: "Sweatshirts", label: "Sweatshirts" },
        { value: "Hoodies", label: "Hoodies" },
        { value: "Trousers", label: "Trousers" },
        { value: "Joggers", label: "Joggers" },
        { value: "Shorts", label: "Shorts" },
        { value: "Gym wears", label: "Gym wears" },
        { value: "Underwears", label: "Underwears" },
        { value: "Dresses", label: "Dresses" },
        { value: "Socks", label: "Socks" },
        { value: "Headwears", label: "Headwears" },
        { value: "Shoes", label: "Shoes" },
        { value: "Slippers", label: "Slippers" },
        { value: "Jewelry", label: "Jewelry" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Body accessories",
      label: "Body accessories",
      subcategories: [
        { value: "Handbags", label: "Handbags" },
        { value: "Purses", label: "Purses" },
        { value: "Wallets", label: "Wallets" },
        { value: "Belts", label: "Belts" },
        { value: "Handwears", label: "Handwears" },
        { value: "Eyewear", label: "Eyewear" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Household items",
      label: "Household items",
      subcategories: [
        { value: "Kitchenware", label: "Kitchenware" },
        { value: "Cookware", label: "Cookware" },
        { value: "Plastic containers", label: "Plastic containers" },
        { value: "Storage bins", label: "Storage bins" },
        { value: "Cleaning supplies", label: "Cleaning supplies" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Sports and fitness",
      label: "Sports and fitness",
      subcategories: [
        { value: "Football equipment", label: "Football equipment" },
        { value: "Basketball equipment", label: "Basketball equipment" },
        { value: "Tennis equipment", label: "Tennis equipment" },
        { value: "Swimming gear", label: "Swimming gear" },
        { value: "Running gear", label: "Running gear" },
        { value: "Cycling equipment", label: "Cycling equipment" },
        { value: "Boxing equipment", label: "Boxing equipment" },
        { value: "Golf equipment", label: "Golf equipment" },
        { value: "Outdoor sports", label: "Outdoor sports" },
        { value: "Team sports", label: "Team sports" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Gym and workout equipment",
      label: "Gym and workout equipment",
      subcategories: [
        { value: "Weights and dumbbells", label: "Weights and dumbbells" },
        { value: "Cardio machines", label: "Cardio machines" },
        { value: "Yoga and pilates", label: "Yoga and pilates" },
        { value: "Resistance bands", label: "Resistance bands" },
        { value: "Exercise mats", label: "Exercise mats" },
        { value: "Fitness trackers", label: "Fitness trackers" },
        { value: "Protein supplements", label: "Protein supplements" },
        { value: "Gym bags", label: "Gym bags" },
        { value: "Home gym equipment", label: "Home gym equipment" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Electronics and appliances",
      label: "Electronics and appliances",
      subcategories: [
        { value: "Mobile phones", label: "Mobile phones" },
        { value: "Television", label: "Television" },
        { value: "DVD players", label: "DVD players" },
        { value: "Home theaters", label: "Home theaters" },
        { value: "Air conditioners", label: "Air conditioners" },
        { value: "Freezers", label: "Freezers" },
        { value: "Fan", label: "Fan" },
        { value: "Pressing iron", label: "Pressing iron" },
        { value: "Lights", label: "Lights" },
        { value: "Desktops", label: "Desktops" },
        { value: "Laptops", label: "Laptops" },
        { value: "Musical instruments", label: "Musical instruments" },
        { value: "Headphones", label: "Headphones" },
        { value: "Digital watches", label: "Digital watches" },
        { value: "Video games", label: "Video games" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "agriculture, food, and groceries",
      label: "agriculture, food, and groceries",
      subcategories: [
        { value: "Fresh fruits", label: "Fresh fruits" },
        { value: "Vegetables", label: "Vegetables" },
        { value: "Grains", label: "Grains" },
        { value: "Pulses", label: "Pulses" },
        { value: "Legumes", label: "Legumes" },
        { value: "Spices", label: "Spices" },
        { value: "Herbs", label: "Herbs" },
        { value: "Seasoning", label: "Seasoning" },
        { value: "Meat", label: "Meat" },
        { value: "Poultry", label: "Poultry" },
        { value: "Fish", label: "Fish" },
        { value: "Packaged foods", label: "Packaged foods" },
        { value: "Biscuits", label: "Biscuits" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Cosmetic and beauty products",
      label: "Cosmetic and beauty products",
      subcategories: [
        { value: "Skincare", label: "Skincare" },
        { value: "Haircare", label: "Haircare" },
        { value: "Mouthcare", label: "Mouthcare" },
        { value: "Makeups", label: "Makeups" },
        { value: "Perfumes", label: "Perfumes" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Arts and craft",
      label: "Arts and craft",
      subcategories: [
        { value: "Handcrafted sculptures", label: "Handcrafted sculptures" },
        { value: "Carvings", label: "Carvings" },
        { value: "Paintings", label: "Paintings" },
        { value: "Drawings", label: "Drawings" },
        { value: "Artworks", label: "Artworks" },
        { value: "Beadworks", label: "Beadworks" },
        { value: "Traditional musical instruments", label: "Traditional musical instruments" },
        { value: "Flowers", label: "Flowers" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Stationery",
      label: "Stationery",
      subcategories: [
        { value: "Writing materials", label: "Writing materials" },
        { value: "Office supplies", label: "Office supplies" },
        { value: "Art supplies", label: "Art supplies" },
        { value: "School supplies", label: "School supplies" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Furniture and home decor",
      label: "Furniture and home decor",
      subcategories: [
        { value: "Chairs", label: "Chairs" },
        { value: "Tables", label: "Tables" },
        { value: "Beds", label: "Beds" },
        { value: "Mattresses", label: "Mattresses" },
        { value: "Rugs", label: "Rugs" },
        { value: "Curtains", label: "Curtains" },
        { value: "Dining set", label: "Dining set" },
        { value: "Cupboards", label: "Cupboards" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Autoparts and accessories",
      label: "Autoparts and accessories",
      subcategories: [
        { value: "Vehicle spare parts", label: "Vehicle spare parts" },
        { value: "Car accessories", label: "Car accessories" },
        { value: "Car repair tools", label: "Car repair tools" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Building materials",
      label: "Building materials",
      subcategories: [
        { value: "Cement", label: "Cement" },
        { value: "Sand", label: "Sand" },
        { value: "Gravel", label: "Gravel" },
        { value: "Bricks", label: "Bricks" },
        { value: "Roofing materials", label: "Roofing materials" },
        { value: "Plumbing", label: "Plumbing" },
        { value: "Electric supplies", label: "Electric supplies" },
        { value: "Toilet building", label: "Toilet building" },
        { value: "Construction tools", label: "Construction tools" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Toys and children products",
      label: "Toys and children products",
      subcategories: [
        { value: "Dolls", label: "Dolls" },
        { value: "Action figures", label: "Action figures" },
        { value: "Stuffed animals", label: "Stuffed animals" },
        { value: "Educational toys", label: "Educational toys" },
        { value: "Games", label: "Games" },
        { value: "Baby care products", label: "Baby care products" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Books and media",
      label: "Books and media",
      subcategories: [
        { value: "Fiction books", label: "Fiction books" },
        { value: "Non-fiction books", label: "Non-fiction books" },
        { value: "Educational books", label: "Educational books" },
        { value: "Children books", label: "Children books" },
        { value: "Religious books", label: "Religious books" },
        { value: "Magazines", label: "Magazines" },
        { value: "Newspapers", label: "Newspapers" },
        { value: "DVDs and CDs", label: "DVDs and CDs" },
        { value: "Audiobooks", label: "Audiobooks" },
        { value: "Comics and manga", label: "Comics and manga" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Health and medical",
      label: "Health and medical",
      subcategories: [
        { value: "First aid supplies", label: "First aid supplies" },
        { value: "Medical devices", label: "Medical devices" },
        { value: "Vitamins and supplements", label: "Vitamins and supplements" },
        { value: "Personal care", label: "Personal care" },
        { value: "Dental care", label: "Dental care" },
        { value: "Eye care", label: "Eye care" },
        { value: "Hearing aids", label: "Hearing aids" },
        { value: "Mobility aids", label: "Mobility aids" },
        { value: "Health monitors", label: "Health monitors" },
        { value: "Prescription items", label: "Prescription items" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Travel and luggage",
      label: "Travel and luggage",
      subcategories: [
        { value: "Suitcases", label: "Suitcases" },
        { value: "Backpacks", label: "Backpacks" },
        { value: "Travel bags", label: "Travel bags" },
        { value: "Laptop bags", label: "Laptop bags" },
        { value: "Travel accessories", label: "Travel accessories" },
        { value: "Travel pillows", label: "Travel pillows" },
        { value: "Passport holders", label: "Passport holders" },
        { value: "Luggage locks", label: "Luggage locks" },
        { value: "Travel organizers", label: "Travel organizers" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Musical instruments",
      label: "Musical instruments",
      subcategories: [
        { value: "Guitars", label: "Guitars" },
        { value: "Keyboards and pianos", label: "Keyboards and pianos" },
        { value: "Drums", label: "Drums" },
        { value: "Wind instruments", label: "Wind instruments" },
        { value: "String instruments", label: "String instruments" },
        { value: "DJ equipment", label: "DJ equipment" },
        { value: "Recording equipment", label: "Recording equipment" },
        { value: "Music accessories", label: "Music accessories" },
        { value: "Traditional instruments", label: "Traditional instruments" },
        { value: "Sheet music", label: "Sheet music" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Jewelry and watches",
      label: "Jewelry and watches",
      subcategories: [
        { value: "Necklaces", label: "Necklaces" },
        { value: "Earrings", label: "Earrings" },
        { value: "Rings", label: "Rings" },
        { value: "Bracelets", label: "Bracelets" },
        { value: "Watches", label: "Watches" },
        { value: "Engagement rings", label: "Engagement rings" },
        { value: "Wedding bands", label: "Wedding bands" },
        { value: "Fashion jewelry", label: "Fashion jewelry" },
        { value: "Traditional jewelry", label: "Traditional jewelry" },
        { value: "Jewelry accessories", label: "Jewelry accessories" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Photography and cameras",
      label: "Photography and cameras",
      subcategories: [
        { value: "Digital cameras", label: "Digital cameras" },
        { value: "Film cameras", label: "Film cameras" },
        { value: "Camera lenses", label: "Camera lenses" },
        { value: "Tripods", label: "Tripods" },
        { value: "Camera bags", label: "Camera bags" },
        { value: "Memory cards", label: "Memory cards" },
        { value: "Lighting equipment", label: "Lighting equipment" },
        { value: "Photo frames", label: "Photo frames" },
        { value: "Photo albums", label: "Photo albums" },
        { value: "Video equipment", label: "Video equipment" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Garden and outdoor",
      label: "Garden and outdoor",
      subcategories: [
        { value: "Plants and seeds", label: "Plants and seeds" },
        { value: "Garden tools", label: "Garden tools" },
        { value: "Pots and planters", label: "Pots and planters" },
        { value: "Fertilizers", label: "Fertilizers" },
        { value: "Outdoor furniture", label: "Outdoor furniture" },
        { value: "BBQ and grills", label: "BBQ and grills" },
        { value: "Garden decor", label: "Garden decor" },
        { value: "Watering equipment", label: "Watering equipment" },
        { value: "Lawn care", label: "Lawn care" },
        { value: "Camping gear", label: "Camping gear" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Services",
      label: "Services",
      subcategories: [
        { value: "Cleaning services", label: "Cleaning services" },
        { value: "Repair services", label: "Repair services" },
        { value: "Tutoring", label: "Tutoring" },
        { value: "Photography services", label: "Photography services" },
        { value: "Event planning", label: "Event planning" },
        { value: "Transportation", label: "Transportation" },
        { value: "Home improvement", label: "Home improvement" },
        { value: "Beauty services", label: "Beauty services" },
        { value: "IT services", label: "IT services" },
        { value: "Consulting", label: "Consulting" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Office and business",
      label: "Office and business",
      subcategories: [
        { value: "Office furniture", label: "Office furniture" },
        { value: "Office supplies", label: "Office supplies" },
        { value: "Printers and scanners", label: "Printers and scanners" },
        { value: "Business equipment", label: "Business equipment" },
        { value: "Filing and storage", label: "Filing and storage" },
        { value: "Presentation equipment", label: "Presentation equipment" },
        { value: "Communication devices", label: "Communication devices" },
        { value: "Software", label: "Software" },
        { value: "Industrial equipment", label: "Industrial equipment" },
        { value: "Safety equipment", label: "Safety equipment" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Baby and maternity",
      label: "Baby and maternity",
      subcategories: [
        { value: "Baby clothing", label: "Baby clothing" },
        { value: "Baby gear", label: "Baby gear" },
        { value: "Baby feeding", label: "Baby feeding" },
        { value: "Diapers and wipes", label: "Diapers and wipes" },
        { value: "Baby furniture", label: "Baby furniture" },
        { value: "Maternity wear", label: "Maternity wear" },
        { value: "Baby toys", label: "Baby toys" },
        { value: "Baby safety", label: "Baby safety" },
        { value: "Strollers and car seats", label: "Strollers and car seats" },
        { value: "Nursing supplies", label: "Nursing supplies" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Food and beverages",
      label: "Food and beverages",
      subcategories: [
        { value: "Beverages", label: "Beverages" },
        { value: "Snacks", label: "Snacks" },
        { value: "Condiments and sauces", label: "Condiments and sauces" },
        { value: "Baking supplies", label: "Baking supplies" },
        { value: "Frozen foods", label: "Frozen foods" },
        { value: "Canned goods", label: "Canned goods" },
        { value: "Dairy products", label: "Dairy products" },
        { value: "Specialty foods", label: "Specialty foods" },
        { value: "International foods", label: "International foods" },
        { value: "Organic foods", label: "Organic foods" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Party and events",
      label: "Party and events",
      subcategories: [
        { value: "Party supplies", label: "Party supplies" },
        { value: "Decorations", label: "Decorations" },
        { value: "Birthday supplies", label: "Birthday supplies" },
        { value: "Wedding supplies", label: "Wedding supplies" },
        { value: "Holiday decorations", label: "Holiday decorations" },
        { value: "Balloons", label: "Balloons" },
        { value: "Party favors", label: "Party favors" },
        { value: "Catering supplies", label: "Catering supplies" },
        { value: "Event furniture", label: "Event furniture" },
        { value: "Entertainment", label: "Entertainment" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Antiques and collectibles",
      label: "Antiques and collectibles",
      subcategories: [
        { value: "Vintage items", label: "Vintage items" },
        { value: "Rare books", label: "Rare books" },
        { value: "Coins and stamps", label: "Coins and stamps" },
        { value: "Artwork", label: "Artwork" },
        { value: "Memorabilia", label: "Memorabilia" },
        { value: "Antique furniture", label: "Antique furniture" },
        { value: "Vintage clothing", label: "Vintage clothing" },
        { value: "Collectible toys", label: "Collectible toys" },
        { value: "Historical items", label: "Historical items" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Religious and spiritual",
      label: "Religious and spiritual",
      subcategories: [
        { value: "Religious books", label: "Religious books" },
        { value: "Prayer items", label: "Prayer items" },
        { value: "Religious clothing", label: "Religious clothing" },
        { value: "Spiritual jewelry", label: "Spiritual jewelry" },
        { value: "Religious art", label: "Religious art" },
        { value: "Meditation supplies", label: "Meditation supplies" },
        { value: "Candles and incense", label: "Candles and incense" },
        { value: "Religious music", label: "Religious music" },
        { value: "Ceremonial items", label: "Ceremonial items" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Pets and animals",
      label: "Pets and animals",
      subcategories: [
        { value: "Dogs", label: "Dogs" },
        { value: "Cats", label: "Cats" },
        { value: "Birds", label: "Birds" },
        { value: "Fish and aquariums", label: "Fish and aquariums" },
        { value: "Small animals", label: "Small animals" },
        { value: "Reptiles", label: "Reptiles" },
        { value: "Pet food", label: "Pet food" },
        { value: "Pet toys", label: "Pet toys" },
        { value: "Pet accessories", label: "Pet accessories" },
        { value: "Pet grooming", label: "Pet grooming" },
        { value: "Pet health", label: "Pet health" },
        { value: "Pet training", label: "Pet training" },
        { value: "Pet carriers", label: "Pet carriers" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Miscellaneous",
      label: "Miscellaneous",
      subcategories: [
        { value: "Gift cards", label: "Gift cards" },
        { value: "Tickets", label: "Tickets" },
        { value: "Vouchers", label: "Vouchers" },
        { value: "Craft supplies", label: "Craft supplies" },
        { value: "Hobby items", label: "Hobby items" },
        { value: "Seasonal items", label: "Seasonal items" },
        { value: "Novelty items", label: "Novelty items" },
        { value: "Custom items", label: "Custom items" },
        { value: "Bulk items", label: "Bulk items" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
    {
      value: "Adult",
      label: "Adult",
      subcategories: [
        { value: "Adult entertainment", label: "Adult entertainment" },
        { value: "Adult toys", label: "Adult toys" },
        { value: "Adult accessories", label: "Adult accessories" },
        { value: "Adult books and media", label: "Adult books and media" },
        { value: "Adult clothing", label: "Adult clothing" },
        { value: "Wellness products", label: "Wellness products" },
        { value: "Other", label: "Other (provide details)" },
      ],
    },
  ];

  // Generate category options for react-select
  const categoryOptions = CATEGORIES.map(category => ({
    value: category.value,
    label: category.label
  }));

  // Generate all subcategory options with category relationships
  const subCategoryOptions = [];
  CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subCategoryOptions.push({
        value: subcategory.value,
        label: subcategory.label,
        category: category.value
      });
    });
  });

  // Enhanced category options that include subcategory search capability
  const enhancedCategoryOptions = CATEGORIES.map(category => {
    // Get all subcategories for this category
    const subcategoriesForCategory = category.subcategories.map(sub => sub.label.toLowerCase());
    
    return {
      value: category.value,
      label: category.label,
      subcategories: subcategoriesForCategory
    };
  });

  // Custom filter function for category search
  const categoryFilterOption = (option, inputValue) => {
    if (!inputValue) return true;
    
    const searchTerm = inputValue.toLowerCase();
    
    // Search in category name
    if (option.label.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in subcategories for this category
    return option.data.subcategories.some(subcategory => 
      subcategory.includes(searchTerm)
    );
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unisex", label: "Unisex" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      borderBottom: `1.5px solid ${state.isFocused ? "#3b7bf8" : "#cbd5e1"}`,
      borderRadius: 0,
      background: "transparent",
      boxShadow: "none",
      paddingLeft: 0,
      minHeight: "38px",
      "&:hover": { borderBottomColor: "#3b7bf8" },
    }),
    valueContainer: (provided) => ({ ...provided, paddingLeft: 0 }),
    indicatorSeparator: () => ({ display: "none" }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "160px",
      overflowY: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 10,
      background: state.isSelected ? "#3b7bf8" : state.isFocused ? "#f1f5f9" : "#fff",
      color: state.isSelected ? "#fff" : "#212529",
    }),
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setFetchLoading(true);
      try {
        // Use environment variable or default to production
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${baseURL}/api/owner-products/${id}/`,
          { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        // Handle size as array (convert if it's a string)
        let sizeArray = response.data.size || [];
        if (typeof sizeArray === 'string') {
          // If size is returned as comma-separated string, split it
          sizeArray = sizeArray.split(',').map(s => s.trim()).filter(s => s);
        }

        setFormData({
          name: response.data.name || "",
          category: response.data.category || "",
          sub_category: response.data.sub_category || "",
          description: response.data.description || "",
          price: response.data.price || "",
          discount_percentage: response.data.discount_percentage || "",
          quantity: response.data.quantity || "",
          material_type: response.data.material_type || "",
          brand: response.data.brand || "",
          gender: response.data.gender || "",
          extra_fields: response.data.extra_fields || {},
        });

        // Restore size variants — prefer variants JSON, fall back to legacy size array
        if (response.data.variants && response.data.variants.length > 0) {
          setSizeVariants(response.data.variants.map(v => ({ size: v.size, qty: String(v.qty) })));
        } else if (sizeArray.length > 0) {
          // Legacy product: create one variant per size with equal qty split
          const perSize = Math.max(1, Math.floor((response.data.quantity || 1) / sizeArray.length));
          setSizeVariants(sizeArray.map(s => ({ size: s, qty: String(perSize) })));
        }

        // Load existing images as slots (images are objects with id + image_url)
        if (response.data.images && response.data.images.length > 0) {
          const slots = response.data.images
            .map(img => ({
              key: `existing-${img.id}`,
              type: "existing",
              url: img.image_url || img.image || "",
              serverId: img.id,
            }))
            .filter(s => s.url);
          setImageSlots(slots);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageSlots.length > 8) {
      toast.error("Maximum 8 images allowed");
      e.target.value = null;
      return;
    }
    const validFiles = [];
    const invalidFiles = [];
    files.forEach((file) => {
      if (file.size > 500 * 1024) {
        invalidFiles.push(file.name);
      } else if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    });
    if (invalidFiles.length > 0) {
      setOversizedFiles(invalidFiles);
    } else {
      setOversizedFiles([]);
    }
    const newSlots = validFiles.map(file => ({
      key: `new-${Date.now()}-${Math.random()}`,
      type: "new", url: URL.createObjectURL(file), file,
    }));
    setImageSlots(prev => [...prev, ...newSlots].slice(0, 8));
    setInvalidFields(prev => ({ ...prev, images: false }));
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImageSlots(prev => {
      const slot = prev[index];
      if (slot.type === "new" && slot.url.startsWith("blob:")) URL.revokeObjectURL(slot.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const moveSlot = (from, to) => {
    if (from === to) return;
    setImageSlots(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // ── Variant helpers ────────────────────────────────────────────────────────
  const addVariant = () => setSizeVariants(prev => [...prev, { size: "", qty: "" }]);
  const removeVariant = (i) => setSizeVariants(prev => prev.filter((_, idx) => idx !== i));
  const updateVariant = (i, field, value) => {
    setSizeVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v));
    setInvalidFields(prev => ({ ...prev, sizeVariants: false }));
  };

  const handleSelectChange = (name, selectedOption) => {
    if (name === "category") {
      setFormData(prev => ({
        ...prev,
        category: selectedOption?.value || "",
        sub_category: "",
        gender: "",
        extra_fields: {},
      }));
      setSizeVariants([{ size: "", qty: "" }]);
    } else if (name === "sub_category") {
      setFormData(prev => ({ ...prev, sub_category: selectedOption?.value || "", extra_fields: {} }));
      setSizeVariants([{ size: "", qty: "" }]);
      setInvalidFields(prev => ({ ...prev, sub_category: false }));
    } else {
      setFormData(prev => ({ ...prev, [name]: selectedOption?.value || "" }));
      setInvalidFields(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setInvalidFields(prev => ({ ...prev, [name]: false }));
  };

  const handleExtraFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, extra_fields: { ...prev.extra_fields, [key]: value } }));
    setInvalidFields(prev => ({ ...prev, [`extra_${key}`]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newInvalid = {};

    if (!formData.name) newInvalid.name = true;
    if (!formData.category) newInvalid.category = true;
    if (!formData.sub_category) newInvalid.sub_category = true;
    if (!formData.description) newInvalid.description = true;
    if (!formData.price) newInvalid.price = true;

    let validVariants = [];
    if (fieldConfig.sizeType !== "none") {
      validVariants = sizeVariants.filter(v => v.size && Number(v.qty) > 0);
      if (validVariants.length === 0) newInvalid.sizeVariants = true;
    } else {
      if (!formData.quantity) newInvalid.quantity = true;
    }

    if (fieldConfig.showMaterial && !formData.material_type) newInvalid.material_type = true;

    fieldConfig.extraFields.forEach(f => {
      if (f.required && !formData.extra_fields[f.key]) newInvalid[`extra_${f.key}`] = true;
    });

    if (imageSlots.length === 0) newInvalid.images = true;

    if (Object.keys(newInvalid).length > 0) {
      setInvalidFields(newInvalid);
      toast.error("Please fill all required fields and ensure at least one image");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("category", formData.category);
      dataToSend.append("sub_category", formData.sub_category);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", formData.price);
      dataToSend.append("discount_percentage", formData.discount_percentage || 0);
      if (formData.gender) dataToSend.append("gender", formData.gender);
      if (fieldConfig.showMaterial) dataToSend.append("material_type", formData.material_type || "");
      if (fieldConfig.showBrand && formData.brand) dataToSend.append("brand", formData.brand);

      if (fieldConfig.sizeType !== "none" && validVariants.length > 0) {
        const totalQty = validVariants.reduce((sum, v) => sum + Number(v.qty), 0);
        dataToSend.append("quantity", totalQty);
        dataToSend.append("size", validVariants.map(v => v.size).join(","));
        dataToSend.append("variants", JSON.stringify(validVariants.map(v => ({ size: v.size, qty: Number(v.qty) }))));
      } else {
        dataToSend.append("quantity", formData.quantity || 0);
        dataToSend.append("size", "");
        dataToSend.append("variants", JSON.stringify([]));
      }

      const extraData = {};
      fieldConfig.extraFields.forEach(f => {
        if (formData.extra_fields[f.key]) extraData[f.key] = formData.extra_fields[f.key];
      });
      dataToSend.append("extra_fields", JSON.stringify(extraData));

      // Send existing image IDs in the new display order, then any new files
      const existingSlots = imageSlots.filter(s => s.type === "existing");
      const newSlots = imageSlots.filter(s => s.type === "new");
      dataToSend.append("image_order", existingSlots.map(s => s.serverId).join(","));
      newSlots.forEach(s => dataToSend.append("images", s.file));

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");
      await axios.put(`${baseURL}/api/owner-products/${id}/`, dataToSend, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast.success("Product updated successfully!");
      setTimeout(() => navigate("/seller/products"), 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategoryOptions.filter(
    option => option.category === formData.category
  );

  const totalVariantQty = sizeVariants.reduce((sum, v) => sum + (Number(v.qty) || 0), 0);

  if (fetchLoading) {
    return (
      <>
        <Header />
        <div className="container" style={{ marginTop: "50px", paddingBottom: "50px" }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="text-muted">Loading product details...</h5>
                  <p className="text-muted mb-0">Please wait while we fetch your product information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        .ep-page { background: #fff; min-height: 100vh; }
        .ep-page .form-control,
        .ep-page .form-control:focus {
          border: none;
          border-bottom: 1.5px solid #cbd5e1;
          border-radius: 0;
          background: transparent;
          padding-left: 0;
          padding-right: 0;
          box-shadow: none;
          outline: none;
        }
        .ep-page .form-control:focus {
          border-bottom-color: #3b7bf8;
        }
        .ep-page .form-control.is-invalid {
          border-bottom-color: #dc3545;
        }
        .ep-page .form-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ep-page .img-thumbnail {
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
      `}</style>
      <div className="ep-page">
      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <h2 style={{ fontWeight: 700, fontSize: "22px", marginBottom: "24px", color: "#0f172a" }}>
              Edit Product
            </h2>
            <div>
                <form onSubmit={handleSubmit}>
                  {/* Product Name */}
                  <div className="form-group mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className={`form-control ${invalidFields.name ? "is-invalid" : ""}`}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                    />
                    {invalidFields.name && <div className="invalid-feedback">Product name is required</div>}
                  </div>

                  {/* Category */}
                  <div className="form-group mb-3">
                    <label className="form-label">Category *</label>
                    <Select
                      options={enhancedCategoryOptions}
                      value={enhancedCategoryOptions.find(opt => opt.value === formData.category)}
                      onChange={(selected) => handleSelectChange("category", selected)}
                      styles={customStyles}
                      isSearchable
                      filterOption={categoryFilterOption}
                      placeholder="Search by category or subcategory name..."
                      className={invalidFields.category ? "is-invalid" : ""}
                      isClearable
                    />
                    {invalidFields.category && <div className="invalid-feedback d-block">Category is required</div>}
                    <small className="text-muted">You can search by category name or any subcategory</small>
                  </div>

                  {/* Sub-Category */}
                  {formData.category && (
                    <div className="form-group mb-3">
                      <label className="form-label">Sub-Category *</label>
                      <Select
                        options={filteredSubCategories}
                        value={filteredSubCategories.find(opt => opt.value === formData.sub_category)}
                        onChange={(selected) => handleSelectChange("sub_category", selected)}
                        styles={customStyles}
                        isSearchable
                        placeholder="Select a subcategory"
                        className={invalidFields.sub_category ? "is-invalid" : ""}
                        isClearable
                      />
                      {invalidFields.sub_category && <div className="invalid-feedback d-block">Sub-category is required</div>}
                    </div>
                  )}

                  {/* Gender */}
                  {fieldConfig.showGender && (
                    <div className="form-group mb-3">
                      <label className="form-label">Gender</label>
                      <Select
                        options={genderOptions}
                        value={genderOptions.find(opt => opt.value === formData.gender) || null}
                        onChange={(selected) => handleSelectChange("gender", selected)}
                        styles={customStyles}
                        placeholder="Select gender (optional)"
                        isClearable
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="form-group mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${invalidFields.description ? "is-invalid" : ""}`}
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product in detail — features, condition, what's included, etc."
                    ></textarea>
                    {invalidFields.description && <div className="invalid-feedback">Description is required</div>}
                  </div>

                  {/* Price */}
                  <div className="form-group mb-3">
                    <label className="form-label">Price (₦) *</label>
                    <input
                      type="number"
                      className={`form-control ${invalidFields.price ? "is-invalid" : ""}`}
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {invalidFields.price && <div className="invalid-feedback">Price is required</div>}
                  </div>

                  {/* Discount */}
                  <div className="form-group mb-3">
                    <label className="form-label">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleInputChange}
                      placeholder="e.g. 10 for 10% off (leave blank for no discount)"
                      min="0"
                      max="100"
                      step="1"
                    />
                    {formData.discount_percentage > 0 && formData.price > 0 && (
                      <small style={{ color: "#16a34a", fontWeight: 600 }}>
                        Selling price: ₦{(parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100)).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        &nbsp;·&nbsp;
                        <span style={{ color: "#64748b", fontWeight: 400, textDecoration: "line-through" }}>
                          ₦{parseFloat(formData.price).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </small>
                    )}
                  </div>

                  {/* ── Size & Stock Variants ──────────────────────────────────────────────── */}
                  {fieldConfig.sizeType !== "none" ? (
                    <div className="form-group mb-4">
                      <label className="form-label">Size &amp; Stock Variants *</label>
                      <small className="d-block text-muted mb-2">
                        Each size can have its own stock count. Buyers will see exactly what's available.
                      </small>
                      {sizeVariants.map((variant, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px" }}>
                          <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                            <Select
                              options={sizeOptions}
                              value={sizeOptions.find(o => o.value === variant.size) || null}
                              onChange={sel => updateVariant(i, "size", sel?.value || "")}
                              styles={customStyles}
                              placeholder="Size"
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                            />
                          </div>
                          <div style={{ flex: "0 0 90px" }}>
                            <input
                              type="number"
                              className="form-control"
                              value={variant.qty}
                              onChange={e => updateVariant(i, "qty", e.target.value)}
                              placeholder="Qty"
                              min="0"
                            />
                          </div>
                          {sizeVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(i)}
                              style={{ flex: "none", background: "none", border: "none", color: "#ef4444", fontSize: "18px", padding: "6px", lineHeight: 1, cursor: "pointer" }}
                              title="Remove this size"
                            >×</button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addVariant}
                        style={{ fontSize: "13px", color: "#3b7bf8", background: "none", border: "1px dashed #3b7bf8", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", marginTop: "4px" }}
                      >
                        + Add Size
                      </button>
                      {invalidFields.sizeVariants && (
                        <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "6px" }}>
                          Add at least one size with a quantity greater than 0
                        </div>
                      )}
                      {totalVariantQty > 0 && (
                        <small className="text-muted d-block mt-1">
                          Total stock: <strong>{totalVariantQty}</strong> units across {sizeVariants.filter(v => v.size && Number(v.qty) > 0).length} size(s)
                        </small>
                      )}
                    </div>
                  ) : (
                    <div className="form-group mb-3">
                      <label className="form-label">Quantity in Stock *</label>
                      <input
                        type="number"
                        className={`form-control ${invalidFields.quantity ? "is-invalid" : ""}`}
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                      {invalidFields.quantity && <div className="invalid-feedback">Quantity is required</div>}
                    </div>
                  )}

                  {/* Material Type */}
                  {fieldConfig.showMaterial && (
                    <div className="form-group mb-3">
                      <label className="form-label">Material Type *</label>
                      <input
                        type="text"
                        className={`form-control ${invalidFields.material_type ? "is-invalid" : ""}`}
                        name="material_type"
                        value={formData.material_type}
                        onChange={handleInputChange}
                        placeholder="e.g., 100% Cotton, Genuine Leather, Stainless Steel"
                      />
                      {invalidFields.material_type && <div className="invalid-feedback">Material type is required</div>}
                    </div>
                  )}

                  {/* Brand */}
                  {fieldConfig.showBrand && (
                    <div className="form-group mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Samsung, Nike, Unbranded"
                      />
                    </div>
                  )}

                  {/* ── Category-specific extra fields ────────────────────────────────────── */}
                  {fieldConfig.extraFields.length > 0 && (
                    <div className="mb-1">
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {formData.sub_category || formData.category} Details
                        </span>
                      </div>
                      {fieldConfig.extraFields.map(field => (
                        <div key={field.key} className="form-group mb-3">
                          <label className="form-label">
                            {field.label}{field.required ? " *" : ""}
                          </label>
                          {field.type === "select" ? (
                            <>
                              <Select
                                options={field.options.map(o => ({ value: o, label: o }))}
                                value={formData.extra_fields[field.key] ? { value: formData.extra_fields[field.key], label: formData.extra_fields[field.key] } : null}
                                onChange={sel => handleExtraFieldChange(field.key, sel?.value || "")}
                                styles={customStyles}
                                placeholder={`Select ${field.label.toLowerCase()}`}
                                isClearable
                                className={invalidFields[`extra_${field.key}`] ? "is-invalid" : ""}
                              />
                              {invalidFields[`extra_${field.key}`] && (
                                <div className="invalid-feedback d-block">{field.label} is required</div>
                              )}
                            </>
                          ) : (
                            <input
                              type="text"
                              className={`form-control ${invalidFields[`extra_${field.key}`] ? "is-invalid" : ""}`}
                              value={formData.extra_fields[field.key] || ""}
                              onChange={e => handleExtraFieldChange(field.key, e.target.value)}
                              placeholder={field.placeholder || ""}
                            />
                          )}
                          {field.type !== "select" && invalidFields[`extra_${field.key}`] && (
                            <div className="invalid-feedback">{field.label} is required</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image Upload */}
                  <div className="form-group mb-3">
                    <label className="form-label">Product Images * (Max 8, 500KB each)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className={`form-control ${invalidFields.images ? "is-invalid" : ""}`}
                      onChange={handleImageChange}
                    />
                    {invalidFields.images && <div className="invalid-feedback">At least one image is required</div>}
                    <small className="text-muted">
                      {imageSlots.length} of 8 images
                      {imageSlots.filter(s => s.type === "existing").length > 0 && (
                        ` · ${imageSlots.filter(s => s.type === "existing").length} saved, ${imageSlots.filter(s => s.type === "new").length} new`
                      )}
                    </small>
                  </div>

                  {/* Oversized file instructions */}
                  {oversizedFiles.length > 0 && (
                    <div style={{
                      marginBottom: "16px",
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: "10px",
                      padding: "14px 16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#9a3412" }}>
                            {oversizedFiles.length === 1 ? "1 image" : `${oversizedFiles.length} images`} too large — each must be under 500 KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOversizedFiles([])}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#9a3412", fontSize: "18px", lineHeight: 1, padding: "0 0 0 8px", flexShrink: 0 }}
                        >×</button>
                      </div>
                      <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#7c2d12", fontWeight: 600 }}>
                        Rejected: <span style={{ fontWeight: 400 }}>{oversizedFiles.join(", ")}</span>
                      </p>
                      <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#7c2d12" }}>
                        Here's how to reduce your image size before uploading:
                      </p>
                      <ol style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#7c2d12", lineHeight: 1.75 }}>
                        <li><strong>Squoosh (recommended):</strong> Go to <strong>squoosh.app</strong> in your browser — drag your photo in, reduce quality to ~75% or resize to max 1200px wide, then download.</li>
                        <li><strong>TinyPNG / TinyJPG:</strong> Visit <strong>tinypng.com</strong> — drag and drop your image, it compresses automatically, then download the result.</li>
                        <li><strong>On iPhone:</strong> Before uploading, open the photo in the Files app, tap Share → Save to Files as a smaller size — or use a free app like "Image Size".</li>
                        <li><strong>On Android:</strong> Use Google Photos → tap the image → Edit → resize or use a free "Photo Compress" app from the Play Store.</li>
                      </ol>
                    </div>
                  )}

                  {/* Image Previews — drag to reorder */}
                  {imageSlots.length > 0 && (
                    <div className="mb-4">
                      <label className="form-label" style={{ marginBottom: "6px" }}>
                        Image Order
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 400, marginLeft: "8px" }}>
                          Drag to reorder · First image is the main photo
                        </span>
                      </label>
                      <div className="row g-2 mt-1">
                        {imageSlots.map((slot, index) => (
                          <div
                            key={slot.key}
                            className="col-6 col-md-4 col-lg-3"
                            draggable
                            onDragStart={() => { dragIdx.current = index; }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => { moveSlot(dragIdx.current, index); dragIdx.current = null; }}
                            style={{ cursor: "grab" }}
                          >
                            <div style={{
                              position: "relative", borderRadius: "8px", overflow: "hidden",
                              border: index === 0 ? "2.5px solid #2563eb" : "2px solid #e2e8f0",
                            }}>
                              <img
                                src={slot.url}
                                alt={`Image ${index + 1}`}
                                style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
                                onError={e => { e.target.src = "/OIP.png"; }}
                              />
                              {index === 0 && (
                                <div style={{
                                  position: "absolute", bottom: 0, left: 0, right: 0,
                                  background: "rgba(37,99,235,0.88)", color: "#fff",
                                  fontSize: "9px", fontWeight: 700, textAlign: "center", padding: "3px 0", letterSpacing: "0.5px",
                                }}>
                                  MAIN PHOTO
                                </div>
                              )}
                              <div style={{
                                position: "absolute", top: "4px", left: "4px",
                                background: "rgba(0,0,0,0.55)", color: "#fff",
                                borderRadius: "4px", fontSize: "10px", fontWeight: 700, padding: "1px 5px",
                              }}>
                                {index + 1}
                              </div>
                              {slot.type === "new" && (
                                <div style={{
                                  position: "absolute", bottom: index === 0 ? "18px" : "4px", left: "4px",
                                  background: "rgba(16,185,129,0.9)", color: "#fff",
                                  borderRadius: "4px", fontSize: "9px", fontWeight: 700, padding: "1px 5px",
                                }}>
                                  NEW
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                  position: "absolute", top: "4px", right: "4px",
                                  width: "20px", height: "20px", borderRadius: "50%",
                                  background: "rgba(0,0,0,0.6)", border: "none", color: "#fff",
                                  cursor: "pointer", display: "flex", alignItems: "center",
                                  justifyContent: "center", fontSize: "14px", lineHeight: 1, padding: 0,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <ToastContainer position="bottom-center" />

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2 justify-content-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #d1d5db",
                        borderRadius: "7px",
                        padding: "8px 20px",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/product/${id}`)}
                      disabled={loading}
                    >
                      View Product
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating Product...
                        </>
                      ) : (
                        <>Update Product</>

                      )}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProduct;