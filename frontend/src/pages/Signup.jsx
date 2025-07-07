import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../assets/img/abatrades-large-logo.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const validateFields = () => {
    let formErrors = {};
    if (!email) formErrors.email = "Email is required";
    if (!password) formErrors.password = "Password is required";
    if (password !== confirmPassword)
      formErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) formErrors.agreeTerms = "You must agree to the terms";
    return formErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const userData = {
      email,
      password,
      confirm_password: confirmPassword,
      user_type: "buyer",
    };

    toast.promise(axios.post("inspiring-spontaneity-production.up.railway.app/api/signup/", userData), {
      pending: "Signing up...",
      success: {
        render({ data }) {
          if (data.status === 201) {
            navigate("/signin");
            return "Signup successful! Redirecting to login...";
          } else {
            throw new Error(
              data.data.message || "Sign up failed. Please try again."
            );
          }
        },
      },
      error: {
        render({ data }) {
          return (
            "Sign up failed " + data.response.request.response ||
            "Sign up failed. Please try again."
          );
        },
      },
    });
  };

  const errorStyle = { color: "red", fontSize: "0.875rem" };
  const ruleStyle = (isValid) => ({
    color: isValid ? "green" : "red",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", marginTop: "2rem" }}>
      <ToastContainer />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="container mx-auto align-self-center">
          <div className="col-md-12 mb-4 text-center">
            <a href="/" className="d-block mb-3">
              <img
                className="w-auto mb-2"
                src={Logo}
                alt="abatrades"
                style={{ height: "80px" }}
              />
            </a>
            <h2 className="mb-2">Join Us Today!</h2>
            <p className="text-muted">
              Sign up to explore great deals and opportunities on our platform.
            </p>
            <a href="/" style={{ color: "#3b7bf8" }}>
              <i className="bi bi-house-door-fill me-2"></i>Return to Home
            </a>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center mx-auto">
              <div className="card mt-3 mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <h2>Sign Up</h2>
                      <p>Enter your details to register</p>
                      {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div style={errorStyle}>{errors.email}</div>}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div style={errorStyle}>{errors.password}</div>}

                        {/* Real-time rules */}
                        <div className="mt-2">
                          <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Password must contain:</p>
                          <div style={ruleStyle(passwordRules.length)}>
                            {passwordRules.length ? "✅" : "❌"} At least 8 characters
                          </div>
                          <div style={ruleStyle(passwordRules.uppercase)}>
                            {passwordRules.uppercase ? "✅" : "❌"} At least one uppercase letter
                          </div>
                          <div style={ruleStyle(passwordRules.lowercase)}>
                            {passwordRules.lowercase ? "✅" : "❌"} At least one lowercase letter
                          </div>
                          <div style={ruleStyle(passwordRules.number)}>
                            {passwordRules.number ? "✅" : "❌"} At least one number
                          </div>
                          <div style={ruleStyle(passwordRules.specialChar)}>
                            {passwordRules.specialChar ? "✅" : "❌"} At least one special character
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="col-12">
                      <div className="mb-3">
                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            id="form-check-default"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                          />
                          <label className="form-check-label" htmlFor="form-check-default">
                            I agree to the{" "}
                            <Link to="/terms-and-conditions" className="text-primary">
                              Terms and Conditions
                            </Link>
                          </label>
                          {errors.agreeTerms && <div style={errorStyle}>{errors.agreeTerms}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                      <div className="mb-4">
                        <button
                          className="btn w-100"
                          style={{ backgroundColor: "#3b7bf8", color: "white" }}
                          onClick={handleSignUp}
                        >
                          SIGN UP
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="text-center">
                        <p className="mb-0">
                          Already have an account?{" "}
                          <Link to="/signin" className="text-warning">
                            Sign in
                          </Link>
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
      <footer style={{ position: "relative", bottom: 0, width: "100%", backgroundColor: "#f8f9fa", padding: "1rem", textAlign: "center" }}>
        <Footer />
      </footer>
    </div>
  );
};

export default SignUp;
