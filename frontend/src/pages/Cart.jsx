import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../assets/img/abatrades-large-logo.png";
import Header from "../components/Header";

const CartPage = () => {
  // State for storing cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product 2",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product 2",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product 2",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product 2",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Product 2",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
  ]);

  // Calculate the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle changing the quantity of an item
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Inline styles
  const containerStyle = {
    minHeight: "100vh", // Full viewport height
    display: "flex",
    flexDirection: "column",
  };

  const contentStyle = {
    flex: 1, // Grow to take available space
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const footerStyle = {
    position: "relative",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    textAlign: "center",
  };

  const productCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div
            className="container mx-auto align-self-center"
            style={{ marginTop: "100px" }}
          >
            <div className="col-md-12 mb-4 text-center">
              {/* Header Text */}
              <h2 className="mb-2">Your Shopping Cart</h2>
              <p className="text-muted">
                Review your items and proceed to checkout.
              </p>

              {/* Return to Home */}
              <Link to="/" style={{ color: "#3b7bf8" }}>
                <i className="bi bi-house-door-fill me-2"></i>
                Return to Home
              </Link>
            </div>

            <div className="row">
              {/* Right Side: Cart Items */}
              <div className="col-xxl-6 col-xl-8 col-lg-8 col-md-10 col-12 mx-auto">
                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <div className="text-center">
                    <h4>Your cart is currently empty</h4>
                    <Link to="/" className="btn btn-primary mt-3">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} style={productCardStyle}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "80px", marginRight: "15px" }}
                        />
                        <div>
                          <h5>{item.name}</h5>
                          <p>${item.price.toFixed(2)} each</p>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value)
                              )
                            }
                            style={{ width: "60px", marginRight: "10px" }}
                          />
                          <span>
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total Price and Checkout Button */}
            {cartItems.length > 0 && (
              <div className="text-end mb-5">
                <h4>Total: ${totalPrice.toFixed(2)}</h4>
                <Link to="/checkout" className="btn btn-success">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
        <footer style={footerStyle}>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default CartPage;
