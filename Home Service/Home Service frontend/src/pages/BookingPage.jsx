// src/pages/BookingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";

const SERVICES = [
  { name: "Plumbing", price: 499 },
  { name: "Electrical", price: 599 },
  { name: "Home Cleaning", price: 799 },
  { name: "Carpentry", price: 699 },
  { name: "Painting", price: 899 },
  { name: "AC Repair", price: 999 },
  { name: "Pest Control", price: 599 },
  { name: "Appliance Repair", price: 699 },
  { name: "Gardening", price: 399 },
];

const BookingPage = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  const [formData, setFormData] = useState({
    name: user ? user.fullName || user.name || "" : "",
    serviceType: "Plumbing",
    bookingDate: "",
    address: "",
    phone: user ? user.phoneNumber || "" : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login/customer");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectedService =
    SERVICES.find((s) => s.name === formData.serviceType) || SERVICES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      customerName: formData.name,
      userEmail: user.email,
      serviceName: formData.serviceType,
      bookingDate: formData.bookingDate,
      address: formData.address,
      phone: formData.phone,
      status: "PENDING",
    };

    try {
      const res = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (res.ok) {
        const saved = await res.json();
        // Pass booking data to payment page via localStorage
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            bookingId: saved.id,
            serviceName: formData.serviceType,
            price: selectedService.price,
            customerName: formData.name,
            email: user.email,
            date: formData.bookingDate,
            address: formData.address,
            phone: formData.phone,
          }),
        );
        navigate("/payment");
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } catch {
      alert("Cannot connect to server. Is Spring Boot running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="book-page-wrapper">
      <div className="book-card-modern">
        {/* Left Info Panel */}
        <div className="book-info-panel">
          <div>
            <h2>Book a Service</h2>
            <p>
              Fill your details and proceed to secure payment. We'll match you
              with a verified professional.
            </p>
          </div>
          <div className="selected-service-highlight">
            <span>CURRENTLY SELECTED</span>
            <h3>{formData.serviceType}</h3>
            <div className="service-price">₹{selectedService.price}</div>
          </div>
          <div className="booking-steps">
            <div className="bstep active">
              <span>1</span> Fill Details
            </div>
            <div className="bstep-arrow">→</div>
            <div className="bstep">
              <span>2</span> Pay Securely
            </div>
            <div className="bstep-arrow">→</div>
            <div className="bstep">
              <span>3</span> Confirmed!
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="book-form-panel">
          <h3>Booking Details</h3>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ backgroundColor: "#e2e8f0", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Select Service</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  {SERVICES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date &amp; Time</label>
                <input
                  type="datetime-local"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Full Home Address</label>
              <textarea
                name="address"
                placeholder="House/Flat number, Street, City..."
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="os-row">
                <span>Service</span>
                <span>{formData.serviceType}</span>
              </div>
              <div className="os-row">
                <span>Base Price</span>
                <span>₹{selectedService.price}</span>
              </div>
              <div className="os-row">
                <span>Platform Fee</span>
                <span>₹29</span>
              </div>
              <div className="os-row os-total">
                <span>Total Payable</span>
                <span>₹{selectedService.price + 29}</span>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn-modern"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : `Proceed to Pay ₹${selectedService.price + 29} →`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
