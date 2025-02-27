import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
Footer;

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ fontSize: "72px", fontWeight: "bold" }}>404</h1>
      <p style={{ fontSize: "24px", margin: "20px 0" }}>Page Not Found</p>
      <p style={{ fontSize: "16px", marginBottom: "30px" }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <button
          style={{
            backgroundColor: "#3b7bf8",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
