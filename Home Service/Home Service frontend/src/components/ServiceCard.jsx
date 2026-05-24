// src/components/ServiceCard.jsx
import React from "react";
import { Link } from "react-router-dom";
// import './ServiceCard.css'; // Uncomment if you add a CSS file later

const ServiceCard = ({ title, description, price, imageUrl }) => {
  return (
    <div className="service-card" style={styles.card}>
      {/* Using a placeholder image if no URL is provided */}
      <img
        src={imageUrl || "https://placehold.co/300x200?text=Service+Image"}
        alt={title}
        style={styles.image}
      />
      <div className="service-content" style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <div className="service-footer" style={styles.footer}>
          <span className="price" style={styles.price}>
            ${price}
          </span>
          {/* Routes the user directly to the booking form */}
          <Link to="/book" style={styles.bookBtn}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

// I've included some basic inline styles so it looks decent right out of the box!
const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    width: "300px",
    margin: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: { width: "100%", height: "200px", objectFit: "cover" },
  content: { padding: "15px" },
  title: { margin: "0 0 10px 0" },
  description: { color: "#555", fontSize: "14px", marginBottom: "15px" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontWeight: "bold", fontSize: "18px", color: "#2c3e50" },
  bookBtn: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "4px",
  },
};

export default ServiceCard;
