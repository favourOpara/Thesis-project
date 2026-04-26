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

// Pages
import Home           from "./pages/Home";
import SignIn          from "./pages/Signin";
import SignUp          from "./pages/Signup";
import SellerSignUp    from "./pages/SellerSignup";
import UserProfile     from "./pages/UserProfile";
import UpdateProfile   from "./pages/UpdateProfile";
import ShopPage        from "./pages/ShopPage";
import ProductDetails  from "./pages/ProductDetails";
import CategoryPage    from "./pages/CategoryPage";
import Cart            from "./pages/Cart";
import Checkout        from "./pages/Checkout";
import Orders          from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct      from "./pages/AddProduct";
import BecomeASeller   from "./pages/BecomeASeller";
import NotFound        from "./pages/NotFound";
import ComingSoon      from "./pages/ComingSoon";

// Components
import EditProduct       from "./components/EditProduct";
import ProductList       from "./components/ProductList";
import SearchResults     from "./components/SearchResults";
import GlobalNotification from "./components/GlobalNotification";
import CookieConsent     from "./components/CookieConsent";

// Contexts
import { AuthProvider }         from "./context/AuthContext";
import { CartProvider }         from "./context/CartContext";
import { SearchProvider }       from "./context/SearchContext";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <NotificationProvider>
            <Router>
              <GlobalNotification />
              <CookieConsent />
              <main>
                <Routes>
                  {/* Public */}
                  <Route path="/"                      element={<Home />} />
                  <Route path="/signin"                element={<SignIn />} />
                  <Route path="/signup"                element={<SignUp />} />
                  <Route path="/sellersignup"          element={<SellerSignUp />} />
                  <Route path="/becomeaseller"         element={<BecomeASeller />} />
                  <Route path="/shop/:slug"            element={<ShopPage />} />
                  <Route path="/product/:id"           element={<ProductDetails />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/products"              element={<ProductList />} />
                  <Route path="/search"                element={<SearchResults />} />
                  <Route path="/coming-soon"           element={<ComingSoon />} />

                  {/* Buyer */}
                  <Route path="/cart"                  element={<Cart />} />
                  <Route path="/checkout"              element={<Checkout />} />
                  <Route path="/orders"                element={<Orders />} />
                  <Route path="/user-profile"          element={<UserProfile />} />
                  <Route path="/edit-profile"          element={<UpdateProfile />} />

                  {/* Seller */}
                  <Route path="/seller-dashboard"      element={<SellerDashboard />} />
                  <Route path="/add-product"           element={<AddProduct />} />
                  <Route path="/edit-product/:id"      element={<EditProduct />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Router>
          </NotificationProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
