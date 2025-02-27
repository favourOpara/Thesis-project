import React from "react";
import { Link } from "react-router-dom";
import "./ScrollingBanner.css";

// Import your two images
import image1 from "../assets/img/2.png";
import image2 from "../assets/img/1.png";

const ScrollingBanner = () => {
  return (
    <div className="scrolling-banner-container">
      <h3 className="banner-title">Casual Fashion</h3>

      {/* The continuously scrolling track */}
      <div className="scroll-track">
        {/* Repeat each image at least twice for seamless loop */}
        <Link to="/coming-soon">
          <img src={image1} alt="Fashion 1" />
        </Link>
        <Link to="/coming-soon">
          <img src={image2} alt="Fashion 2" />
        </Link>
        <Link to="/coming-soon">
          <img src={image1} alt="Fashion 1" />
        </Link>
        <Link to="/coming-soon">
          <img src={image2} alt="Fashion 2" />
        </Link>
        <Link to="/coming-soon">
          <img src={image1} alt="Fashion 1" />
        </Link>
        <Link to="/coming-soon">
          <img src={image2} alt="Fashion 2" />
        </Link>
        <Link to="/coming-soon">
          <img src={image1} alt="Fashion 1" />
        </Link>
        <Link to="/coming-soon">
          <img src={image2} alt="Fashion 2" />
        </Link>
      </div>

      {/* Shop Now button */}
      <Link to="/coming-soon" className="shop-now">
        Shop now
      </Link>
    </div>
  );
};

export default ScrollingBanner;
