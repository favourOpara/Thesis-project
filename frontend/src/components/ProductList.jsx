import React from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productsApi";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { data: products, isLoading, isError } = useGetProductsQuery(searchQuery);

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className="product-list-page">
      <h4>Results for: <em>{searchQuery}</em></h4>
      <div className="product-grid">
        {products?.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.images?.[0]?.image || "/placeholder.jpg"} alt={product.name} />
            <h5>{product.name}</h5>
            <p>₦{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
