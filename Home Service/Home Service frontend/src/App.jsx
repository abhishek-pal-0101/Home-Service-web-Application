import React from "react";
import Footer from "./components/Footer";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProviderDashboard from "./pages/ProviderDashboard";
import UserDashboard from "./pages/UserDashboard";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import AuthPage from "./pages/AuthPage";
import UserAuth from "./pages/UserAuth";
import ProviderAuth from "./pages/ProviderAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";

// Dashboard routes — these have their OWN internal header, no shared Navbar/Footer
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/provider-dashboard",
  "/admin-dashboard",
  "/my-bookings",
];

function Layout() {
  const location = useLocation();
  const isDashboard = DASHBOARD_ROUTES.some((r) =>
    location.pathname.startsWith(r),
  );

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className={isDashboard ? "" : "main-content"}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Separate login pages per role */}
          <Route path="/auth" element={<UserAuth />} />
          <Route path="/login/customer" element={<UserAuth />} />
          <Route path="/login/provider" element={<ProviderAuth />} />
          <Route path="/login/admin" element={<AdminAuth />} />

          {/* Role dashboards — each has its own internal header */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
