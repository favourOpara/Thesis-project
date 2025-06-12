import React, { createContext, useState, useRef } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsReload, setProductsReload] = useState(false);

  // Step 1: Add a ref to hold the close function
  const closeDropdownRef = useRef(() => {});

  // Step 2: Function for Header to register its close logic
  const registerCloseDropdown = (fn) => {
    closeDropdownRef.current = fn;
  };

  // Step 3: Function for other components to call to close the dropdown
  const closeSearchDropdown = () => {
    if (closeDropdownRef.current) closeDropdownRef.current();
  };

  return (
    <SearchContext.Provider
      value={{
        productsReload,
        setProductsReload,
        searchQuery,
        setSearchQuery,
        registerCloseDropdown,   // NEW
        closeSearchDropdown,     // NEW
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
