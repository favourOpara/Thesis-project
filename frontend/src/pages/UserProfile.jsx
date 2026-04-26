import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Profile = () => {
  const navigate = useNavigate();

  const { user, refreshUser } = useAuth();
  const [switching, setSwitching] = useState(false);

  const handleSwitchToSeller = async () => {
    setSwitching(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${BASE}/api/switch-role/`, {}, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await refreshUser();
      navigate("/seller/overview");
    } catch {
      toast.error("Could not switch role. Please try again.");
    } finally {
      setSwitching(false);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("No refresh token found");
        navigate("/signin");
        return;
      }

      // Send logout request to the backend
      await axios.post(
        `${BASE}/api/signout/`,
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Navigate to the signin page
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if the backend logout fails, proceed with local logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/signin");
    }
  };

  const shoppingHistory = [
    {
      item: "Wireless Headphones",
      date: "2024-11-12",
      quantity: 1,
      price: 150,
    },
    { item: "Laptop Stand", date: "2024-11-10", quantity: 2, price: 40 },
    { item: "Ergonomic Chair", date: "2024-11-08", quantity: 1, price: 250 },
  ];

  const totalSpent = shoppingHistory.reduce(
    (acc, purchase) => acc + purchase.quantity * purchase.price,
    0
  );

  useEffect(() => {
    // Check if profile update was successful
    if (localStorage.getItem("profileUpdateSuccess") === "true") {
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        localStorage.removeItem("profileUpdateSuccess");
      }, 3000);
    }
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #f0f4f8, #d9e6f2)",
          padding: "20px",
        }}
      >
        <div className="container mt-5">
          <ToastContainer />
          <div
            className="row"
            style={{ marginTop: window.innerWidth <= 992 ? "70px" : "120px" }}
          >
            {/* Profile Card */}
            <div className="col-lg-4 mb-4">
              <div
                className="card"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="card-header text-center"
                  style={{ backgroundColor: "#3b7bf8", color: "white" }}
                >
                  <h3>{`${user.first_name || "N/A"} ${
                    user.last_name || ""
                  }`}</h3>
                  <p className="mb-0 text-white-50">{user.email}</p>
                  <p className="mb-0 text-white-50">{user.phone_number}</p>
                  <p className="text-white-50">{user.address}</p>
                </div>
                <div className="card-body text-center">
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleEditProfile}
                    style={{
                      backgroundColor: "#3b7bf8",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn w-100"
                    onClick={handleSwitchToSeller}
                    disabled={switching}
                    style={{
                      backgroundColor: "#f0fdf4",
                      color: "#15803d",
                      border: "1.5px solid #86efac",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "13.5px",
                    }}
                  >
                    {switching ? "Switching…" : "Switch to Seller Account"}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-8">
              <div className="row">
                {/* Shopping History */}
                <div className="col-12 mb-4">
                  <div className="card" style={{ borderRadius: "12px" }}>
                    <div className="card-header">
                      <h5>Shopping History</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        {/* Responsive Table */}
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Date</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shoppingHistory.map((purchase, index) => (
                              <tr key={index}>
                                <td>{purchase.item}</td>
                                <td>{purchase.date}</td>
                                <td>{purchase.quantity}</td>
                                <td>${purchase.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-end">
                        <h6>
                          <strong>Total Spent: </strong>${totalSpent.toFixed(2)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pro Plan */}
                {user && user.user_type == "seller" && (
                  <div className="col-md-6 mb-4">
                    <div
                      className="card"
                      style={{
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="card-header">
                        <h5>Pro Plan</h5>
                      </div>
                      <div className="card-body">
                        <p>20,000 Monthly Visitors</p>
                        <p>Unlimited Data Storage</p>
                        <div className="progress mb-2">
                          <div
                            className="progress-bar bg-info"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <p>
                          <strong>$25/month</strong>
                        </p>
                        <button className="btn btn-primary w-100">
                          Renew Plan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment History */}
                <div className="col-md-6 mb-4">
                  <div className="card" style={{ borderRadius: "12px" }}>
                    <div className="card-header">
                      <h5>Payment History</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Pro Membership</span>
                          <span>$45</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Pro Membership</span>
                          <span>$45</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="col-12">
                  <div className="card" style={{ borderRadius: "12px" }}>
                    <div className="card-header">
                      <h5>Payment Methods</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>American Express</span>
                          <span className="badge bg-success">Active</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>Visa</span>
                          <span>Expires 12/25</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-danger mt-2"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ff5e57",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    width: "100px",
                    marginLeft: "40%",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
