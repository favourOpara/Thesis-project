import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    size: "",
    gender: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Clear error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // ✅ Cleanup preview URL when imageFile changes or component unmounts
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  // Dropdown options
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
    { value: "Trousers", label: "Trousers", category: "Clothing materials" },
    { value: "Gym wears", label: "Gym wears", category: "Clothing materials" },
    { value: "Underwears", label: "Underwears", category: "Clothing materials" },
    { value: "Dresses", label: "Dresses", category: "Clothing materials" },
    { value: "Socks", label: "Socks", category: "Clothing materials" },
    { value: "Headwears", label: "Headwears", category: "Clothing materials" },
    { value: "Shoes", label: "Shoes", category: "Clothing materials" },
    { value: "Slippers", label: "Slippers", category: "Clothing materials" },
    { value: "Jewelry", label: "Jewelry", category: "Clothing materials" },
    { value: "Other", label: "Other (provide more details in description)", category: "Clothing materials" },
    { value: "Handbags", label: "Handbags", category: "Body accessories" },
    { value: "Purses", label: "Purses", category: "Body accessories" },
    { value: "Wallets", label: "Wallets", category: "Body accessories" },
    { value: "Belts", label: "Belts", category: "Body accessories" },
    { value: "Handwears", label: "Handwears", category: "Body accessories" },
    { value: "Eyewear", label: "Eyewear", category: "Body accessories" },
    { value: "Other", label: "Other (provide more details in description)", category: "Body accessories" },
    { value: "Kitchenware", label: "Kitchenware", category: "Household items" },
    { value: "Cookware", label: "Cookware", category: "Household items" },
    { value: "Plastic containers", label: "Plastic containers", category: "Household items" },
    { value: "Storage bins", label: "Storage bins", category: "Household items" },
    { value: "Cleaning supplies", label: "Cleaning supplies", category: "Household items" },
    { value: "Other", label: "Other (provide more details in description)", category: "Household items" },
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
    { value: "Other", label: "Other (provide more details in description)", category: "Electronics and appliances" },
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
    { value: "Other", label: "Other (provide more details in description)", category: "agriculture, food, and groceries" },
    { value: "Skincare", label: "Skincare", category: "Cosmetic and beauty products" },
    { value: "Haircare", label: "Haircare", category: "Cosmetic and beauty products" },
    { value: "Mouthcare", label: "Mouthcare", category: "Cosmetic and beauty products" },
    { value: "Makeups", label: "Makeups", category: "Cosmetic and beauty products" },
    { value: "Perfumes", label: "Perfumes", category: "Cosmetic and beauty products" },
    { value: "Other", label: "Other (provide more details in description)", category: "Cosmetic and beauty products" },
    { value: "Hancrafted sculptures", label: "Hancrafted sculptures", category: "Arts and craft" },
    { value: "Carvings", label: "Carvings", category: "Arts and craft" },
    { value: "Paintings", label: "Paintings", category: "Arts and craft" },
    { value: "Drawings", label: "Drawings", category: "Arts and craft" },
    { value: "Artworks", label: "Artworks", category: "Arts and craft" },
    { value: "Beadworks", label: "Beadworks", category: "Arts and craft" },
    { value: "Traditional musical instruments", label: "Traditional musical instruments", category: "Arts and craft" },
    { value: "Flowers", label: "Flowers", category: "Arts and craft" },
    { value: "Other", label: "Other (provide more details in description)", category: "Arts and craft" },
    { value: "Writing materials", label: "Writing materials", category: "Stationery" },
    { value: "Office supplies", label: "Office supplies", category: "Stationery" },
    { value: "Art supplies", label: "Art supplies", category: "Stationery" },
    { value: "School supplies", label: "School supplies", category: "Stationery" },
    { value: "Other", label: "Other (provide more details in description)", category: "Stationery" },
    { value: "Chairs", label: "Chairs", category: "Furnitures and home decor" },
    { value: "Tables", label: "Tables", category: "Furnitures and home decor" },
    { value: "Beds", label: "Beds", category: "Furnitures and home decor" },
    { value: "Mattresses", label: "Mattresses", category: "Furnitures and home decor" },
    { value: "Rugs", label: "Rugs", category: "Furnitures and home decor" },
    { value: "Curtains", label: "Curtains", category: "Furnitures and home decor" },
    { value: "Dining set", label: "Dining set", category: "Furnitures and home decor" },
    { value: "Cupboards", label: "Cupboards", category: "Furnitures and home decor" },
    { value: "Other", label: "Other (provide more details in description)", category: "Furnitures and home decor" },
    { value: "Vehicle spare parts", label: "Vehicle spare parts", category: "Autoparts and accessories" },
    { value: "Car accessories", label: "Car accessories", category: "Autoparts and accessories" },
    { value: "Car repair tools", label: "Car repair tools", category: "Autoparts and accessories" },
    { value: "Other", label: "Other (provide more details in description)", category: "Autoparts and accessories" },
    { value: "Cement", label: "Cement", category: "Building materials" },
    { value: "Sand", label: "Sand", category: "Building materials" },
    { value: "Gravel", label: "Gravel", category: "Building materials" },
    { value: "Bricks", label: "Bricks", category: "Building materials" },
    { value: "Roofing materials", label: "Roofing materials", category: "Building materials" },
    { value: "Plumbing", label: "Plumbing", category: "Building materials" },
    { value: "Electric supplies", label: "Electric supplies", category: "Building materials" },
    { value: "Toilet building", label: "Toilet building", category: "Building materials" },
    { value: "Construction tools", label: "Construction tools", category: "Building materials" },
    { value: "Other", label: "Other (provide more details in description)", category: "Building materials" },
    { value: "Dolls", label: "Dolls", category: "Toys and children products" },
    { value: "Action figures", label: "Action figures", category: "Toys and children products" },
    { value: "Stuffed animals", label: "Stuffed animals", category: "Toys and children products" },
    { value: "Educational toys", label: "Educational toys", category: "Toys and children products" },
    { value: "Games", label: "Games", category: "Toys and children products" },
    { value: "Baby care products", label: "Baby care products", category: "Toys and children products" },
    { value: "Other", label: "Other (provide more details in description)", category: "Miscellaneous" },
    { value: "Sex toys", label: "Sex toys", category: "Adult" },
    { value: "Lubricants", label: "Lubricants", category: "Adult" },
    { value: "Other", label: "Other (provide more details in description)", category: "Adult" },
    { value: "Pets", label: "Pets", category: "Animal pets" },
    { value: "Pet food", label: "Pet food", category: "Animal pets" },
    { value: "Other", label: "Other (provide more details in description)", category: "Animal pets" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unisex", label: "Unisex" },
  ];

  const sizeOptions = [
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "Extra Large" },
    { value: "XXL", label: "Extra Extra Large" },
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

  const handleSelectChange = (name, selectedOption) => {
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: selectedOption ? selectedOption.value : "",
        sub_category: "",
        gender: ""
      }));
      setInvalidFields((prev) => ({
        ...prev,
        category: false,
        sub_category: false,
        gender: false,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? selectedOption.value : "",
      }));
      setInvalidFields((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setInvalidFields((prev) => ({ ...prev, [name]: false }));
  };

  const handleImageChange = (e) => {
    setErrorMessage("");
    setInvalidFields((prev) => ({ ...prev, image: false }));
    const file = e.target.files[0];
    if (file && file.size > 500 * 1024) {
      setErrorMessage("Image must be less than 500KB.");
      setInvalidFields((prev) => ({ ...prev, image: true }));
      e.target.value = null;
      setImageFile(null);
    } else {
      setImageFile(file || null);
    }
  };

  const filteredSubCategories = subCategoryOptions.filter(
    (option) => option.category === formData.category
  );

  const showGenderDropdown =
    formData.category === "Clothing materials" ||
    formData.category === "Body accessories" ||
    formData.category === "Cosmetic and beauty products";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const requiredFields = [
      "category",
      "sub_category",
      "description",
      "price",
      "quantity",
      "material_type",
      "brand",
      "size",
    ];
    let hasEmptyField = false;
    const newInvalidFields = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        hasEmptyField = true;
        newInvalidFields[field] = true;
      }
    });
    if (!imageFile) {
      hasEmptyField = true;
      newInvalidFields.image = true;
    }

    if (hasEmptyField) {
      setErrorMessage("Mandatory field not filled");
      setInvalidFields(newInvalidFields);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("category", formData.category);
      dataToSend.append("sub_category", formData.sub_category);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", parseFloat(formData.price));
      dataToSend.append("quantity", formData.quantity);
      dataToSend.append("material_type", formData.material_type);
      dataToSend.append("brand", formData.brand);
      dataToSend.append("size", formData.size);
      dataToSend.append("gender", formData.gender);
      dataToSend.append("image", imageFile);

      await axios.post("http://127.0.0.1:8000/api/owner-products/", dataToSend, {
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
        size: "",
        gender: "",
      });
      setImageFile(null);
      setInvalidFields({});
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("Failed to add the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {errorMessage && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "10px",
            zIndex: 9999,
          }}
          className="alert alert-danger"
        >
          {errorMessage}
        </div>
      )}

      <div className="container">
        <p>.</p>
        <h2 style={{ marginTop: "60px" }}>Add Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group mb-3">
            <label>Product Name</label>
            <input
              type="text"
              className={`form-control ${invalidFields.name ? "border border-danger" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {invalidFields.name && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Category */}
          <div className="form-group mb-3">
            <label>Category</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === formData.category)}
              onChange={(selected) => handleSelectChange("category", selected)}
              styles={customStyles}
              menuPlacement="auto"
              isSearchable
              className={invalidFields.category ? "border border-danger" : ""}
            />
            {invalidFields.category && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Sub-Category */}
          {formData.category && (
            <div className="form-group mb-3">
              <label>Sub-Category</label>
              <Select
                key={`sub-${formData.category}`}
                options={filteredSubCategories}
                value={filteredSubCategories.find((option) => option.value === formData.sub_category)}
                onChange={(selected) => handleSelectChange("sub_category", selected)}
                styles={customStyles}
                menuPlacement="auto"
                isSearchable
                className={invalidFields.sub_category ? "border border-danger" : ""}
              />
              {invalidFields.sub_category && <div className="text-danger">Mandatory field</div>}
            </div>
          )}

          {/* Gender */}
          {showGenderDropdown && (
            <div className="form-group mb-3">
              <label>Gender</label>
              <Select
                key={`gender-${formData.category}`}
                options={genderOptions}
                value={genderOptions.find((option) => option.value === formData.gender)}
                onChange={(selected) => handleSelectChange("gender", selected)}
                styles={customStyles}
                menuPlacement="auto"
                isSearchable
                className={invalidFields.gender ? "border border-danger" : ""}
              />
              {invalidFields.gender && <div className="text-danger">Mandatory field</div>}
            </div>
          )}

          {/* Description */}
          <div className="form-group mb-3">
            <label>Description</label>
            <textarea
              className={`form-control ${invalidFields.description ? "border border-danger" : ""}`}
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            {invalidFields.description && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Price */}
          <div className="form-group mb-3">
            <label>Price</label>
            <input
              type="text"
              className={`form-control ${invalidFields.price ? "border border-danger" : ""}`}
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
            {invalidFields.price && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Quantity */}
          <div className="form-group mb-3">
            <label>Quantity</label>
            <input
              type="text"
              className={`form-control ${invalidFields.quantity ? "border border-danger" : ""}`}
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            {invalidFields.quantity && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Material Type */}
          <div className="form-group mb-3">
            <label>Material Type</label>
            <input
              type="text"
              className={`form-control ${invalidFields.material_type ? "border border-danger" : ""}`}
              name="material_type"
              value={formData.material_type}
              onChange={handleInputChange}
            />
            {invalidFields.material_type && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Brand */}
          <div className="form-group mb-3">
            <label>Brand</label>
            <input
              type="text"
              className={`form-control ${invalidFields.brand ? "border border-danger" : ""}`}
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
            {invalidFields.brand && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Size */}
          <div className="form-group mb-3">
            <label>Size</label>
            <Select
              options={sizeOptions}
              value={sizeOptions.find((option) => option.value === formData.size)}
              onChange={(selected) => handleSelectChange("size", selected)}
              styles={customStyles}
              menuPlacement="auto"
              isSearchable
              className={invalidFields.size ? "border border-danger" : ""}
            />
            {invalidFields.size && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Image Upload */}
          <div className="form-group mb-3">
            <label>Product Image (Max 500KB)</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${invalidFields.image ? "border border-danger" : ""}`}
              onChange={handleImageChange}
            />
            {invalidFields.image && <div className="text-danger">Mandatory field</div>}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mb-3">
              <label>Image Preview:</label>
              <div>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>

        {successMessage && (
          <div className={`alert ${successMessage.includes("successfully") ? "alert-success" : "alert-danger"} mt-3`}>
            {successMessage}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
