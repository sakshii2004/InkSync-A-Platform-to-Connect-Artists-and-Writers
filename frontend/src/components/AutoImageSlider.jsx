import React, { useState, useEffect } from "react";

const AutoImageSlider = ({ images }) => {
    const [current, setCurrent] = useState(0);
  
    useEffect(() => {
      if (images.length <= 1) return;
  
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 1500);
  
      return () => clearInterval(interval);
    }, [images]);
  
    return (
      <div className="w-full h-48 sm:h-22 relative rounded-md overflow-hidden">
        <img
          src={images[current]}
          alt={`Slide ${current}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out rounded-md"
        />
      </div>
    );
  };

export default AutoImageSlider;
  