// src/pages/MyBookings.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Get logged-in user
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 2. Fetch User's Bookings
  useEffect(() => {
    if (!user) {
      navigate("/login/customer");
      return;
    }

    const fetchMyBookings = async () => {
      try {
        // 🌟 CONNECTS TO YOUR SPECIFIC BACKEND ENDPOINT 🌟
        const response = await fetch(
          `http://localhost:8080/api/bookings/user/${user.email}`,
        );

        if (response.ok) {
          const data = await response.json();
          // Sort so newest bookings appear at the top
          data.sort((a, b) => b.id - a.id);
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Server error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Status color helper
  const getStatusClass = (status) => {
    if (!status) return "pending";
    return status.toLowerCase();
  };

  if (!user) return null;

  return (
    <div className="my-bookings-wrapper">
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <h2>My Service Bookings</h2>
          <p>Track your upcoming and past service requests in one place.</p>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>You haven't scheduled any home services. Let's fix that!</p>
            <Link to="/services" className="explore-btn">
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div className="modern-booking-card" key={booking.id}>
                <div className="card-header">
                  <div>
                    <h3>{booking.serviceType}</h3>
                    <span className="booking-id">Booking #{booking.id}</span>
                  </div>
                  <span className={`badge ${getStatusClass(booking.status)}`}>
                    {booking.status || "PENDING"}
                  </span>
                </div>

                <div className="card-body">
                  {/* Name & Email Row */}
                  <div className="detail-row">
                    <span className="detail-icon">👤</span>
                    <div className="detail-info">
                      <span className="detail-label">Booked By</span>
                      <span className="detail-value">
                        {booking.name || user.name} ({booking.userEmail})
                      </span>
                    </div>
                  </div>

                  {/* Add this inside your Booking Card layout in MyBookings.jsx */}
                  <div className="card-detail-row">
                    <div className="icon">🛠️</div>
                    <div className="detail-text">
                      <span className="label">SERVICE TYPE</span>
                      {/* This safely checks both database columns! */}
                      <strong>
                        {booking.serviceType ||
                          booking.serviceName ||
                          "General Service"}
                      </strong>
                    </div>
                  </div>

                  {/* Date Row */}
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <div className="detail-info">
                      <span className="detail-label">Scheduled For</span>
                      <span className="detail-value">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  {/* Address Row */}
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <div className="detail-info">
                      <span className="detail-label">Service Address</span>
                      <span className="detail-value">{booking.address}</span>
                    </div>
                  </div>

                  {/* Phone Row */}
                  <div className="detail-row">
                    <span className="detail-icon">📞</span>
                    <div className="detail-info">
                      <span className="detail-label">Contact Number</span>
                      <span className="detail-value">{booking.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
