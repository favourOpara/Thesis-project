import React from "react";
import { Link } from "react-router-dom";

const SellerIntro = () => {
  return (
    <div className="container product-list-container">
      <div className="row justify-content-center">
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#e6f0ff",
            marginTop: "60px",
          }}
        >
          {/* Left Side Content */}
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "36px",
                marginBottom: "20px",
              }}
            >
              Become a Seller on Abatrades
            </h2>
            <Link to="/sellersignup">
              <button
                style={{
                  backgroundColor: "#3b7bf8",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "20px",
                }}
              >
                SIGN UP
              </button>
            </Link>
            <div>
              <h3 style={{ fontWeight: "bold", fontSize: "24px", margin: "0" }}>
                200+
              </h3>
              <p style={{ fontSize: "16px", margin: "0" }}>CUSTOMERS</p>
              <p style={{ fontSize: "16px", margin: "0" }}>WAITING FOR YOU</p>
            </div>
          </div>

          {/* Right Side Images */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              flex: 1,
            }}
          >
            <img
              src="https://via.placeholder.com/150"
              alt="Seller interaction"
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <img
              src="https://via.placeholder.com/150"
              alt="Products display"
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <img
              src="https://via.placeholder.com/150"
              alt="Assorted items"
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <img
              src="https://via.placeholder.com/150"
              alt="Goods on display"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerIntro;
