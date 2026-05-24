// Customer Login & Signup — /login/customer
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RoleAuth.css";

export default function UserAuth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName:"", phoneNumber:"", email:"", password:"" });
  const set = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    const url = tab === "login"
      ? "http://localhost:8080/api/users/login"
      : "http://localhost:8080/api/users/register";
    const body = tab === "login"
      ? { email: form.email, password: form.password }
      : { ...form, role: "CUSTOMER" };
    try {
      const res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        if (data.role && data.role !== "CUSTOMER") { setError("This account is not a Customer account."); return; }
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      } else { setError(await res.text() || "Failed. Try again."); }
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return (
    <div className="role-auth-wrapper user-theme">
      <div className="role-auth-card">
        <div className="role-auth-brand">
          <div className="role-icon">👤</div>
          <h1>Customer Portal</h1>
          <p>Book and manage your home services</p>
        </div>
        <div className="role-tabs">
          <button className={tab==="login"?"active":""} onClick={()=>{setTab("login");setError("");}}>Sign In</button>
          <button className={tab==="signup"?"active":""} onClick={()=>{setTab("signup");setError("");}}>Sign Up</button>
        </div>
        {error && <div className="role-error">⚠️ {error}</div>}
        <form className="role-form" onSubmit={submit}>
          {tab==="signup" && <>
            <div className="role-input-group"><label>Full Name</label><input name="fullName" value={form.fullName} onChange={set} placeholder="John Doe" required /></div>
            <div className="role-input-group"><label>Phone Number</label><input name="phoneNumber" value={form.phoneNumber} onChange={set} placeholder="9876543210" required /></div>
          </>}
          <div className="role-input-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={set} placeholder="you@example.com" required /></div>
          <div className="role-input-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={set} placeholder="••••••••" required /></div>
          <button type="submit" className="role-submit user-submit" disabled={loading}>{loading?"Processing...":(tab==="login"?"Sign In →":"Create Account →")}</button>
        </form>
        <div className="role-links">
          <p>Are you a professional? <Link to="/login/provider">Provider Login</Link></p>
          <p><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
