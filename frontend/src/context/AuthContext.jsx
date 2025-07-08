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

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    console.log("AuthContext - Access Token:", token); // Debugging
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("AuthContext - User Data from API:", response.data); // Debugging
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // **Store user in localStorage**
    } catch (err) {
      console.error("AuthContext - Error fetching user:", err);
      setUser(null);
      localStorage.removeItem("user"); // **Remove user if request fails**
    } finally {
      setLoading(false);
    }
  };

  // Function to handle login
  const login = async (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Fetch user data after login
    await fetchUserData();
  };

  // Function to handle logout and fully clear user data
  const logout = () => {
    console.log("AuthContext - Logging out user");
    
    // Remove user-specific data
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      const cartKey = `cart_${storedUser.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
      localStorage.removeItem(cartKey); // Remove user's cart
    }
    
    // Clear everything
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
