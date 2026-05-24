// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const SERVICE_TYPES = [
  "Plumbing","Electrical","Home Cleaning","Carpentry",
  "Painting","AC Repair","Pest Control","Appliance Repair","Gardening",
];

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("CUSTOMER");
  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "", email: "", password: "", serviceType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin
      ? "http://localhost:8080/api/users/login"
      : "http://localhost:8080/api/users/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage"));

        const r = userData.role;
        if (r === "ADMIN") navigate("/admin-dashboard");
        else if (r === "PROVIDER") navigate("/provider-dashboard");
        else navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setError(errorText || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Is Spring Boot running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create an Account"}</h2>
          <p>{isLogin ? "Sign in to manage your home services." : "Join HomeService today."}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="role-selector">
              {["CUSTOMER","PROVIDER","ADMIN"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r === "CUSTOMER" ? "👤 Customer"
                   : r === "PROVIDER" ? "🔧 Professional"
                   : "⚙️ Admin"}
                </button>
              ))}
            </div>
          )}

          {!isLogin && (
            <div className="input-row">
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="auth-input-group">
                <label>Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber}
                  onChange={handleChange} placeholder="9876543210" required />
              </div>
            </div>
          )}

          {!isLogin && role === "PROVIDER" && (
            <div className="auth-input-group">
              <label>Your Service Expertise</label>
              <select name="serviceType" value={formData.serviceType}
                onChange={handleChange} required
                style={{ padding:"0.8rem 1rem", border:"1px solid #cbd5e1",
                  borderRadius:"8px", fontSize:"1rem", backgroundColor:"#f8fafc", marginTop:"0.4rem" }}>
                <option value="" disabled>Select your profession...</option>
                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="name@example.com" required />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account?{" "}
              <span onClick={() => { setIsLogin(false); setError(""); }}>Sign up here</span>
            </p>
          ) : (
            <p>Already have an account?{" "}
              <span onClick={() => { setIsLogin(true); setError(""); }}>Sign in here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
