import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sub_category: "",
    description: "",
    price: "",
    quantity: "",
    material_type: "",
    brand: "",
    size: [],
    gender: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

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

  const sizeOptions = [
    { value: "XS", label: "Extra Small" },
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "Extra Large" },
    { value: "XXL", label: "2XL" },
    { value: "XXXL", label: "3XL" },
    { value: "4XL", label: "4XL" },
    { value: "5XL", label: "5XL" },
    { value: "6XL", label: "6XL" },
    { value: "Free Size", label: "Free Size" },

    // Shoe Sizes
    { value: "EU 36", label: "EU 36" },
    { value: "EU 37", label: "EU 37" },
    { value: "EU 38", label: "EU 38" },
    { value: "EU 39", label: "EU 39" },
    { value: "EU 40", label: "EU 40" },
    { value: "EU 41", label: "EU 41" },
    { value: "EU 42", label: "EU 42" },
    { value: "EU 43", label: "EU 43" },
    { value: "EU 44", label: "EU 44" },
    { value: "EU 45", label: "EU 45" },
    { value: "EU 46", label: "EU 46" },
    { value: "US 6", label: "US 6" },
    { value: "US 7", label: "US 7" },
    { value: "US 8", label: "US 8" },
    { value: "US 9", label: "US 9" },
    { value: "US 10", label: "US 10" },
    { value: "US 11", label: "US 11" },
    { value: "US 12", label: "US 12" },

    // Kids Sizes
    { value: "0-3M", label: "0-3 Months" },
    { value: "3-6M", label: "3-6 Months" },
    { value: "6-12M", label: "6-12 Months" },
    { value: "1-2Y", label: "1-2 Years" },
    { value: "2-3Y", label: "2-3 Years" },
    { value: "3-4Y", label: "3-4 Years" },
    { value: "4-5Y", label: "4-5 Years" },
    { value: "5-6Y", label: "5-6 Years" },
    { value: "6-7Y", label: "6-7 Years" },
    { value: "7-8Y", label: "7-8 Years" },
    { value: "8-9Y", label: "8-9 Years" },
    { value: "9-10Y", label: "9-10 Years" },

    { value: "Custom", label: "Custom (Specify in Description)" },
  ];

  const customStyles = {
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
    }),
    option: (provided) => ({
      ...provided,
      padding: 10,
    }),
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://inspiring-spontaneity-production.up.railway.app/api/owner-products/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
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
          quantity: response.data.quantity || "",
          material_type: response.data.material_type || "",
          brand: response.data.brand || "",
          size: sizeArray,
          gender: response.data.gender || "",
        });

        // Handle existing images - don't treat them as preview URLs that get revoked
        if (response.data.images && response.data.images.length > 0) {
          // Ensure all images are strings (URLs)
          const imageUrls = response.data.images.filter(img => img && typeof img === 'string');
          setExistingImages(imageUrls);
          setPreviewUrls(imageUrls); // Show existing images in preview
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrorMessage("Failed to load product details");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Only revoke blob URLs for new files, not existing images
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleImageChange = (e) => {
    setErrorMessage("");
    const files = Array.from(e.target.files);
    
    const totalImages = existingImages.length + imageFiles.length + files.length;
    if (totalImages > 8) {
      setErrorMessage("Maximum 8 images allowed");
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
      setErrorMessage(`Uh-oh, The file ${invalidFiles.join(", ")} exceeds 500KB`);
    }

    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);
    
    // Combine existing images with new file previews
    const newFilePreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...existingImages, ...newFilePreviews]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    const totalExistingImages = existingImages.length;
    
    if (index < totalExistingImages) {
      // Removing an existing image
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      
      // Update preview URLs
      const newFilePreviews = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...newExistingImages, ...newFilePreviews]);
    } else {
      // Removing a new file
      const fileIndex = index - totalExistingImages;
      const newFiles = [...imageFiles];
      const removedFile = newFiles.splice(fileIndex, 1)[0];
      setImageFiles(newFiles);
      
      // Revoke the blob URL for the removed file
      const blobUrl = previewUrls[index];
      if (blobUrl && typeof blobUrl === 'string' && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
      
      // Update preview URLs
      const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...existingImages, ...newFilePreviews]);
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    if (name === "category") {
      setFormData(prev => ({
        ...prev,
        category: selectedOption?.value || "",
        sub_category: "",
        gender: ""
      }));
    } else if (name === "size") {
      // Handle multi-select for size
      const values = selectedOption ? selectedOption.map(opt => opt.value) : [];
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
      setInvalidFields(prev => ({ ...prev, [name]: false }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: selectedOption?.value || ""
      }));
      setInvalidFields(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setInvalidFields(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setInvalidFields({});

    const requiredFields = [
      "name", "category", "sub_category", "description",
      "price", "quantity", "material_type", "brand", "size"
    ];

    const newInvalidFields = requiredFields.reduce((acc, field) => {
      if (!formData[field] || (field === "size" && formData[field].length === 0)) acc[field] = true;
      return acc;
    }, {});

    // Check if we have at least one image (existing or new)
    const totalImages = existingImages.length + imageFiles.length;
    if (Object.keys(newInvalidFields).length > 0 || totalImages === 0) {
      setInvalidFields({ ...newInvalidFields, images: totalImages === 0 });
      setErrorMessage("Please fill all required fields and ensure at least one image");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const dataToSend = new FormData();

      // Append all regular fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "size") {
          dataToSend.append(key, value);
        }
      });

      // Append sizes correctly
      formData.size.forEach(size => {
        dataToSend.append("size", size);
      });

      // Append existing images to keep
      existingImages.forEach(imageUrl => {
        dataToSend.append("existing_images", imageUrl);
      });

      // Append new images
      imageFiles.forEach(file => {
        dataToSend.append("images", file);
      });

      await axios.put(`https://inspiring-spontaneity-production.up.railway.app/api/owner-products/${id}/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Product updated successfully!");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategoryOptions.filter(
    option => option.category === formData.category
  );

  const showGenderDropdown = [
    "Clothing materials",
    "Body accessories",
    "Cosmetic and beauty products",
    "Jewelry and watches"
  ].includes(formData.category);

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
      <div className="container" style={{ marginTop: "10px", paddingBottom: "50px" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h2 className="mb-0">
                  <i className="fas fa-edit me-2"></i>
                  Edit Product
                </h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Product Name */}
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-tag me-2"></i>
                      Product Name *
                    </label>
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
                    <label className="form-label fw-semibold">
                      <i className="fas fa-th-large me-2"></i>
                      Category *
                    </label>
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
                      <label className="form-label fw-semibold">
                        <i className="fas fa-list me-2"></i>
                        Sub-Category *
                      </label>
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
                  {showGenderDropdown && (
                    <div className="form-group mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-venus-mars me-2"></i>
                        Gender *
                      </label>
                      <Select
                        options={genderOptions}
                        value={genderOptions.find(opt => opt.value === formData.gender)}
                        onChange={(selected) => handleSelectChange("gender", selected)}
                        styles={customStyles}
                        isSearchable
                        placeholder="Select gender"
                        className={invalidFields.gender ? "is-invalid" : ""}
                        isClearable
                      />
                      {invalidFields.gender && <div className="invalid-feedback d-block">Gender is required for this category</div>}
                    </div>
                  )}

                  {/* Description */}
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-align-left me-2"></i>
                      Description *
                    </label>
                    <textarea
                      className={`form-control ${invalidFields.description ? "is-invalid" : ""}`}
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product in detail..."
                    ></textarea>
                    {invalidFields.description && <div className="invalid-feedback">Description is required</div>}
                    <small className="text-muted">Include key features, materials, dimensions, and any other relevant details</small>
                  </div>

                  {/* Price and Quantity Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-naira-sign me-2"></i>
                          Price (₦) *
                        </label>
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
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-boxes me-2"></i>
                          Quantity *
                        </label>
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
                    </div>
                  </div>

                  {/* Material Type and Brand Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-cube me-2"></i>
                          Material Type *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${invalidFields.material_type ? "is-invalid" : ""}`}
                          name="material_type"
                          value={formData.material_type}
                          onChange={handleInputChange}
                          placeholder="e.g., Cotton, Plastic, Metal"
                        />
                        {invalidFields.material_type && <div className="invalid-feedback">Material type is required</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-certificate me-2"></i>
                          Brand *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${invalidFields.brand ? "is-invalid" : ""}`}
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          placeholder="Enter brand name"
                        />
                        {invalidFields.brand && <div className="invalid-feedback">Brand is required</div>}
                      </div>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-ruler me-2"></i>
                      Available Sizes *
                    </label>
                    <Select
                      options={sizeOptions}
                      isMulti
                      value={sizeOptions.filter(opt => formData.size.includes(opt.value))}
                      onChange={(selected) => handleSelectChange("size", selected)}
                      styles={customStyles}
                      isSearchable
                      placeholder="Select available sizes"
                      className={invalidFields.size ? "is-invalid" : ""}
                    />
                    {invalidFields.size && <div className="invalid-feedback d-block">At least one size is required</div>}
                    <small className="text-muted">Select all sizes available for this product</small>
                  </div>

                  {/* Image Upload */}
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-images me-2"></i>
                      Product Images * (Max 8, 500KB each)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className={`form-control ${invalidFields.images ? "is-invalid" : ""}`}
                      onChange={handleImageChange}
                    />
                    {invalidFields.images && <div className="invalid-feedback">At least one image is required</div>}
                    <div className="mt-2">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        {existingImages.length + imageFiles.length} of 8 images total
                      </small>
                      {existingImages.length > 0 && (
                        <span className="text-info ms-2">
                          <i className="fas fa-images me-1"></i>
                          {existingImages.length} existing, {imageFiles.length} new
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-eye me-2"></i>
                        Current Images:
                      </label>
                      <div className="row g-2 mt-1">
                        {previewUrls.map((url, index) => (
                          <div key={url} className="col-6 col-md-4 col-lg-3">
                            <div className="position-relative">
                              <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="img-thumbnail w-100"
                                style={{ height: "120px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                onClick={() => removeImage(index)}
                                title="Remove image"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              <div className="position-absolute bottom-0 start-0 m-1">
                                {index < existingImages.length ? (
                                  <span className="badge bg-primary">
                                    <i className="fas fa-image me-1"></i>
                                    Existing
                                  </span>
                                ) : (
                                  <span className="badge bg-success">
                                    <i className="fas fa-plus me-1"></i>
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="position-absolute top-0 start-0 bg-dark text-white px-2 py-1 m-1 rounded">
                                <small>{index + 1}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errorMessage}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="alert alert-success mb-3" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {successMessage}
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-md-2"
                      onClick={() => navigate("/")}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary me-md-2"
                      onClick={() => navigate(`/product/${id}`)}
                      disabled={loading}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Product
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-warning"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating Product...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Product
                        </>
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