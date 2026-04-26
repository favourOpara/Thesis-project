import React, { useState } from "react";
import axios from "axios"; // Import axios for making API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Logo from "../assets/img/abatrades-large-logo.png";
import { useAuth } from "../context/AuthContext";
import GoogleAuth from "../components/GoogleAuth";

const SignIn = () => {
  // State for storing email, password, and remember me
  const { login, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleGoogleSuccess = ({ user, access_token }) => {
    handleLoginSuccess(user, access_token);
  };

  const handleGoogleError = (msg) => {
    if (msg === 'no_account') {
      toast.info("No account found. Redirecting you to sign up…");
      setTimeout(() => navigate("/join"), 1800);
    } else {
      toast.error(msg);
    }
  };

  const handleLoginSuccess = (userData, accessToken) => {
    // Store token immediately
    if (accessToken) localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Set user in context immediately from login response —
    // don't wait for fetchUserData so the dashboard auth check
    // finds a valid user right away
    setUser(userData);

    const isSeller = userData.user_type === "seller";
    navigate(isSeller ? "/seller/overview" : "/", { replace: true });

    // Refresh full profile in background
    login();
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
            const accessToken = data.data.access_token;
            handleLoginSuccess(userData, accessToken);
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
                      <div className="mb-4">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ width: "100%", padding: "8px 0", fontSize: "14.5px", color: "#0f172a", background: "transparent", outline: "none", border: "none", borderBottom: "2px solid #e2e8f0", borderRadius: 0, transition: "border-color 0.2s", boxSizing: "border-box" }}
                          onFocus={e => e.target.style.borderBottomColor = "#2563eb"}
                          onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-4">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ width: "100%", padding: "8px 0", fontSize: "14.5px", color: "#0f172a", background: "transparent", outline: "none", border: "none", borderBottom: "2px solid #e2e8f0", borderRadius: 0, transition: "border-color 0.2s", boxSizing: "border-box" }}
                          onFocus={e => e.target.style.borderBottomColor = "#2563eb"}
                          onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}
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
                      <div className="mb-3">
                        <GoogleAuth
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0 16px" }}>
                        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>or sign in with email</span>
                        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
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
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="text-center">
                        <p className="mb-0">
                          Don't have an account?{" "}
                          <a href="/join" className="text-warning">
                            Join Abatrades
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
