import React, { createContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsReload, setProductsReload] = useState(false);

  return (
    <SearchContext.Provider
      value={{ productsReload, setProductsReload, searchQuery, setSearchQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
