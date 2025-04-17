import React, { useState, useEffect } from "react";

const mangaArtData = [
  ["/1.png", "/2.png", "/3.png"],
  ["/4.png", "/5.png", "/6.png"],
  ["/7.png", "/8.png", "/9.png"],

  ["/2.png", "/3.png", "/1.png"],
  ["/5.png", "/6.png", "/4.png"],
  ["/8.png", "/9.png", "/7.png"],

  ["/3.png", "/1.png", "/2.png"],
  ["/6.png", "/4.png", "/5.png"],
  ["/9.png", "/7.png", "/8.png"],
];

const Slideshow = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <img
      src={images[index]}
      alt="manga"
      className="w-full h-full object-cover rounded-lg"
    />
  );
};

const MangaGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 max-w-[600px]">
      {mangaArtData.map((images, i) => (
        <div key={i} className="w-40 h-auto overflow-hidden shadow-md rounded-xl">
          <Slideshow images={images} />
        </div>
      ))}
    </div>
  );
};

export default MangaGrid;
