// Provider Login & Signup — /login/provider
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RoleAuth.css";

const SERVICE_TYPES = ["Plumbing","Electrical","Home Cleaning","Carpentry","Painting","AC Repair","Pest Control","Appliance Repair","Gardening"];

export default function ProviderAuth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName:"", phoneNumber:"", email:"", password:"", serviceType:"" });
  const set = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    const url = tab === "login"
      ? "http://localhost:8080/api/users/login"
      : "http://localhost:8080/api/users/register";
    const body = tab === "login"
      ? { email: form.email, password: form.password }
      : { ...form, role: "PROVIDER" };
    try {
      const res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        if (data.role && data.role !== "PROVIDER") { setError("This is not a Provider account. Use Customer login."); return; }
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
        navigate("/provider-dashboard");
      } else { setError(await res.text() || "Failed. Try again."); }
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return (
    <div className="role-auth-wrapper provider-theme">
      <div className="role-auth-card">
        <div className="role-auth-brand">
          <div className="role-icon">🔧</div>
          <h1>Professional Portal</h1>
          <p>Manage your service jobs & earnings</p>
        </div>
        <div className="role-tabs">
          <button className={tab==="login"?"active":""} onClick={()=>{setTab("login");setError("");}}>Sign In</button>
          <button className={tab==="signup"?"active":""} onClick={()=>{setTab("signup");setError("");}}>Join as Pro</button>
        </div>
        {error && <div className="role-error">⚠️ {error}</div>}
        <form className="role-form" onSubmit={submit}>
          {tab==="signup" && <>
            <div className="role-input-group"><label>Full Name</label><input name="fullName" value={form.fullName} onChange={set} placeholder="Your name" required /></div>
            <div className="role-input-group"><label>Phone Number</label><input name="phoneNumber" value={form.phoneNumber} onChange={set} placeholder="9876543210" required /></div>
            <div className="role-input-group">
              <label>Your Service Expertise</label>
              <select name="serviceType" value={form.serviceType} onChange={set} required>
                <option value="" disabled>Select your profession...</option>
                {SERVICE_TYPES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </>}
          <div className="role-input-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={set} placeholder="pro@example.com" required /></div>
          <div className="role-input-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={set} placeholder="••••••••" required /></div>
          <button type="submit" className="role-submit provider-submit" disabled={loading}>{loading?"Processing...":(tab==="login"?"Sign In →":"Register as Pro →")}</button>
        </form>
        <div className="role-links">
          <p>Looking for services? <Link to="/login/customer">Customer Login</Link></p>
          <p><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
