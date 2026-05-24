// src/components/ReviewCard.jsx
import React from "react";
import "./ReviewCard.css";

const ReviewCard = ({ name, rating, comment, date }) => {
  // A helper function to generate the correct number of gold/gray stars
  const renderStars = () => {
    return [...Array(5)].map((star, index) => {
      index += 1;
      return (
        <span key={index} className={index <= rating ? "star filled" : "star"}>
          &#9733; {/* This is the HTML entity for a solid star */}
        </span>
      );
    });
  };

  return (
    <div className="review-card">
      <div className="review-header-info">
        <h4 className="review-name">{name}</h4>
        <span className="review-date">{date}</span>
      </div>
      <div className="review-rating">{renderStars()}</div>
      <p className="review-text">"{comment}"</p>
    </div>
  );
};

export default ReviewCard;
