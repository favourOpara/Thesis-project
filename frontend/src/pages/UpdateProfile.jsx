import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/update-profile/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updatedUser = null;
    toast.promise(
      axios
        .put("http://127.0.0.1:8000/api/update-profile/", profile, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
        .then((response) => {
          updatedUser = response.data;
        }),
      {
        pending: "Updating profile...",
        success: {
          render() {
            window.location.href = "/user-profile";
            return "Profile updated successfully!";
          },
        },
        error: {
          render() {
            return "Update failed. Please try again.";
          },
        },
      }
    ).finally(() => {
      if (updatedUser) {
        setUser(updatedUser);
      }
      setLoading(false);
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
  
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete("http://127.0.0.1:8000/api/delete-account/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
  
      if (response.status === 200) {
        console.log("Account deleted successfully");
  
        // Remove only the current user's data
        const userId = user.email ? user.email.replace(/[^a-zA-Z0-9]/g, "_") : "guest";
        const CART_STORAGE_KEY = `cart_${userId}`;
  
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem(CART_STORAGE_KEY);
  
        // Update state and ensure UI reflects logout
        setUser(null);
  
        // Delay navigation slightly to ensure state updates
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
    
  

  return (
    <>
      <Header />
      <div className="container">
        <ToastContainer />
        <div className="card shadow p-4">
          <h2 className="text-center mb-4" style={{ marginTop: "65px" }}>Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input type="text" className="form-control" id="first_name" name="first_name" value={profile.first_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="last_name" name="last_name" value={profile.last_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={profile.email} onChange={handleChange} disabled />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                <input type="text" className="form-control" id="phone_number" name="phone_number" value={profile.phone_number} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" name="address" value={profile.address} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={() => navigate("/user-profile")}>Back to Profile</button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProfile;
