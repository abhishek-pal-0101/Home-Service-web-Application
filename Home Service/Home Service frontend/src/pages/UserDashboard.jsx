import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashBoard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({ total:0, pending:0, completed:0 });
  const [isLoading, setIsLoading] = useState(true);

  const [user] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (!user || user.role === "PROVIDER" || user.role === "ADMIN") {
      navigate("/login/customer"); return;
    }
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/bookings/user/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setStats({ total: data.length, pending: data.filter(b=>b.status==="PENDING").length, completed: data.filter(b=>b.status==="COMPLETED").length });
          setRecentBookings([...data].sort((a,b)=>b.id-a.id).slice(0,3));
        }
      } catch(e) { console.error(e); }
      finally { setIsLoading(false); }
    })();
  }, [user, navigate]);

  const logout = () => { localStorage.removeItem("user"); navigate("/login/customer"); };
  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"}) : "TBD";
  const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "User";

  if (!user) return null;

  return (
    <div className="ud-shell">
      {/* ── Sidebar ── */}
      <aside className="ud-sidebar">
        <div className="ud-brand">🏠 HomeService</div>
        <nav className="ud-nav">
          <Link to="/dashboard"    className="ud-nav-item active">📊 Dashboard</Link>
          <Link to="/services"     className="ud-nav-item">🔍 Browse Services</Link>
          <Link to="/book"         className="ud-nav-item">➕ Book a Service</Link>
          <Link to="/my-bookings"  className="ud-nav-item">📅 My Bookings</Link>
        </nav>
        <div className="ud-sidebar-footer">
          <div className="ud-user-info">
            <div className="ud-avatar">{displayName[0].toUpperCase()}</div>
            <div><strong>{displayName}</strong><span>Customer</span></div>
          </div>
          <button className="ud-logout" onClick={logout}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ud-main">
        {/* Header */}
        <div className="ud-topbar">
          <div>
            <h1>Welcome back, {displayName}! 👋</h1>
            <p>Here's what's happening with your services</p>
          </div>
          <Link to="/book" className="ud-book-btn">+ Book New Service</Link>
        </div>

        {/* Stats */}
        <div className="ud-stats">
          {[["📋","Total Bookings",stats.total,"#3b82f6"],["⏳","Pending",stats.pending,"#f59e0b"],["✅","Completed",stats.completed,"#10b981"]].map(([ic,lb,vl,cl])=>(
            <div key={lb} className="ud-stat-card" style={{borderTop:`4px solid ${cl}`}}>
              <span className="ud-stat-icon">{ic}</span>
              <div><p>{lb}</p><h2>{isLoading?"-":vl}</h2></div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="ud-grid">
          <div className="ud-card">
            <h3>Recent Activity</h3>
            {isLoading ? <p className="ud-muted">Loading...</p>
              : recentBookings.length === 0 ? <p className="ud-muted">No bookings yet. Book your first service!</p>
              : recentBookings.map(b=>(
                <div key={b.id} className="ud-booking-row">
                  <div><strong>{b.serviceName||"Service"}</strong><span>{fmt(b.bookingDate)}</span></div>
                  <span className={`ud-badge ${b.status?.toLowerCase()}`}>{b.status}</span>
                </div>
              ))}
            {recentBookings.length>0 && <Link to="/my-bookings" className="ud-view-all">View All →</Link>}
          </div>
          <div className="ud-card">
            <h3>Quick Actions</h3>
            <div className="ud-actions">
              {[["🔍","Explore Services","/services"],["📅","My Bookings","/my-bookings"],["➕","Book a Service","/book"]].map(([ic,lb,to])=>(
                <Link key={lb} to={to} className="ud-action-btn"><span>{ic}</span>{lb}</Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
