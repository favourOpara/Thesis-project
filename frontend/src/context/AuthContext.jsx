import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Function to fetch user data - now works with HttpOnly cookies!
  const fetchUserData = async () => {
    try {
      // Use environment variable or default to production
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await axios.get(`${baseURL}/api/user-info/`, {
        withCredentials: true  // Send HttpOnly cookies with request
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // Store user in localStorage
    } catch (err) {
      console.error("AuthContext - Error fetching user:", err);
      setUser(null);
      localStorage.removeItem("user"); // Remove user if request fails
    } finally {
      setLoading(false);
    }
  };

  // Function to handle login - tokens are in HttpOnly cookies
  const login = async () => {
    // Tokens are in HttpOnly cookies - just fetch user data
    await fetchUserData();
  };

  // Function to handle logout - clear HttpOnly cookies via API
  const logout = async () => {
    console.log("AuthContext - Logging out user");

    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      await axios.post(`${baseURL}/api/logout/`, {}, {
        withCredentials: true  // Send cookies to be cleared
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");

    setUser(null); // Reset user state
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error, login, logout }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ClipLoader color="#3b7bf8" size={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
