// Admin Login — /login/admin (no signup, admin accounts created directly in DB)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RoleAuth.css";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email:"", password:"" });
  const set = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.role !== "ADMIN") { setError("Access denied. This is not an Admin account."); return; }
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
        navigate("/admin-dashboard");
      } else { setError("Invalid admin credentials."); }
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return (
    <div className="role-auth-wrapper admin-theme">
      <div className="role-auth-card">
        <div className="role-auth-brand">
          <div className="role-icon">⚙️</div>
          <h1>Admin Control Panel</h1>
          <p>HomeService system administration</p>
        </div>
        <div className="admin-shield">🛡️ RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY</div>
        {error && <div className="role-error">⚠️ {error}</div>}
        <form className="role-form" onSubmit={submit}>
          <div className="role-input-group"><label>Admin Email</label><input type="email" name="email" value={form.email} onChange={set} placeholder="admin@homeservice.com" required /></div>
          <div className="role-input-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={set} placeholder="••••••••" required /></div>
          <button type="submit" className="role-submit admin-submit" disabled={loading}>{loading?"Authenticating...":"Access Admin Panel →"}</button>
        </form>
        <div className="role-links">
          <p><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
