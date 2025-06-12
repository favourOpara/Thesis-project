import React from "react"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./assets/img/favicon.ico";
import "../layouts/horizontal-light-menu/css/light/loader.css";
import "../layouts/horizontal-light-menu/css/dark/loader.css";
import "../src/bootstrap/css/bootstrap.min.css";
import "../layouts/horizontal-light-menu/css/light/plugins.css";
import "../layouts/horizontal-light-menu/css/dark/plugins.css";
import "./assets/css/light/components/media_object.css";
import "./assets/css/dark/components/media_object.css";

import EditProduct from "./components/EditProduct";
import SellerProductListTest from "./components/SellerProductListTest";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import CartPage from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import ProductDetails from "./pages/ProductDetails";
import BecomeASeller from "./pages/BecomeASeller";
import SellerSignUp from "./pages/SellerSignup";
import UpdateProfile from "./pages/UpdateProfile";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import AddProduct from "./pages/AddProduct";

import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CartProvider } from "./context/CartContext";
import GlobalNotification from "./components/GlobalNotification";
import ProductList from "./components/ProductList";
import SearchResults from "./components/SearchResults";
import CookieConsent from "./components/CookieConsent"; // <-- Import CookieConsent

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <NotificationProvider>
          <CartProvider>
            <Router>
              <GlobalNotification />
              {/* Cookie prompt is always available at the root */}
              <CookieConsent />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/becomeaseller" element={<BecomeASeller />} />
                  <Route path="/sellersignup" element={<SellerSignUp />} />
                  <Route path="/edit-profile" element={<UpdateProfile />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="/seller-dashboard" element={<SellerProductListTest />} />
                  <Route path="/edit-product/:id" element={<EditProduct />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
