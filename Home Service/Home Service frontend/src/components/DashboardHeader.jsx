// Role-specific dashboard headers — replaces Navbar inside dashboards
import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";

export const UserHeader = ({ user }) => {
  const navigate = useNavigate();
  const name = user?.fullName || user?.name || user?.email?.split("@")[0] || "User";
  return (
    <header className="dash-header user-header">
      <div className="dash-header-left">
        <div className="dash-logo" onClick={() => navigate("/")}>HomeService<span>.</span></div>
        <nav className="dash-nav">
          <button onClick={() => navigate("/dashboard")}    className="dash-nav-btn">🏠 Dashboard</button>
          <button onClick={() => navigate("/services")}     className="dash-nav-btn">🔍 Services</button>
          <button onClick={() => navigate("/book")}         className="dash-nav-btn">📅 Book Service</button>
          <button onClick={() => navigate("/my-bookings")}  className="dash-nav-btn">📋 My Bookings</button>
        </nav>
      </div>
      <div className="dash-header-right">
        <div className="dash-user-info">
          <div className="dash-avatar user-avatar">{name[0].toUpperCase()}</div>
          <div>
            <div className="dash-username">{name}</div>
            <div className="dash-role-badge user-badge">Customer</div>
          </div>
        </div>
        <button className="dash-logout user-logout" onClick={() => {
          localStorage.removeItem("user"); navigate("/auth");
        }}>Logout</button>
      </div>
    </header>
  );
};

export const ProviderHeader = ({ user }) => {
  const navigate = useNavigate();
  const name = user?.fullName || user?.name || user?.email?.split("@")[0] || "Provider";
  return (
    <header className="dash-header provider-header">
      <div className="dash-header-left">
        <div className="dash-logo" onClick={() => navigate("/")}>HomeService<span>.</span></div>
        <nav className="dash-nav">
          <button onClick={() => navigate("/provider-dashboard")} className="dash-nav-btn">🔧 My Jobs</button>
          <button onClick={() => navigate("/")}                   className="dash-nav-btn">🏠 Home</button>
        </nav>
      </div>
      <div className="dash-header-right">
        <div className="dash-user-info">
          <div className="dash-avatar provider-avatar">{name[0].toUpperCase()}</div>
          <div>
            <div className="dash-username">{name}</div>
            <div className="dash-role-badge provider-badge">🔧 {user?.serviceType || "Provider"}</div>
          </div>
        </div>
        <button className="dash-logout provider-logout" onClick={() => {
          localStorage.removeItem("user"); navigate("/provider-login");
        }}>Logout</button>
      </div>
    </header>
  );
};

export const AdminHeader = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const name = user?.fullName || user?.email?.split("@")[0] || "Admin";
  return (
    <header className="dash-header admin-header">
      <div className="dash-header-left">
        <div className="dash-logo admin-logo">⚙️ Admin Panel</div>
        <nav className="dash-nav">
          {[["bookings","📋 Bookings"],["users","👥 Users"],["services","🛠️ Services"]].map(([tab, lbl]) => (
            <button key={tab}
              className={`dash-nav-btn ${activeTab === tab ? "admin-nav-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >{lbl}</button>
          ))}
        </nav>
      </div>
      <div className="dash-header-right">
        <div className="dash-user-info">
          <div className="dash-avatar admin-avatar">{name[0].toUpperCase()}</div>
          <div>
            <div className="dash-username">{name}</div>
            <div className="dash-role-badge admin-badge">⚙️ Administrator</div>
          </div>
        </div>
        <button className="dash-logout admin-logout" onClick={() => {
          localStorage.removeItem("user"); navigate("/admin-login");
        }}>Logout</button>
      </div>
    </header>
  );
};
