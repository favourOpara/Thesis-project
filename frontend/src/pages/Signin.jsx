import React, { useState } from "react";
import axios from "axios"; // Import axios for making API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GoogleAuth from "../components/GoogleAuth";
import Logo from "../assets/img/abatrades-large-logo.png";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  // State for storing email, password, and remember me
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLoginSuccess = async (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      await login(); // fetches full user profile from /api/user-info/

      // user_type comes from the login response directly
      const isSeller = userData.user_type === "seller";
      navigate(isSeller ? "/seller-dashboard" : "/", { replace: true });
    } catch (error) {
      console.error("Failed to process login:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await axios.post("http://localhost:8000/api/signin/", {
    //     email,
    //     password,
    //   }); // Update with your API endpoint
    //   console.log(response.data);
    //   // Handle successful sign-in (e.g., redirect, show success message)
    //   toast.success("Login successful!");
    //   navigate("/");
    // } catch (error) {
    //   console.error("Error signing in:", error);
    //   toast.error("Login failed. Please check your credentials.");
    //   // Handle error (e.g., show error message)
    // }

    // Use environment variable or default to production
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    toast.promise(
      axios.post(`${baseURL}/api/signin/`, {
        email,
        password,
      }, {
        withCredentials: true  // Send cookies with request
      }),
      {
        pending: "Logging in...", // Toast while waiting
        success: {
          render({ data }) {
            const userData = data.data.user;
            // Tokens are now in HttpOnly cookies - just store user data
            handleLoginSuccess(userData);
            return "Login successful!";
          },
        },
        error: {
          render({ data }) {
            return "Login failed. Please check your credentials.";
          },
        },
      }
    );
  };

  // Inline styles
  const containerStyle = {
    minHeight: "100vh", // Full viewport height
    display: "flex",
    flexDirection: "column",
  };

  const contentStyle = {
    flex: 1, // Grow to take available space
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const footerStyle = {
    position: "relative",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <div style={contentStyle}>
        <div className="container mx-auto align-self-center">
          <div className="col-md-12 mb-4 text-center">
            {/* Logo */}
            <a href="/" className="d-block mb-3">
              {/* <img
                src="https://ibb.co/pww8sVX"
                alt="Your Brand Logo"
                width="150"
              /> */}
              <img
                className="w-auto mb-2"
                src={Logo}
                alt="abatrades"
                style={{ height: "80px" }}
              />
            </a>

            {/* Header Text */}
            <h2 className="mb-2">Welcome Back!</h2>
            <p className="text-muted">
              Sign in to manage your store, products, and customer inquiries.
            </p>

            {/* Return to Home */}
            <a href="/" style={{ color: "#3b7bf8" }}>
              <i className="bi bi-house-door-fill me-2"></i>
              Return to Home
            </a>
          </div>

          <div className="row">
            {/* Right Side: Sign In Form */}
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center mx-auto">
              <div
                className="card mt-3 mb-3"
                style={{
                  transition: "none", // Disable any transition
                  animation: "none", // Disable any animation
                  transform: "none",
                }}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <h2>Sign In</h2>
                      <p>Enter your email and password to login</p>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            id="form-check-default"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form-check-default"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-4">
                        <button
                          className="btn w-100"
                          style={{ backgroundColor: "#3b7bf8", color: "white" }}
                          onClick={handleSubmit}
                        >
                          SIGN IN
                        </button>
                        {/* Google Auth Button */}
                        {/* <GoogleAuth /> */}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="text-center">
                        <p className="mb-0">
                          Don't have an account?{" "}
                          <a href="/sellersignup" className="text-warning">
                            Own a Store
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer style={footerStyle}>
        <Footer />
      </footer>
    </div>
  );
};

export default SignIn;
