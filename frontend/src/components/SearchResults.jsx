import React, { useContext, useEffect } from "react";
import { useGetProductsQuery } from "../redux/api/productsApi";
import SearchContext from "../context/SearchContext";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopPicksInYourRegion from "../components/TopPicksInYourRegion";
import RelatedToYou from "../components/RelatedToYou";
import MostVisitedStores from "../components/MostVisitedStores";
import "./searchresults.css"; // <-- custom CSS for search results

const HEADER_HEIGHT = 70;

const SearchResults = () => {
  const { searchQuery, closeSearchDropdown } = useContext(SearchContext);
  const { data: products = [], isLoading } = useGetProductsQuery(searchQuery || "", {
    skip: !searchQuery,
  });

  // Close the search dropdown if it's open (on page load or search change)
  useEffect(() => {
    if (closeSearchDropdown) {
      closeSearchDropdown();
    }
  }, [searchQuery, closeSearchDropdown]);

  return (
    <>
      <Header />
      <div
        className="search-results-outer"
        style={{
          paddingTop: `${HEADER_HEIGHT + 16}px`,
          minHeight: "80vh",
          background: "#fff",
          width: "100vw",
          position: "relative",
          left: "0",
          right: "0"
        }}
      >
        <div className="container search-results-section">
          <div className="search-results-title">
            Search Results{searchQuery ? ` for "${searchQuery}"` : ""}
          </div>
          <div className="search-results-grid">
            {isLoading ? (
              <div className="search-results-loading">Loading...</div>
            ) : products.length === 0 ? (
              <div className="search-results-empty">No products found.</div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>

        {/* Add extra sections below the results grid */}
        <div className="additional-section-container">
          <TopPicksInYourRegion />
          <MostVisitedStores />
        </div>
        <div>
          <RelatedToYou />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
