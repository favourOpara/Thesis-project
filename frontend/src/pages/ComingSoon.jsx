import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>Coming Soon</h1>
      <p style={{ fontSize: "24px", margin: "20px 0" }}>
        We are working hard to bring you something amazing. Stay tuned!
      </p>
      <p style={{ fontSize: "16px", marginBottom: "30px" }}>
        In the meantime, you can explore our other pages.
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

export default ComingSoon;
