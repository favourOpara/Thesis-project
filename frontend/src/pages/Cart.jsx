import React from "react"; 
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const { cartItems = [], removeFromCart, updateCartItemQuantity } = useCart();

  console.log("Cart Items:", cartItems); 

  const totalPrice = cartItems.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);

  return (
    <>
      <Header />
      <div className="container mx-auto" style={{ marginTop: "0px", minHeight: "100vh" }}>
        <h2 className="text-center" style={{ marginTop: "0px", marginBottom: "40px" }}>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <h4>Your cart is currently empty</h4>
            <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
          </div>
        ) : (
          <>
            {cartItems.map((item) => {
              const itemPrice = Number(item.price) || 0;
              const itemImage =
                item.main_image_url ||
                (item.images && item.images.length > 0 ? item.images[0].image_url : "/OIP.png");

              return (
                <div key={item.id} className="card mb-3 p-3 d-flex flex-row align-items-center">
                  {/* Link to Product Details Page */}
                  <Link to={`/product/${item.id}`} className="d-flex align-items-center" style={{ textDecoration: "none", color: "inherit" }}>
                    {/* Item Image */}
                    <img
                      src={itemImage}
                      alt={item.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px" }}
                      onError={(e) => (e.target.src = "/OIP.png")}
                    />
                    {/* Item Details */}
                    <div className="flex-grow-1">
                      <h5>{item.name}</h5>
                      <p>₦{itemPrice.toFixed(2)} each</p>
                      <span>Total: ₦{(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </Link>

                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-secondary me-2"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => updateCartItemQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-secondary ms-2"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => updateCartItemQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Item */}
                  <button className="btn btn-danger ms-3" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              );
            })}

            {/* Total Price & Checkout */}
            <div className="text-end mb-5">
              <h4>Total: ₦{totalPrice.toFixed(2)}</h4>
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
