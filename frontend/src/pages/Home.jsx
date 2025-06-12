import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import "./Home.css";
import { useAuth } from "../context/AuthContext";
import SellerProductListTest from "../components/SellerProductListTest";
import RecommendedForYou from "../components/RecommendedForYou";
import StylingWithAbatrades from "../components/StylingWithAbatrades";
import GymWears from "../components/GymWears";
import Categories from "../components/Categories";
import WholesaleProducts from "../components/WholesaleProducts";
import MostVisitedStores from "../components/MostVisitedStores";
import RelatedToYou from "../components/RelatedToYou";
import CookwithAbatrades from "../components/CookwithAbatrades";
import BuildwithAbatrades from "../components/BuildwithAbatrades";
import SleepwithAbatrades from "../components/SleepwithAbatrades";
import StayPrettyWithAbatrades from "../components/StayPrettyWithAbatrades";
import GameWithAbatrades from "../components/GameWithAbatrades";
import TechWithAbatrades from "../components/TechWithAbatrades";
import TopPicksInYourRegion from "../components/TopPicksInYourRegion";
import ScrollingBanner from "../components/ScrollingBanner";
import SearchContext from "../context/SearchContext";
import SearchResults from "../components/SearchResults";
import CookieConsent from "../components/CookieConsent"; 

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { searchQuery } = useContext(SearchContext);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      if (isSidebarOpen && sidebar && !sidebar.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div>
      <Layout>
         <CookieConsent />
        <Header toggleSidebar={toggleSidebar} />
        <div className={`container ${isSidebarOpen ? "dimmed" : ""}`}>
          {isSidebarOpen && <div className="backdrop"></div>}
          {isSidebarOpen && <SideBar toggleSidebar={toggleSidebar} />}
        </div>

        {searchQuery ? (
          <SearchResults />
        ) : user && user.user_type === "seller" ? (
          <SellerProductListTest />
        ) : (
          <>
            <Hero />

            {/* 1) Recommended sections */}
            <div className="recommended-sections">
              <RecommendedForYou />
              <StylingWithAbatrades />
              <GymWears />
            </div>

            {/* 2) Categories Section */}
            <Categories />

            {/* 3) Additional Section: Wholesale + Most Visited */}
            <div className="additional-section-container">
              <WholesaleProducts />
              <MostVisitedStores />
            </div>

            {/* 4) Related to Items You've Viewed */}
            <RelatedToYou />

            {/* 5) Scrolling Banner with 2 images (automatically scrolls horizontally) */}
            <ScrollingBanner />

            {/* 6) Next recommended sections */}
            <div className="recommended-sections">
              <CookwithAbatrades />
              <BuildwithAbatrades />
              <SleepwithAbatrades />
            </div>
            <div className="recommended-sections">
              <StayPrettyWithAbatrades />
              <GameWithAbatrades />
              <TechWithAbatrades />
            </div>
            <div className="additional-section-container">
              <TopPicksInYourRegion />
              <MostVisitedStores />
            </div>

            {/* 7) More items */}
            <RelatedToYou />
            <div className="additional-section-container">
              <TopPicksInYourRegion />
              <MostVisitedStores />
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default Home;
