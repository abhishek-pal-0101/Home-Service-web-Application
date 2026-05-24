// src/pages/AdminDashboard.jsx
// DEVELOPER-ONLY ADMIN DASHBOARD
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API = "http://localhost:8080/api";
const SERVICE_TYPES = [
  "Plumbing",
  "Electrical",
  "Home Cleaning",
  "Carpentry",
  "Painting",
  "AC Repair",
  "Pest Control",
  "Appliance Repair",
  "Gardening",
];
const DEV_PIN = "0000"; // Change this to your secret PIN

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "ok" });
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterService, setFilterService] = useState("ALL");
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchUser, setSearchUser] = useState("");
  const [newSvc, setNewSvc] = useState({
    name: "",
    description: "",
    basePrice: "",
  });
  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState(new Date());
  const pinRef = useRef(null);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Auth guard
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      navigate("/login/admin");
      return;
    }
    const parsed = JSON.parse(u);
    if (parsed.role !== "ADMIN") {
      navigate("/login/admin");
      return;
    }
    addLog("System", "Admin session authenticated");
    fetchAll();
  }, [navigate]);

  const addLog = (action, detail) => {
    const entry = `[${new Date().toLocaleTimeString()}] ${action}: ${detail}`;
    setLogs((prev) => [entry, ...prev].slice(0, 50));
  };

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, uRes] = await Promise.all([
        fetch(`${API}/bookings`),
        fetch(`${API}/users/all`),
      ]);
      if (bRes.ok) {
        const d = await bRes.json();
        setBookings(Array.isArray(d) ? d : []);
        addLog("FETCH", "Bookings loaded");
      }
      if (uRes.ok) {
        const d = await uRes.json();
        setUsers(Array.isArray(d) ? d : []);
        addLog("FETCH", "Users loaded");
      }
      fetch(`${API}/services/all`)
        .then((r) => (r.ok ? r.json() : []))
        .then((d) => setServices(Array.isArray(d) ? d : []))
        .catch(() => {});
    } catch (e) {
      addLog("ERROR", e.message);
    } finally {
      setLoading(false);
    }
  };

  // PIN lock
  const checkPin = () => {
    if (pin === DEV_PIN) {
      setPinUnlocked(true);
      addLog("AUTH", "Developer PIN verified");
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 1500);
    }
  };

  const handlePinKey = (e) => {
    if (e.key === "Enter") checkPin();
  };

  // Actions
  const changeBookingStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
    showToast(`Booking #${id} → ${status}`);
    addLog("UPDATE", `Booking #${id} status → ${status}`);
  };

  const deleteUser = async (id, email) => {
    if (!window.confirm(`Delete user: ${email}?`)) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast("User deleted", "warn");
    addLog("DELETE", `User #${id} (${email}) removed`);
  };

  const addService = async (e) => {
    e.preventDefault();
    const r = await fetch(`${API}/services/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSvc),
    });
    if (r.ok) {
      const d = await r.json();
      setServices((prev) => [...prev, d]);
      setNewSvc({ name: "", description: "", basePrice: "" });
      showToast("Service added");
      addLog("CREATE", `Service "${newSvc.name}" added`);
    }
  };

  const deleteService = async (id, name) => {
    if (!window.confirm(`Delete service: ${name}?`)) return;
    await fetch(`${API}/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast("Service deleted", "warn");
    addLog("DELETE", `Service "${name}" removed`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login/admin");
  };

  // Stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const customers = users.filter((u) => u.role === "CUSTOMER").length;
  const providers = users.filter((u) => u.role === "PROVIDER").length;

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== "ALL" && b.status !== filterStatus) return false;
    if (filterService !== "ALL" && b.serviceName !== filterService)
      return false;
    return true;
  });

  const filteredUsers = users.filter((u) => {
    if (filterRole !== "ALL" && u.role !== filterRole) return false;
    const q = searchUser.toLowerCase();
    return (
      !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const statusBadge = (s) => {
    const map = {
      PENDING: { bg: "#f59e0b22", fg: "#f59e0b", border: "#f59e0b44" },
      CONFIRMED: { bg: "#10b98122", fg: "#10b981", border: "#10b98144" },
      COMPLETED: { bg: "#3b82f622", fg: "#60a5fa", border: "#3b82f644" },
      CANCELLED: { bg: "#ef444422", fg: "#f87171", border: "#ef444444" },
    };
    const c = map[s] || { bg: "#ffffff11", fg: "#9ca3af", border: "#ffffff22" };
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontWeight: 700,
          background: c.bg,
          color: c.fg,
          border: `1px solid ${c.border}`,
        }}
      >
        {s}
      </span>
    );
  };

  const roleBadge = (r) => {
    const map = {
      ADMIN: { bg: "#7c3aed22", fg: "#a78bfa" },
      PROVIDER: { bg: "#0891b222", fg: "#22d3ee" },
      CUSTOMER: { bg: "#ffffff11", fg: "#9ca3af" },
    };
    const c = map[r] || map.CUSTOMER;
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontWeight: 700,
          background: c.bg,
          color: c.fg,
        }}
      >
        {r || "CUSTOMER"}
      </span>
    );
  };

  // ── PIN LOCK SCREEN ──
  if (!pinUnlocked) {
    return (
      <div className="adm-pin-screen">
        <div
          className="adm-pin-card"
          style={{ animation: pinError ? "adm-shake 0.4s ease" : "none" }}
        >
          <div className="adm-pin-logo">⬡</div>
          <h2 className="adm-pin-title">DEVELOPER ACCESS</h2>
          <p className="adm-pin-sub">HomeService Admin Console · Restricted</p>
          <div className="adm-pin-dots">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`adm-pin-dot ${pin.length > i ? "filled" : ""}`}
              ></div>
            ))}
          </div>
          <input
            ref={pinRef}
            className="adm-pin-input"
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              if (e.target.value.length === 4) {
                setTimeout(() => {
                  if (e.target.value === DEV_PIN) {
                    setPinUnlocked(true);
                    addLog("AUTH", "Developer PIN verified");
                  } else {
                    setPinError(true);
                    setPin("");
                    setTimeout(() => setPinError(false), 1500);
                  }
                }, 100);
              }
            }}
            onKeyDown={handlePinKey}
            placeholder="Enter 4-digit PIN"
            autoFocus
          />
          <p className="adm-pin-hint">
            {pinError
              ? "❌ Incorrect PIN"
              : "Enter your developer PIN to continue"}
          </p>
          <div className="adm-pin-warning">
            ⚠ Unauthorised access is logged and monitored
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD ──
  const adminEmail =
    JSON.parse(localStorage.getItem("user") || "{}").email || "admin";

  return (
    <div className="adm-shell">
      {toast.msg && (
        <div className={`adm-toast ${toast.type === "warn" ? "warn" : ""}`}>
          {toast.type === "warn" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          <div className="adm-brand">
            <span className="adm-brand-hex">⬡</span>
            <div>
              <div className="adm-brand-title">ADMIN</div>
              <div className="adm-brand-sub">Developer Console</div>
            </div>
          </div>
          <div className="adm-clock">
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>

        <nav className="adm-nav">
          {[
            ["overview", "◈", "Overview"],
            ["bookings", "⊞", "Bookings"],
            ["users", "⊙", "Users"],
            ["services", "⊕", "Services"],
            ["logs", "⊘", "Dev Logs"],
          ].map(([tab, ic, lb]) => (
            <button
              key={tab}
              className={`adm-nav-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="adm-nav-ic">{ic}</span>
              {lb}
              {tab === "bookings" && pending > 0 && (
                <span className="adm-nav-badge">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-dev-tag">DEV · {adminEmail}</div>
          <button className="adm-refresh-btn" onClick={fetchAll}>
            ⟳ Sync Data
          </button>
          <button className="adm-logout-btn" onClick={logout}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="adm-main">
        {/* Topbar */}
        <div className="adm-topbar">
          <div>
            <h1 className="adm-page-title">
              {activeTab === "overview"
                ? "System Overview"
                : activeTab === "bookings"
                  ? "Booking Management"
                  : activeTab === "users"
                    ? "User Management"
                    : activeTab === "services"
                      ? "Service Catalogue"
                      : "Developer Logs"}
            </h1>
            <span className="adm-page-sub">
              HomeService Admin Console ·{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {loading && <div className="adm-loading-pill">⟳ Loading...</div>}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            <div className="adm-stats-grid">
              {[
                ["Total Bookings", total, "#60a5fa", "⊞"],
                ["Pending", pending, "#f59e0b", "⏳"],
                ["Confirmed", confirmed, "#10b981", "✓"],
                ["Completed", completed, "#818cf8", "◉"],
                ["Cancelled", cancelled, "#f87171", "✗"],
                ["Customers", customers, "#22d3ee", "⊙"],
                ["Providers", providers, "#a78bfa", "⊕"],
                ["Services", services.length, "#34d399", "⬡"],
              ].map(([label, val, color, ic]) => (
                <div
                  key={label}
                  className="adm-stat-card"
                  style={{ "--accent": color }}
                >
                  <div className="adm-stat-icon">{ic}</div>
                  <div className="adm-stat-val">{val}</div>
                  <div className="adm-stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Service breakdown */}
            <div className="adm-overview-grid">
              <div className="adm-panel">
                <div className="adm-panel-title">📊 Bookings by Service</div>
                {SERVICE_TYPES.map((svc) => {
                  const count = bookings.filter(
                    (b) => b.serviceName === svc,
                  ).length;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return count > 0 ? (
                    <div key={svc} className="adm-bar-row">
                      <span className="adm-bar-label">{svc}</span>
                      <div className="adm-bar-track">
                        <div
                          className="adm-bar-fill"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="adm-bar-count">{count}</span>
                    </div>
                  ) : null;
                })}
                {total === 0 && <p className="adm-empty">No bookings yet</p>}
              </div>
              <div className="adm-panel">
                <div className="adm-panel-title">⚡ Recent Activity</div>
                {logs.slice(0, 8).map((l, i) => (
                  <div key={i} className="adm-log-line">
                    {l}
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="adm-empty">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div>
            <div className="adm-filter-bar">
              <select
                className="adm-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                className="adm-select"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
              >
                <option value="ALL">All Services</option>
                {SERVICE_TYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <span className="adm-count-pill">
                {filteredBookings.length} records
              </span>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Customer",
                      "Email",
                      "Service",
                      "Date",
                      "Phone",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="adm-empty-row">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="adm-id">#{b.id}</span>
                        </td>
                        <td>
                          <strong>{b.customerName || "—"}</strong>
                        </td>
                        <td className="adm-muted">{b.userEmail || "—"}</td>
                        <td>
                          <span className="adm-svc-tag">
                            {b.serviceName || "—"}
                          </span>
                        </td>
                        <td className="adm-muted">
                          {b.bookingDate?.replace("T", " ").slice(0, 16) || "—"}
                        </td>
                        <td className="adm-muted">{b.phone || "—"}</td>
                        <td>{statusBadge(b.status)}</td>
                        <td>
                          <select
                            className="adm-action-sel"
                            value={b.status}
                            onChange={(e) =>
                              changeBookingStatus(b.id, e.target.value)
                            }
                          >
                            {[
                              "PENDING",
                              "CONFIRMED",
                              "COMPLETED",
                              "CANCELLED",
                            ].map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div>
            <div className="adm-filter-bar">
              <input
                className="adm-search"
                placeholder="Search name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <select
                className="adm-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                {["CUSTOMER", "PROVIDER", "ADMIN"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <span className="adm-count-pill">
                {filteredUsers.length} users
              </span>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Full Name",
                      "Email",
                      "Phone",
                      "Role",
                      "Expertise",
                      "Action",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <span className="adm-id">#{u.id}</span>
                      </td>
                      <td>
                        <strong>{u.fullName || "—"}</strong>
                      </td>
                      <td className="adm-muted">{u.email}</td>
                      <td className="adm-muted">{u.phoneNumber || "—"}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td className="adm-muted">{u.serviceType || "—"}</td>
                      <td>
                        <button
                          className="adm-del-btn"
                          onClick={() => deleteUser(u.id, u.email)}
                        >
                          ✗ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === "services" && (
          <div>
            <div className="adm-panel" style={{ marginBottom: "20px" }}>
              <div className="adm-panel-title">➕ Add New Service</div>
              <form className="adm-svc-form" onSubmit={addService}>
                <input
                  required
                  className="adm-inp"
                  placeholder="Service name"
                  value={newSvc.name}
                  onChange={(e) =>
                    setNewSvc({ ...newSvc, name: e.target.value })
                  }
                />
                <input
                  required
                  type="number"
                  className="adm-inp"
                  placeholder="Base price (₹)"
                  value={newSvc.basePrice}
                  onChange={(e) =>
                    setNewSvc({ ...newSvc, basePrice: e.target.value })
                  }
                />
                <input
                  required
                  className="adm-inp adm-inp-full"
                  placeholder="Short description"
                  value={newSvc.description}
                  onChange={(e) =>
                    setNewSvc({ ...newSvc, description: e.target.value })
                  }
                />
                <button type="submit" className="adm-add-btn">
                  + Add Service
                </button>
              </form>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    {["ID", "Name", "Base Price", "Description", "Action"].map(
                      (h) => (
                        <th key={h}>{h}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="adm-empty-row">
                        No services yet. Add one above.
                      </td>
                    </tr>
                  ) : (
                    services.map((sv) => (
                      <tr key={sv.id}>
                        <td>
                          <span className="adm-id">#{sv.id}</span>
                        </td>
                        <td>
                          <strong>{sv.name}</strong>
                        </td>
                        <td>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>
                            ₹{sv.basePrice}
                          </span>
                        </td>
                        <td className="adm-muted">{sv.description}</td>
                        <td>
                          <button
                            className="adm-del-btn"
                            onClick={() => deleteService(sv.id, sv.name)}
                          >
                            ✗ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── LOGS TAB ── */}
        {activeTab === "logs" && (
          <div className="adm-panel">
            <div className="adm-panel-title">
              ⊘ Developer Activity Log
              <button className="adm-clear-btn" onClick={() => setLogs([])}>
                Clear
              </button>
            </div>
            <div className="adm-log-console">
              {logs.length === 0 ? (
                <div className="adm-log-line adm-muted">
                  No activity recorded yet.
                </div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="adm-log-line">
                    <span
                      className={
                        l.includes("ERROR")
                          ? "adm-log-err"
                          : l.includes("DELETE")
                            ? "adm-log-warn"
                            : "adm-log-ok"
                      }
                    >
                      {l}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
