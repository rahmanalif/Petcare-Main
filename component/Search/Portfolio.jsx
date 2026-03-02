"use client";
import React, { useState } from "react";

export default function Portfolio({ images }) {
  const [imageDimensions, setImageDimensions] = useState({});

  const handleImageLoad = (index, event) => {
    const img = event.target;
    const isLandscape = img.naturalWidth > img.naturalHeight;
    setImageDimensions((prev) => ({
      ...prev,
      [index]: isLandscape,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Row 1 */}
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[0] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[0]?.src}
          alt={images[0]?.alt}
          onLoad={(e) => handleImageLoad(0, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[1] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[1]?.src}
          alt={images[1]?.alt}
          onLoad={(e) => handleImageLoad(1, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>

      {/* Row 2 */}
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[2] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[2]?.src}
          alt={images[2]?.alt}
          onLoad={(e) => handleImageLoad(2, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[3] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[3]?.src}
          alt={images[3]?.alt}
          onLoad={(e) => handleImageLoad(3, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>

      {/* Row 3 */}
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[4] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[4]?.src}
          alt={images[4]?.alt}
          onLoad={(e) => handleImageLoad(4, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>
      <div
        className={`rounded-lg overflow-hidden aspect-square ${
          imageDimensions[5] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[5]?.src}
          alt={images[5]?.alt}
          onLoad={(e) => handleImageLoad(5, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>

      {/* Row 4 - Centered single image */}
      <div
        className={`col-span-2 mx-auto max-w-[calc(50%-0.5rem)] rounded-lg overflow-hidden aspect-square ${
          imageDimensions[6] ? "bg-transparent" : "bg-gray-100"
        }`}
      >
        <img
          src={images[6]?.src}
          alt={images[6]?.alt}
          onLoad={(e) => handleImageLoad(6, e)}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>
    </div>
  );
}
