// src/pages/PaymentPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [isProcessing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [netBank, setNetBank] = useState("SBI");
  const [wallet, setWallet] = useState("Paytm");
  const [booking, setBooking] = useState(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login/customer");
      return;
    }
    const pd = localStorage.getItem("pendingPayment");
    if (!pd) {
      navigate("/book");
      return;
    }
    setBooking(JSON.parse(pd));
  }, [navigate]);

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      localStorage.removeItem("pendingPayment");
      // Auto redirect after 5 seconds
      const t = setTimeout(() => navigate("/my-bookings"), 5000);
      setTimer(t);
    }, 2000);
  };

  const goToBookings = () => {
    if (timer) clearTimeout(timer);
    navigate("/my-bookings");
  };

  if (!booking) return null;

  const totalAmount = booking.price + 29;

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="pay-success-overlay">
        <div className="pay-success-card">
          <div className="pay-success-circle">
            <div className="pay-checkmark">✓</div>
          </div>
          <h2>Payment Successful!</h2>
          <p className="pay-success-sub">Your booking has been confirmed.</p>

          <div className="pay-success-receipt">
            <div className="receipt-title">🧾 Payment Receipt</div>
            <div className="receipt-row">
              <span>Booking ID</span>
              <strong>#{booking.bookingId}</strong>
            </div>
            <div className="receipt-row">
              <span>Service</span>
              <strong>{booking.serviceName}</strong>
            </div>
            <div className="receipt-row">
              <span>Customer</span>
              <strong>{booking.customerName}</strong>
            </div>
            <div className="receipt-row">
              <span>Date</span>
              <strong>{booking.date?.replace("T", " ")}</strong>
            </div>
            <div className="receipt-row">
              <span>Amount Paid</span>
              <strong style={{ color: "#10b981" }}>₹{totalAmount}</strong>
            </div>
            <div className="receipt-row">
              <span>Payment Method</span>
              <strong>{method.toUpperCase()}</strong>
            </div>
            <div className="receipt-row">
              <span>Status</span>
              <span className="receipt-status">✅ SUCCESS</span>
            </div>
          </div>

          <p className="pay-redirect-note">
            Redirecting to My Bookings in 5 seconds...
          </p>
          <button className="pay-goto-btn" onClick={goToBookings}>
            View My Bookings →
          </button>
        </div>
      </div>
    );
  }

  // ── PAYMENT PAGE ────────────────────────────────────────────────────────
  return (
    <div className="pay-wrapper">
      <div className="pay-container">
        {/* LEFT — Payment Methods */}
        <div className="pay-left">
          <div className="pay-header">
            <button className="pay-back" onClick={() => navigate("/book")}>
              ← Back
            </button>
            <h2>Secure Payment</h2>
            <div className="pay-secure-tag">🔒 256-bit SSL Secured</div>
          </div>

          {/* Method Tabs */}
          <div className="pay-methods">
            {[
              { id: "upi", label: "📱 UPI" },
              { id: "card", label: "💳 Card" },
              { id: "netbank", label: "🏦 Net Banking" },
              { id: "wallet", label: "👛 Wallet" },
            ].map((m) => (
              <button
                key={m.id}
                className={`pay-method-btn ${method === m.id ? "active" : ""}`}
                onClick={() => setMethod(m.id)}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* UPI */}
          {method === "upi" && (
            <form className="pay-form" onSubmit={handlePay}>
              <div className="pay-form-title">Pay via UPI</div>
              <div className="upi-apps">
                {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                  <div
                    key={app}
                    className={`upi-app-btn ${upiId === app ? "selected" : ""}`}
                    onClick={() => setUpiId(app)}
                  >
                    <span className="upi-icon">
                      {app === "GPay"
                        ? "G"
                        : app === "PhonePe"
                          ? "P"
                          : app === "Paytm"
                            ? "Pa"
                            : "B"}
                    </span>
                    {app}
                  </div>
                ))}
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "0.82rem",
                  margin: "4px 0",
                }}
              >
                — OR enter UPI ID —
              </div>
              <div className="pay-field">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={
                    typeof upiId === "string" &&
                    !["GPay", "PhonePe", "Paytm", "BHIM"].includes(upiId)
                      ? upiId
                      : ""
                  }
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
              <PayButton amount={totalAmount} isProcessing={isProcessing} />
            </form>
          )}

          {/* CARD */}
          {method === "card" && (
            <form className="pay-form" onSubmit={handlePay}>
              <div className="pay-form-title">Credit / Debit Card</div>
              <div className="pay-field">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pay-field">
                <label>Card Number</label>
                <div className="card-input-wrap">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        number: formatCard(e.target.value),
                      })
                    }
                    maxLength={19}
                    required
                  />
                  <span className="card-icons">💳</span>
                </div>
              </div>
              <div className="pay-field-row">
                <div className="pay-field">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        expiry: formatExpiry(e.target.value),
                      })
                    }
                    maxLength={5}
                    required
                  />
                </div>
                <div className="pay-field">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvv: e.target.value.slice(0, 3),
                      })
                    }
                    maxLength={3}
                    required
                  />
                </div>
              </div>
              <div className="card-save-row">
                <input type="checkbox" id="savecard" />
                <label htmlFor="savecard">Save card for future payments</label>
              </div>
              <PayButton amount={totalAmount} isProcessing={isProcessing} />
            </form>
          )}

          {/* NET BANKING */}
          {method === "netbank" && (
            <form className="pay-form" onSubmit={handlePay}>
              <div className="pay-form-title">Net Banking</div>
              <div className="netbank-grid">
                {[
                  "SBI",
                  "HDFC",
                  "ICICI",
                  "Axis",
                  "Kotak",
                  "PNB",
                  "BOB",
                  "Canara",
                ].map((bank) => (
                  <div
                    key={bank}
                    className={`netbank-btn ${netBank === bank ? "selected" : ""}`}
                    onClick={() => setNetBank(bank)}
                  >
                    <div className="bank-icon">{bank[0]}</div>
                    <span>{bank}</span>
                  </div>
                ))}
              </div>
              <div className="pay-field" style={{ marginTop: "1rem" }}>
                <label>Or select other bank</label>
                <select
                  value={netBank}
                  onChange={(e) => setNetBank(e.target.value)}
                >
                  {[
                    "SBI",
                    "HDFC",
                    "ICICI",
                    "Axis",
                    "Kotak",
                    "PNB",
                    "Bank of Baroda",
                    "Canara Bank",
                    "Union Bank",
                    "Yes Bank",
                  ].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <PayButton amount={totalAmount} isProcessing={isProcessing} />
            </form>
          )}

          {/* WALLET */}
          {method === "wallet" && (
            <form className="pay-form" onSubmit={handlePay}>
              <div className="pay-form-title">Pay via Wallet</div>
              <div className="wallet-grid">
                {[
                  { name: "Paytm", color: "#002970" },
                  { name: "PhonePe", color: "#5f259f" },
                  { name: "Amazon Pay", color: "#ff9900" },
                  { name: "Mobikwik", color: "#0099cc" },
                  { name: "Freecharge", color: "#e63946" },
                  { name: "Airtel Money", color: "#e4002b" },
                ].map((w) => (
                  <div
                    key={w.name}
                    className={`wallet-btn ${wallet === w.name ? "selected" : ""}`}
                    onClick={() => setWallet(w.name)}
                    style={
                      wallet === w.name
                        ? { borderColor: w.color, background: w.color + "11" }
                        : {}
                    }
                  >
                    <div
                      className="wallet-icon"
                      style={{ background: w.color }}
                    >
                      {w.name[0]}
                    </div>
                    <span>{w.name}</span>
                  </div>
                ))}
              </div>
              <PayButton amount={totalAmount} isProcessing={isProcessing} />
            </form>
          )}
        </div>

        {/* RIGHT — Order Summary */}
        <div className="pay-right">
          <div className="pay-summary-card">
            <div className="psc-title">Order Summary</div>

            <div className="psc-service">
              <div className="psc-service-icon">🏠</div>
              <div>
                <div className="psc-service-name">{booking.serviceName}</div>
                <div className="psc-service-sub">HomeService Professional</div>
              </div>
            </div>

            <div className="psc-divider" />

            <div className="psc-row">
              <span>Service Charge</span>
              <span>₹{booking.price}</span>
            </div>
            <div className="psc-row">
              <span>Platform Fee</span>
              <span>₹29</span>
            </div>
            <div className="psc-row">
              <span>GST (0%)</span>
              <span>₹0</span>
            </div>
            <div className="psc-divider" />
            <div className="psc-total">
              <span>Total Amount</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <div className="psc-divider" />
            <div className="psc-booking-info">
              <div className="psc-info-row">
                📅 {booking.date?.replace("T", " ") || "TBD"}
              </div>
              <div className="psc-info-row">
                📍 {booking.address?.slice(0, 40) || "—"}
                {booking.address?.length > 40 ? "..." : ""}
              </div>
              <div className="psc-info-row">📞 {booking.phone || "—"}</div>
              <div className="psc-info-row">✉️ {booking.email}</div>
            </div>

            <div className="psc-guarantee">
              <div>
                🛡️ <strong>100% Secure Payment</strong>
              </div>
              <div>
                ✅ <strong>Verified Professionals</strong>
              </div>
              <div>
                🔄 <strong>Easy Cancellation</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable Pay Button ──────────────────────────────────────────────────────
const PayButton = ({ amount, isProcessing }) => (
  <button type="submit" className="pay-submit-btn" disabled={isProcessing}>
    {isProcessing ? (
      <span className="pay-spinner-row">
        <span className="pay-spinner" />
        Processing Payment...
      </span>
    ) : (
      `Pay ₹${amount} Securely →`
    )}
  </button>
);

export default PaymentPage;
