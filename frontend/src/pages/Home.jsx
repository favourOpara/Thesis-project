import React, { useContext } from "react";
import Layout from "../components/Layout";
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
  const { user } = useAuth();
  const { searchQuery } = useContext(SearchContext);
  
  // Check if seller wants to view customer homepage
  const urlParams = new URLSearchParams(window.location.search);
  const forceCustomerView = urlParams.get('view') === 'customer';

  return (
    <div>
      <Layout>
        <CookieConsent />
        <Header />
        
        {searchQuery ? (
          <SearchResults />
        ) : user && user.user_type === "seller" && !forceCustomerView ? (
          <SellerProductListTest />
        ) : (
          <>
            <Hero />
            {/* Rest of your components... */}
            <div className="recommended-sections">
              <RecommendedForYou />
              <StylingWithAbatrades />
              <GymWears />
            </div>
            <Categories />
            <div className="additional-section-container">
              <WholesaleProducts />
              <MostVisitedStores />
            </div>
            <RelatedToYou />
            <ScrollingBanner />
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