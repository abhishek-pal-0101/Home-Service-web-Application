import { Link } from "react-router-dom";
import ReviewsSection from "../components/ReviewsSection";
import "./HomePage.css"; // Make sure this path matches your CSS file!

const Home = () => {
  // We use this array to dynamically generate our service cards!
  const servicesData = [
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
  ];

  return (
    <div className="home-container">
      {/* 1. Hero Banner */}
      <section className="hero-section">
        <h1>Your Home, Our Expertise</h1>
        <p>
          Book trusted professionals for all your home service needs instantly.
        </p>
        <Link to="/services" className="hero-btn">
          Explore Services
        </Link>
      </section>

      {/* 2. Popular Services Section */}
      <section className="services-section">
        <h2>Popular Services</h2>

        <div className="services-grid">
          {/* This map() function loops through our array and builds the cards */}
          {servicesData.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>

              {/* Clicking this takes them straight to the booking page */}
              <Link to="/book" className="book-link">
                Book Now &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* 3. Reviews Section */}
      <ReviewsSection />
    </div>
  );
};

export default Home;
