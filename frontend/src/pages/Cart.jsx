import React from "react";
import { Link } from "react-router-dom";
import { useGetCartItemsQuery, useUpdateCartItemQuantityMutation, useRemoveFromCartMutation } from "../redux/api/cartApi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const { data: cartItems = [] } = useGetCartItemsQuery();
  const [updateQuantity] = useUpdateCartItemQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const totalPrice = cartItems.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);

  const updateCartItemQuantity = (id, change) => {
    // Update the quantity based on the change (either -1 or +1)
    updateQuantity({ productId: id, quantity: change });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto" style={{ marginTop: "0px", minHeight: "100vh" }}>
        <h2 className="text-center" style={{ marginTop: "0px", marginBottom: "100px" }}>Your Shopping Cart</h2>

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
                <div key={item.id} className="card mb-3 p-3 d-flex flex-row align-items-center" style={{ boxSizing: 'border-box' }}>
                  <Link to={`/product/${item.id}`} className="d-flex align-items-center" style={{ textDecoration: "none", color: "inherit" }}>
                    <img
                      src={itemImage}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                      onError={(e) => (e.target.src = "/OIP.png")}
                    />
                    <div className="flex-grow-1">
                      <h5>{item.name}</h5>
                      <p>₦{itemPrice.toFixed(2)} each</p>
                      <span>Total: ₦{(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </Link>

                  <div className="d-flex align-items-center" style={{ flexShrink: 0 }}>
                    {/* Quantity Controls */}
                    <button
                      className="btn btn-secondary me-2"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => updateQuantity({ productId: item.id, quantity: item.quantity - 1 })}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-secondary ms-2"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => updateQuantity({ productId: item.id, quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-3"
                      onClick={() => removeFromCart(item.id)}
                      style={{ padding: "8px 10px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="mt-4 d-flex justify-content-between">
              <h4>Total: ₦{totalPrice.toFixed(2)}</h4>
              <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
