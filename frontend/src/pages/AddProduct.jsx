import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
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

  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Category and Subcategory Options
  const categoryOptions = [
    { value: "Clothing materials", label: "Clothing materials" },
    { value: "Body accessories", label: "Body accessories" },
    { value: "Household items", label: "Household items" },
    { value: "Gym and workout equipment", label: "Gym and workout equipment" },
    { value: "Electronics and appliances", label: "Electronics and appliances" },
    { value: "agriculture, food, and groceries", label: "agriculture, food, and groceries" },
    { value: "Cosmetic and beauty products", label: "Cosmetic and beauty products" },
    { value: "Arts and craft", label: "Arts and craft" },
    { value: "Stationery", label: "Stationery" },
    { value: "Furniture and home decor", label: "Furniture and home decor" },
    { value: "Autoparts and accessories", label: "Autoparts and accessories" },
    { value: "Building materials", label: "Building materials" },
    { value: "Toys and children products", label: "Toys and children products" },
    { value: "Miscellaneous", label: "Miscellaneous" },
    { value: "Animal pets", label: "Animal pets" },
    { value: "Adult", label: "Adult" },
  ];

  const subCategoryOptions = [
    { value: "Traditional materials", label: "Traditional materials", category: "Clothing materials" },
    { value: "African prints", label: "African prints", category: "Clothing materials" },
    { value: "Aso-ebi", label: "Aso-ebi", category: "Clothing materials" },
    { value: "Wrappers", label: "Wrappers", category: "Clothing materials" },
    { value: "Shirts", label: "Shirts", category: "Clothing materials" },
    { value: "Baby wears", label: "Baby wears", category: "Clothing materials" },
    { value: "Sweatshirts", label: "Sweatshirts", category: "Clothing materials" },
    { value: "Hoodies", label: "Hoodies", category: "Clothing materials" },
    { value: "Trousers", label: "Trousers", category: "Clothing materials" },
    { value: "Joggers", label: "Joggers", category: "Clothing materials" },
    { value: "Shorts", label: "Shorts", category: "Clothing materials" },
    { value: "Gym wears", label: "Gym wears", category: "Clothing materials" },
    { value: "Underwears", label: "Underwears", category: "Clothing materials" },
    { value: "Dresses", label: "Dresses", category: "Clothing materials" },
    { value: "Socks", label: "Socks", category: "Clothing materials" },
    { value: "Headwears", label: "Headwears", category: "Clothing materials" },
    { value: "Shoes", label: "Shoes", category: "Clothing materials" },
    { value: "Slippers", label: "Slippers", category: "Clothing materials" },
    { value: "Jewelry", label: "Jewelry", category: "Clothing materials" },
    { value: "Other", label: "Other (provide details)", category: "Clothing materials" },
    { value: "Handbags", label: "Handbags", category: "Body accessories" },
    { value: "Purses", label: "Purses", category: "Body accessories" },
    { value: "Wallets", label: "Wallets", category: "Body accessories" },
    { value: "Belts", label: "Belts", category: "Body accessories" },
    { value: "Handwears", label: "Handwears", category: "Body accessories" },
    { value: "Eyewear", label: "Eyewear", category: "Body accessories" },
    { value: "Other", label: "Other (provide details)", category: "Body accessories" },
    { value: "Kitchenware", label: "Kitchenware", category: "Household items" },
    { value: "Cookware", label: "Cookware", category: "Household items" },
    { value: "Plastic containers", label: "Plastic containers", category: "Household items" },
    { value: "Storage bins", label: "Storage bins", category: "Household items" },
    { value: "Cleaning supplies", label: "Cleaning supplies", category: "Household items" },
    { value: "Other", label: "Other (provide details)", category: "Household items" },
    { value: "Mobile phones", label: "Mobile phones", category: "Electronics and appliances" },
    { value: "Television", label: "Television", category: "Electronics and appliances" },
    { value: "DVD players", label: "DVD players", category: "Electronics and appliances" },
    { value: "Home theaters", label: "Home theaters", category: "Electronics and appliances" },
    { value: "Air conditioners", label: "Air conditioners", category: "Electronics and appliances" },
    { value: "Freezers", label: "Freezers", category: "Electronics and appliances" },
    { value: "Fan", label: "Fan", category: "Electronics and appliances" },
    { value: "Pressing iron", label: "Pressing iron", category: "Electronics and appliances" },
    { value: "Lights", label: "Lights", category: "Electronics and appliances" },
    { value: "Desktops", label: "Desktops", category: "Electronics and appliances" },
    { value: "Laptops", label: "Laptops", category: "Electronics and appliances" },
    { value: "Musical instruments", label: "Musical instruments", category: "Electronics and appliances" },
    { value: "Headphones", label: "Headphones", category: "Electronics and appliances" },
    { value: "Digital watches", label: "Digital watches", category: "Electronics and appliances" },
    { value: "Video games", label: "Video games", category: "Electronics and appliances" },
    { value: "Other", label: "Other (provide details)", category: "Electronics and appliances" },
    { value: "Fresh fruits", label: "Fresh fruits", category: "agriculture, food, and groceries" },
    { value: "Vegetables", label: "Vegetables", category: "agriculture, food, and groceries" },
    { value: "Grains", label: "Grains", category: "agriculture, food, and groceries" },
    { value: "Pulses", label: "Pulses", category: "agriculture, food, and groceries" },
    { value: "Legumes", label: "Legumes", category: "agriculture, food, and groceries" },
    { value: "Spices", label: "Spices", category: "agriculture, food, and groceries" },
    { value: "Herbs", label: "Herbs", category: "agriculture, food, and groceries" },
    { value: "Seasoning", label: "Seasoning", category: "agriculture, food, and groceries" },
    { value: "Meat", label: "Meat", category: "agriculture, food, and groceries" },
    { value: "Poultry", label: "Poultry", category: "agriculture, food, and groceries" },
    { value: "Fish", label: "Fish", category: "agriculture, food, and groceries" },
    { value: "Packaged foods", label: "Packaged foods", category: "agriculture, food, and groceries" },
    { value: "Buscuits", label: "Buscuits", category: "agriculture, food, and groceries" },
    { value: "Other", label: "Other (provide details)", category: "agriculture, food, and groceries" },
    { value: "Skincare", label: "Skincare", category: "Cosmetic and beauty products" },
    { value: "Haircare", label: "Haircare", category: "Cosmetic and beauty products" },
    { value: "Mouthcare", label: "Mouthcare", category: "Cosmetic and beauty products" },
    { value: "Makeups", label: "Makeups", category: "Cosmetic and beauty products" },
    { value: "Perfumes", label: "Perfumes", category: "Cosmetic and beauty products" },
    { value: "Other", label: "Other (provide details)", category: "Cosmetic and beauty products" },
    { value: "Hancrafted sculptures", label: "Hancrafted sculptures", category: "Arts and craft" },
    { value: "Carvings", label: "Carvings", category: "Arts and craft" },
    { value: "Paintings", label: "Paintings", category: "Arts and craft" },
    { value: "Drawings", label: "Drawings", category: "Arts and craft" },
    { value: "Artworks", label: "Artworks", category: "Arts and craft" },
    { value: "Beadworks", label: "Beadworks", category: "Arts and craft" },
    { value: "Traditional musical instruments", label: "Traditional musical instruments", category: "Arts and craft" },
    { value: "Flowers", label: "Flowers", category: "Arts and craft" },
    { value: "Other", label: "Other (provide details)", category: "Arts and craft" },
    { value: "Writing materials", label: "Writing materials", category: "Stationery" },
    { value: "Office supplies", label: "Office supplies", category: "Stationery" },
    { value: "Art supplies", label: "Art supplies", category: "Stationery" },
    { value: "School supplies", label: "School supplies", category: "Stationery" },
    { value: "Other", label: "Other (provide details)", category: "Stationery" },
    { value: "Chairs", label: "Chairs", category: "Furniture and home decor" },
    { value: "Tables", label: "Tables", category: "Furniture and home decor" },
    { value: "Beds", label: "Beds", category: "Furniture and home decor" },
    { value: "Mattresses", label: "Mattresses", category: "Furniture and home decor" },
    { value: "Rugs", label: "Rugs", category: "Furniture and home decor" },
    { value: "Curtains", label: "Curtains", category: "Furniture and home decor" },
    { value: "Dining set", label: "Dining set", category: "Furniture and home decor" },
    { value: "Cupboards", label: "Cupboards", category: "Furniture and home decor" },
    { value: "Other", label: "Other (provide details)", category: "Furniture and home decor" },
    { value: "Vehicle spare parts", label: "Vehicle spare parts", category: "Autoparts and accessories" },
    { value: "Car accessories", label: "Car accessories", category: "Autoparts and accessories" },
    { value: "Car repair tools", label: "Car repair tools", category: "Autoparts and accessories" },
    { value: "Other", label: "Other (provide details)", category: "Autoparts and accessories" },
    { value: "Cement", label: "Cement", category: "Building materials" },
    { value: "Sand", label: "Sand", category: "Building materials" },
    { value: "Gravel", label: "Gravel", category: "Building materials" },
    { value: "Bricks", label: "Bricks", category: "Building materials" },
    { value: "Roofing materials", label: "Roofing materials", category: "Building materials" },
    { value: "Plumbing", label: "Plumbing", category: "Building materials" },
    { value: "Electric supplies", label: "Electric supplies", category: "Building materials" },
    { value: "Toilet building", label: "Toilet building", category: "Building materials" },
    { value: "Construction tools", label: "Construction tools", category: "Building materials" },
    { value: "Other", label: "Other (provide details)", category: "Building materials" },
    { value: "Dolls", label: "Dolls", category: "Toys and children products" },
    { value: "Action figures", label: "Action figures", category: "Toys and children products" },
    { value: "Stuffed animals", label: "Stuffed animals", category: "Toys and children products" },
    { value: "Educational toys", label: "Educational toys", category: "Toys and children products" },
    { value: "Games", label: "Games", category: "Toys and children products" },
    { value: "Baby care products", label: "Baby care products", category: "Toys and children products" },
    { value: "Other", label: "Other (provide details)", category: "Miscellaneous" },
    { value: "Sex toys", label: "Sex toys", category: "Adult" },
    { value: "Lubricants", label: "Lubricants", category: "Adult" },
    { value: "Other", label: "Other (provide details)", category: "Adult" },
    { value: "Pets", label: "Pets", category: "Animal pets" },
    { value: "Pet food", label: "Pet food", category: "Animal pets" },
    { value: "Other", label: "Other (provide details)", category: "Animal pets" },
  ];

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
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (e) => {
    setErrorMessage("");
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 8) {
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
      setErrorMessage(`Uh-oh, The file ${invalidFiles.join(", ")}  exceeds 500KB`);
    }
    

    const newFiles = [...imageFiles, ...validFiles].slice(0, 8);
    setImageFiles(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
    e.target.value = null;
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setImageFiles(newFiles);
    setPreviewUrls(newUrls);
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

    if (Object.keys(newInvalidFields).length > 0 || imageFiles.length === 0) {
      setInvalidFields({ ...newInvalidFields, images: imageFiles.length === 0 });
      setErrorMessage("Please fill all required fields");
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

      // Append images
      imageFiles.forEach(file => {
        dataToSend.append("images", file);
      });

      await axios.post("https://inspiring-spontaneity-production.up.railway.app/api/owner-products/", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Product added successfully!");
      setFormData({
        name: "",
        category: "",
        sub_category: "",
        description: "",
        price: "",
        quantity: "",
        material_type: "",
        brand: "",
        size: [], // Reset size to an empty array
        gender: "",
      });
      setImageFiles([]);
      setPreviewUrls([]);
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage(error.response?.data?.message || "Failed to add product");
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
    "Cosmetic and beauty products"
  ].includes(formData.category);

  return (
    <>

      <div className="container" style={{ marginTop: "10px", paddingBottom: "50px" }}>
        <h2>Add Product</h2>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group mb-3">
            <label>Product Name</label>
            <input
              type="text"
              className={`form-control ${invalidFields.name ? "is-invalid" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {invalidFields.name && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Category */}
          <div className="form-group mb-3">
            <label>Category</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(opt => opt.value === formData.category)}
              onChange={(selected) => handleSelectChange("category", selected)}
              styles={customStyles}
              isSearchable
              className={invalidFields.category ? "is-invalid" : ""}
            />
            {invalidFields.category && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Sub-Category */}
          {formData.category && (
            <div className="form-group mb-3">
              <label>Sub-Category</label>
              <Select
                options={filteredSubCategories}
                value={filteredSubCategories.find(opt => opt.value === formData.sub_category)}
                onChange={(selected) => handleSelectChange("sub_category", selected)}
                styles={customStyles}
                isSearchable
                className={invalidFields.sub_category ? "is-invalid" : ""}
              />
              {invalidFields.sub_category && <div className="invalid-feedback">Required field</div>}
            </div>
          )}

          {/* Gender */}
          {showGenderDropdown && (
            <div className="form-group mb-3">
              <label>Gender</label>
              <Select
                options={genderOptions}
                value={genderOptions.find(opt => opt.value === formData.gender)}
                onChange={(selected) => handleSelectChange("gender", selected)}
                styles={customStyles}
                isSearchable
                className={invalidFields.gender ? "is-invalid" : ""}
              />
              {invalidFields.gender && <div className="invalid-feedback">Required field</div>}
            </div>
          )}

          {/* Description */}
          <div className="form-group mb-3">
            <label>Description</label>
            <textarea
              className={`form-control ${invalidFields.description ? "is-invalid" : ""}`}
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            {invalidFields.description && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Price */}
          <div className="form-group mb-3">
            <label>Price (₦)</label>
            <input
              type="number"
              className={`form-control ${invalidFields.price ? "is-invalid" : ""}`}
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
            {invalidFields.price && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Quantity */}
          <div className="form-group mb-3">
            <label>Quantity</label>
            <input
              type="number"
              className={`form-control ${invalidFields.quantity ? "is-invalid" : ""}`}
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            {invalidFields.quantity && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Material Type */}
          <div className="form-group mb-3">
            <label>Material Type</label>
            <input
              type="text"
              className={`form-control ${invalidFields.material_type ? "is-invalid" : ""}`}
              name="material_type"
              value={formData.material_type}
              onChange={handleInputChange}
            />
            {invalidFields.material_type && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Brand */}
          <div className="form-group mb-3">
            <label>Brand</label>
            <input
              type="text"
              className={`form-control ${invalidFields.brand ? "is-invalid" : ""}`}
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
            {invalidFields.brand && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Size */}
          <div className="form-group mb-3">
            <label>Size</label>
            <Select
              options={sizeOptions}
              isMulti
              value={sizeOptions.filter(opt => formData.size.includes(opt.value))}
              onChange={(selected) => handleSelectChange("size", selected)}
              styles={customStyles}
              isSearchable
              className={invalidFields.size ? "is-invalid" : ""}
            />
            {invalidFields.size && <div className="invalid-feedback">Required field</div>}
          </div>

          {/* Image Upload */}
          <div className="form-group mb-3">
            <label>Product Images (Max 8, 500KB each)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className={`form-control ${invalidFields.images ? "is-invalid" : ""}`}
              onChange={handleImageChange}
            />
            {invalidFields.images && <div className="invalid-feedback">At least one image required</div>}
            <small className="text-muted">
              {imageFiles.length} images selected (Max 8)
            </small>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-3">
              <label>Image Previews:</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={url} className="position-relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      style={{ transform: "translate(30%, -30%)" }}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mb-3">{errorMessage}</div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary mt-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding...
              </>
            ) : "Add Product"}
          </button>
        </form>

        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AddProduct;