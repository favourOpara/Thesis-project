import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Ensure correct import
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const { cartItems = [], removeFromCart } = useCart();

  console.log("Cart Items:", cartItems); // Debugging line

  // Ensure totalPrice calculation works correctly
  const totalPrice = cartItems.length
    ? cartItems.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0)
    : 0;

  return (
    <>
      <Header />
      <div className="container mx-auto" style={{ marginTop: "0px", minHeight: "100vh" }}>
        <h2 className="text-center">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <h4>Your cart is currently empty</h4>
            <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
          </div>
        ) : (
          <>
            {cartItems.map((item) => {
              const itemPrice = Number(item.price) || 0; // Ensure price is a number
              
              // Fetch image from backend just like in ProductCard.jsx
              const itemImage =
                item.main_image_url ||
                (item.images && item.images.length > 0 ? item.images[0].image_url : "/OIP.png");

              return (
                <div key={item.id} className="card mb-3 p-3 d-flex flex-row align-items-center">
                  <img
                    src={itemImage} // Use backend image
                    alt={item.name}
                    style={{ width: "80px", marginRight: "15px" }}
                    onError={(e) => (e.target.src = "/OIP.png")} // Handles broken images
                  />
                  <div className="flex-grow-1">
                    <h5>{item.name}</h5>
                    <p>${itemPrice.toFixed(2)} each</p> {/* Prevents NaN error */}
                    <span>Total: ${(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              );
            })}

            {/* Total Price & Checkout */}
            <div className="text-end mb-5">
              <h4>Total: ${totalPrice.toFixed(2)}</h4>
              <Link to="/checkout" className="btn btn-success">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
