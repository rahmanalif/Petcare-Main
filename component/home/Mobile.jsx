"use client";
import React from 'react';

export default function MobileAppSection() {
  return (
    <div className="bg-[#F8F4EF] px-4 sm:px-6 md:px-8 lg:px-12 pb-0">
      <div className="max-w-7xl mx-auto pb-0">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-[#024B5E] mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-bakso leading-tight">
          Connect Anywhere with the Wuffoos App
        </h1>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-20 xl:gap-24 pb-0">
          {/* Mobile Phones Image */}
          <div className="shrink-0 w-full md:w-auto flex justify-center pb-0">
            <img
              src="/Frame.png"
              alt="Wuffoos Mobile App"
              className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[600px] h-auto"
            />
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-center md:items-start">
            {/* App Store Button Placeholder */}
            <a
              href="#"
              className="block w-60 sm:w-[260px] md:w-[300px] lg:w-[350px] xl:w-[380px] h-[72px] sm:h-[78px] md:h-[90px] lg:h-[100px] bg-black rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <img src="/flag/Vector 1.png" alt="App Store" className="h-16 sm:h-18 md:h-20 lg:h-24" />
                </div>
              </div>
            </a>

            {/* Google Play Button Placeholder */}
            <a
              href="#"
              className="block w-60 sm:w-[260px] md:w-[300px] lg:w-[350px] xl:w-[380px] h-[72px] sm:h-[78px] md:h-[90px] lg:h-[100px] bg-black rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                <img src="/flag/Vector.png" alt="Google Play" className="h-16 sm:h-18 md:h-20 lg:h-24" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}