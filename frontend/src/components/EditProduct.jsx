import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // Get product ID from URL
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
    size: "",
    gender: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch product details
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`http://127.0.0.1:8000/api/owner-products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFormData(response.data);
        if (response.data.main_image) {
          setPreviewUrl(response.data.main_image);
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setErrorMessage("Failed to fetch product details.");
      });
  }, [id]);

  // Clear error messages
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Handle image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
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
    { value: "Shirts", label: "Shirts", category: "Clothing materials" },
    { value: "Purses", label: "Purses", category: "Body accessories" },
    { value: "Wallets", label: "Wallets", category: "Body accessories" },
    { value: "Mobile phones", label: "Mobile phones", category: "Electronics and appliances" },
    { value: "Laptops", label: "Laptops", category: "Electronics and appliances" },
    { value: "Other", label: "Other (provide more details in description)", category: "Miscellaneous" },
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Get filtered subcategories based on selected category
  const filteredSubCategories = subCategoryOptions.filter(
    (option) => option.category === formData.category
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("accessToken");
    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value);
    });

    if (imageFile) {
      dataToSend.append("main_image", imageFile);
    }

    try {
      await axios.patch(`http://127.0.0.1:8000/api/owner-products/${id}/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Product updated successfully!");
      setTimeout(() => {
        window.location.href = "http://localhost:5173"; // Redirect to seller dashboard
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("Failed to update the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="container">
        <h2>Edit Product</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Product Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} />
          </div>

          <div className="form-group mb-3">
            <label>Category</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === formData.category)}
              onChange={(selected) => handleSelectChange("category", selected)}
            />
          </div>

          <div className="form-group mb-3">
            <label>Sub-Category</label>
            <Select
              options={filteredSubCategories}
              value={filteredSubCategories.find((option) => option.value === formData.sub_category)}
              onChange={(selected) => handleSelectChange("sub_category", selected)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditProduct;
