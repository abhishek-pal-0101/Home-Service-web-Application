// src/pages/Services.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ServicesPage.css";

const Services = () => {
  // 1. State to keep track of the search input
  const [searchTerm, setSearchTerm] = useState("");

  // 2. An expanded list of all our services
  const allServices = [
    {
      id: 1,
      title: "Plumbing",
      icon: "🚰",
      desc: "Expert pipe repairs, leak fixes, and fast installations.",
    },
    {
      id: 2,
      title: "Electrical",
      icon: "⚡",
      desc: "Safe wiring, fixture installations, and quick repairs.",
    },
    {
      id: 3,
      title: "Home Cleaning",
      icon: "🧹",
      desc: "Deep cleaning for a spotless and healthy living space.",
    },
    {
      id: 4,
      title: "Carpentry",
      icon: "🪚",
      desc: "Custom furniture, quick repairs, and beautiful woodwork.",
    },
    {
      id: 5,
      title: "Painting",
      icon: "🎨",
      desc: "Flawless interior and exterior painting services.",
    },
    {
      id: 6,
      title: "AC Repair",
      icon: "❄️",
      desc: "Air conditioning maintenance, gas refilling, and repair.",
    },
    {
      id: 7,
      title: "Pest Control",
      icon: "🐜",
      desc: "Safe and effective elimination of insects and pests.",
    },
    {
      id: 8,
      title: "Appliance Repair",
      icon: "📺",
      desc: "Fixing TVs, refrigerators, washing machines, and more.",
    },
  ];

  // 3. Filter the services based on what the user types!
  const filteredServices = allServices.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="services-page-container">
      <div className="services-header">
        <h1>All Home Services</h1>
        <p>Find the right professional for your specific needs.</p>
      </div>

      {/* 🌟 SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a service (e.g., Plumbing, AC...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🌟 SERVICES GRID */}
      <div className="all-services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            /* Note: We are reusing the "service-card" CSS class from Home.css! */
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <Link to="/book" className="book-link">
                Book Now &rarr;
              </Link>
            </div>
          ))
        ) : (
          <div className="no-results">
            No services found matching "{searchTerm}". Try another keyword!
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
