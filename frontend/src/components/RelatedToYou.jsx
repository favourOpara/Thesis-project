import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RelatedToYou.css"; // New CSS for this component
import ProductCard from "./ProductCard";

const RelatedToYou = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((response) => 
        setProducts(response.data.slice(0, 20)) // Limit to 20 products
      )
      .catch((error) => console.error("Error fetching related products:", error));
  }, []);

  return (
    <div className="related-section">
      <h3 className="section-title">Related to Items You've Viewed</h3>
      <div className="related-scroll">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <a href="/shop" className="shop-now">Shop now</a>
    </div>
  );
};

export default RelatedToYou;
