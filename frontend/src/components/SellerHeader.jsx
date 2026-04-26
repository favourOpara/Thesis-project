import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Logo from "../assets/img/abatrades-logo-other.png";
import "./Header.css"; // Import your CSS file here
import SideBar from "./SideBar";

const SellerHeader = () => {
  return (
    <>
      <header className="fixed-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
            <p style={{ marginTop: "15px" }}>
              <strong>SELL WITH</strong>{" "}
            </p>
            {/* Logo */}
            <Link className="navbar-brand mx-2" to="/">
              <img
                className="w-auto mb-2"
                src={Logo}
                alt="abatrades"
                style={{ height: "30px", marginTop: "10px" }}
              />
            </Link>

            <div className="d-flex align-items-center ms-auto">
              {/* Shopping Cart */}
              <Link to="/join">
                <button
                  style={{
                    backgroundColor: "#3b7bf8",
                    color: "white",
                    borderRadius: "12px", // adjust for roundness
                    border: "none", // removes the border
                    padding: "5px 10px", // optional: adjust padding for better look
                    fontWeight: "bold", // makes the text bold
                  }}
                >
                  SIGN UP
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default SellerHeader;
