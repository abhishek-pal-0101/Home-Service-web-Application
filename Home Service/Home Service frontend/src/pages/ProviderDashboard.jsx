// src/pages/ProviderDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAcceptingJobs, setIsAcceptingJobs] = useState(true);
  const [toast, setToast] = useState("");

  const [user] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Provider's service expertise (from registration)
  const providerService = user?.serviceType || "";

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bookings");
      if (res.ok) {
        const data = await res.json();
        // KEY FIX: Only show bookings that match this provider's service type
        const mine = data.filter(
          (b) => b.serviceName?.toLowerCase() === providerService.toLowerCase()
        );
        setBookings(mine);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "PROVIDER") {
      navigate("/login/provider");
      return;
    }
    fetchBookings();
    const id = setInterval(fetchBookings, 10000);
    return () => clearInterval(id);
  }, [user, navigate]);

  const updateStatus = async (jobId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
        showToast(newStatus === "CONFIRMED" ? "✅ Job Accepted!" : "🎉 Job Marked Complete!");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const formatDate = (d) => {
    if (!d) return "Not Scheduled";
    const dt = new Date(d);
    if (isNaN(dt)) return "Pending Schedule";
    return dt.toLocaleString("en-IN", { weekday:"short", month:"short", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" });
  };

  if (!user) return null;

  const providerName = user.fullName || user.name || user.email?.split("@")[0] || "Provider";

  const pendingJobs  = bookings.filter(b => b.status === "PENDING");
  const activeJobs   = bookings.filter(b => b.status === "CONFIRMED" || b.status === "ACCEPTED");
  const historyJobs  = bookings.filter(b => ["COMPLETED","CANCELLED","REJECTED"].includes(b.status));

  const JobCard = ({ job }) => {
    const isPending  = job.status === "PENDING";
    const isActive   = job.status === "CONFIRMED" || job.status === "ACCEPTED";
    const isHistory  = ["COMPLETED","CANCELLED","REJECTED"].includes(job.status);

    return (
      <div className={`pro-card ${isPending ? "border-pending" : isActive ? "border-active" : ""}`}
        style={isHistory ? { borderTopColor: job.status==="COMPLETED"?"#3498db":"#e74c3c", opacity:0.85 } : {}}>
        <div className="pro-card-header">
          <span className="booking-id">Booking #{job.id}</span>
          <span className={`status-badge ${job.status?.toLowerCase()}`}>{job.status}</span>
        </div>
        <div className="pro-card-body">
          <div className="detail-row">
            <span className="icon">👤</span>
            <div className="text-stack">
              <span className="label">CUSTOMER</span>
              <strong>{job.customerName || "—"} &nbsp;·&nbsp; {job.userEmail || "—"}</strong>
            </div>
          </div>
          <div className="detail-row">
            <span className="icon">🛠️</span>
            <div className="text-stack">
              <span className="label">SERVICE</span>
              <strong>{job.serviceName || "—"}</strong>
            </div>
          </div>
          <div className="detail-row">
            <span className="icon">📅</span>
            <div className="text-stack">
              <span className="label">SCHEDULED FOR</span>
              <strong>{formatDate(job.bookingDate)}</strong>
            </div>
          </div>
          <div className="detail-row">
            <span className="icon">📍</span>
            <div className="text-stack">
              <span className="label">ADDRESS</span>
              <strong>{job.address || "—"}</strong>
            </div>
          </div>
          <div className="detail-row">
            <span className="icon">📞</span>
            <div className="text-stack">
              <span className="label">PHONE</span>
              <strong>{job.phone || "—"}</strong>
            </div>
          </div>
        </div>
        <div className="pro-card-footer">
          {isHistory ? (
            <div className="history-label" style={{ color: job.status==="COMPLETED"?"#2980b9":"#c0392b" }}>
              {job.status === "COMPLETED" ? "✅ Job Completed" : "❌ Job Cancelled"}
            </div>
          ) : isPending ? (
            <div style={{ display:"flex", gap:"10px" }}>
              <button className="btn-accept-full" onClick={() => updateStatus(job.id, "CONFIRMED")}>✓ Accept Job</button>
              <button className="btn-reject" onClick={() => updateStatus(job.id, "CANCELLED")}>✗ Decline</button>
            </div>
          ) : (
            <button className="btn-complete-full" onClick={() => updateStatus(job.id, "COMPLETED")}>
              ✓ Mark as Completed
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="provider-wrapper">
      {toast && <div className="provider-toast">{toast}</div>}

      {/* Internal Header */}
      <div className="prov-topbar">
        <div className="prov-topbar-brand">🔧 HomeService — Provider Portal</div>
        <div className="prov-topbar-right">
          <span className="prov-topbar-user">👷 {providerName} &nbsp;·&nbsp; <em>{providerService}</em></span>
          <button className="prov-topbar-logout" onClick={()=>{ localStorage.removeItem("user"); navigate("/login/provider"); }}>Logout</button>
        </div>
      </div>

      <div className="provider-container">
        {/* Banner */}
        <div className="provider-banner">
          <div>
            <h1>Welcome back, {providerName}!</h1>
            <p>
              You are a <strong>{providerService}</strong> specialist.
              Showing all <strong>{providerService}</strong> bookings.
            </p>
          </div>
          <div
            className="status-indicator"
            onClick={() => setIsAcceptingJobs(!isAcceptingJobs)}
            style={{
              cursor:"pointer",
              background: isAcceptingJobs?"rgba(46,204,113,0.2)":"rgba(149,165,166,0.2)",
              color: isAcceptingJobs?"#2ecc71":"#7f8c8d",
              borderColor: isAcceptingJobs?"#2ecc71":"#7f8c8d",
            }}
          >
            <div className="pulse-dot" style={{
              backgroundColor: isAcceptingJobs?"#2ecc71":"#7f8c8d",
              animation: isAcceptingJobs?"pulse 1.5s infinite":"none",
            }}></div>
            {isAcceptingJobs ? "Accepting New Jobs" : "Offline / Busy"}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="provider-stats">
          <div className="pstat-card" style={{ borderTopColor:"#f39c12" }}>
            <span>⏳</span>
            <div><p>New Requests</p><h3>{pendingJobs.length}</h3></div>
          </div>
          <div className="pstat-card" style={{ borderTopColor:"#3498db" }}>
            <span>🔧</span>
            <div><p>Active Jobs</p><h3>{activeJobs.length}</h3></div>
          </div>
          <div className="pstat-card" style={{ borderTopColor:"#2ecc71" }}>
            <span>✅</span>
            <div><p>Completed</p><h3>{historyJobs.filter(j=>j.status==="COMPLETED").length}</h3></div>
          </div>
        </div>

        {isLoading ? (
          <div className="provider-loading">Loading your jobs...</div>
        ) : (
          <>
            <div className="provider-layout">
              {/* New Requests */}
              <div className="job-section">
                <h3>New Requests {pendingJobs.length > 0 && <span className="badge-count">{pendingJobs.length}</span>}</h3>
                {pendingJobs.length === 0
                  ? <p className="empty-msg">No new {providerService} requests right now.</p>
                  : pendingJobs.map(j => <JobCard key={j.id} job={j} />)}
              </div>
              {/* Active Jobs */}
              <div className="job-section">
                <h3>My Active Jobs</h3>
                {activeJobs.length === 0
                  ? <p className="empty-msg">No active jobs.</p>
                  : activeJobs.map(j => <JobCard key={j.id} job={j} />)}
              </div>
            </div>
            {/* History */}
            <div className="job-section" style={{ marginTop:"2rem" }}>
              <h3>Job History</h3>
              {historyJobs.length === 0
                ? <p className="empty-msg">No completed or cancelled jobs yet.</p>
                : <div className="history-grid">{historyJobs.map(j => <JobCard key={j.id} job={j} />)}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
