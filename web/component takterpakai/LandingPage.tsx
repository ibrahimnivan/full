"use client";
import React, { useState, useEffect } from "react";
import bg1 from "../../public/bg-slider/bg-1.jpg";
import bg2 from "../../public/bg-slider/bg-2.jpg";
import bg3 from "../../public/bg-slider/bg-3-filter.jpg";
import bg4 from "../../public/bg-slider/bg-4.jpg";
import HomeContent from "./SearchForm";
import CategoryIcon from "../src/components/CategoryIcon";

const Home = () => {
  const images = [bg1, bg2, bg3, bg4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the current image index, looping back to the start if at the end
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="carousel-container">
      <div
        className="carousel-content"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="carousel-item">
            <img src={image.src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="content">
        <h1 className="text-white text-xl">DISCOVER AND CREATE UNFORGATTABLE EVENTS!</h1>
        <div>
          <CategoryIcon />
        </div>
      </div>
      <HomeContent />
    </div>
  );
};

export default Home;
