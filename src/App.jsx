import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Shop Pages
import Products from "./pages/shop/Products";
import Trophies from "./pages/shop/Trophies";
import ProductDetail from "./pages/shop/ProductDetail";

// User Pages
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import OrderHistory from "./pages/user/OrderHistory";
import Profile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUserProfile from "./pages/admin/AdminUserProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastProvider } from "./components/ToastProvider";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ScrollToTop from "./components/ScrollToTop";

// Layout Component to handle Route-Specific Styles
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <ToastProvider />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/category/:category" element={<Products />} />
                <Route path="/trophies" element={<Trophies />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:uid"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminUserProfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
