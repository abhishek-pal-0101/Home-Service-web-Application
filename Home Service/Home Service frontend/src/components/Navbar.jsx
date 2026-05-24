// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser]             = useState(null);
  const [isMobileOpen, setMobile]   = useState(false);

  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem("user");
      setUser(s ? JSON.parse(s) : null);
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMobile(false);
    navigate("/");
  };

  const active = (path) => location.pathname === path ? "active" : "";
  const close  = ()     => setMobile(false);

  // Safe display name — handles all response shapes
  const displayName = user?.fullName || user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const roleLinks = () => {
    if (!user) return null;
    if (user.role === "ADMIN") return (
      <Link to="/admin-dashboard" className="nav-link nav-highlight" onClick={close}>⚙️ Admin Panel</Link>
    );
    if (user.role === "PROVIDER") return (
      <Link to="/provider-dashboard" className="nav-link nav-highlight" onClick={close}>🔧 Provider Portal</Link>
    );
    // CUSTOMER (default)
    return (
      <>
        <Link to="/dashboard"    className={`nav-link nav-highlight ${active("/dashboard")}`}    onClick={close}>Dashboard</Link>
        <Link to="/my-bookings"  className={`nav-link ${active("/my-bookings")}`}               onClick={close}>My Bookings</Link>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={close}>HomeService<span>.</span></Link>
      </div>

      <button className="mobile-menu-btn" onClick={() => setMobile(!isMobileOpen)}>
        {isMobileOpen ? "✖" : "☰"}
      </button>

      <div className={`navbar-links ${isMobileOpen ? "open" : ""}`}>
        <Link to="/"        className={`nav-link ${active("/")}`}        onClick={close}>Home</Link>
        <Link to="/services"className={`nav-link ${active("/services")}`} onClick={close}>Services</Link>
        {roleLinks()}

        {user && isMobileOpen && (
          <button onClick={logout} className="logout-btn" style={{ marginTop:"10px" }}>Logout</button>
        )}
        {!user && isMobileOpen && (
          <Link to="/login/customer" className="login-btn" onClick={close} style={{ marginTop:"15px", display:"inline-block" }}>
            Login / Sign Up
          </Link>
        )}
      </div>

      <div className="navbar-auth">
        {user ? (
          <div className="user-menu">
            <span className="welcome-text">Hi, {displayName}</span>
            <span style={{ fontSize:"0.75rem", color:"#94a3b8", marginLeft:"6px" }}>
              [{user.role}]
            </span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <Link to="/login/customer" className="login-btn">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
