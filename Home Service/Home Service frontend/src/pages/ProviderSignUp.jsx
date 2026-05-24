// src/pages/ProviderSignUp.jsx
import { useNavigate } from "react-router-dom";
import "./ProviderSignUp.css";

const ProviderSignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future, this will send FormData to your Spring Boot backend (including files!)
    alert(
      "Application Submitted Successfully! Our team will review your documents.",
    );
    navigate("/");
  };

  return (
    <div className="provider-page-wrapper">
      <div className="provider-card">
        <div className="provider-header">
          <h2>Join as a Professional</h2>
          <p>Partner with HomeServe and grow your business today.</p>
        </div>

        <form className="provider-form" onSubmit={handleSubmit}>
          <h3 className="provider-section-title">1. Personal Information</h3>
          <div className="form-grid">
            <div className="provider-input-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g., Ramesh Kumar" required />
            </div>
            <div className="provider-input-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" required />
            </div>
            <div className="provider-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="ramesh@example.com" required />
            </div>
            <div className="provider-input-group">
              <label>Create Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <h3 className="provider-section-title">2. Professional Details</h3>
          <div className="form-grid">
            <div className="provider-input-group">
              <label>Primary Skill / Service</label>
              <select required>
                <option value="">-- Select Your Expertise --</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="cleaning">Home Cleaning</option>
                <option value="painting">Painting</option>
                <option value="carpentry">Carpentry</option>
              </select>
            </div>
            <div className="provider-input-group">
              <label>Years of Experience</label>
              <input type="number" min="0" placeholder="e.g., 5" required />
            </div>
            <div className="provider-input-group">
              <label>City / Operating Area</label>
              <input
                type="text"
                placeholder="e.g., Mumbai, Andheri West"
                required
              />
            </div>
          </div>

          <h3 className="provider-section-title">3. Identity & Verification</h3>
          <div className="form-grid">
            <div className="file-upload-wrapper">
              <div className="file-upload-box">
                <label>Upload Government ID (Aadhar / PAN)</label>
                <input type="file" accept=".pdf,.jpg,.png" required />
              </div>
              <div className="file-upload-box">
                <label>Upload Certification / Trade License</label>
                <input type="file" accept=".pdf,.jpg,.png" />
              </div>
            </div>
          </div>

          <button type="submit" className="provider-submit-btn">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderSignUp;
