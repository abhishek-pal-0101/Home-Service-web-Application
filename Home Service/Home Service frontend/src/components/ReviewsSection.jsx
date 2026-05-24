// src/components/ReviewsSection.jsx
import { useState } from "react";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  // 1. Initial Dummy Data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Rahul Sharma",
      rating: 5,
      text: "Excellent plumbing service! Fixed my sink in 20 minutes.",
    },
    {
      id: 2,
      author: "Priya Singh",
      rating: 4,
      text: "Very professional AC repair. Arrived a bit late but did a great job.",
    },
    {
      id: 3,
      author: "Amit Patel",
      rating: 5,
      text: "Deep cleaning was spotless. Highly recommend!",
    },
  ]);

  // 2. State for the New Review Form
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(0);

  // 3. Handle Submitting a New Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newRating === 0) {
      alert("Please select a star rating!");
      return;
    }

    // Create a new review object
    const newReview = {
      id: reviews.length + 1,
      author: "You (Current User)", // We will replace this with real user data later
      rating: newRating,
      text: newReviewText,
    };

    // Add it to the top of the list
    setReviews([newReview, ...reviews]);

    // Clear the form
    setNewReviewText("");
    setNewRating(0);
    alert("Review submitted successfully!");
  };

  // Helper function to render stars based on a number (e.g., 4 -> ★★★★☆)
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2>What Our Customers Say</h2>
        <p>Real reviews from verified home service bookings.</p>
      </div>

      {/* --- Display Existing Reviews --- */}
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-stars">{renderStars(review.rating)}</div>
            <p className="review-text">"{review.text}"</p>
            <p className="review-author">- {review.author}</p>
          </div>
        ))}
      </div>

      {/* --- Add a New Review Form --- */}
      <div className="add-review-form">
        <h3>Leave a Review</h3>
        <form onSubmit={handleSubmitReview}>
          {/* Interactive Star Rating Selection */}
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= newRating ? "active" : ""}
                onClick={() => setNewRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="review-textarea"
            placeholder="Tell us about your experience with the service..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
