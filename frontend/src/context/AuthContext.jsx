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

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch user profile using stored access token
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${baseURL}/api/user-info/`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  };

  // Call after login — token already stored, just fetch profile
  const login = async () => {
    await fetchUserData();
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${baseURL}/api/signout/`, {}, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      // ignore logout errors
    }
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
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
