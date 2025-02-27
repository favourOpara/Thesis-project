// Layout.jsx
import React from "react";
import "./Layout.css"; // Import your CSS file
import Header from "./Header";
import Footer from "./Footer";
import Hero from "./Hero";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Hero /> */}
      <main className="flex-fill">
        {children} {/* This will render the main content */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
