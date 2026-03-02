"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeroImage = ({ className }) => (
  <img src="/Hero01.png" className={className} alt="heroImage" />
);

const PawGreenImage = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="108"
    height="115"
    viewBox="0 0 108 115"
    fill="none"
  >
    <g opacity="0.4">
      <path
        d="M51.5987 56.3557C40.0034 53.8179 34.417 63.7711 21.1659 70.9491C2.01084 81.5581 1.20263 94.9187 9.80225 99.8942C18.4019 104.87 29.2529 96.1685 39.3831 99.3835C49.557 101.876 54.478 114.695 64.4713 114.287C74.4428 114.241 80.871 102.144 69.8815 83.7068C62.4294 71.5319 62.7731 59.9655 51.5987 56.3557Z"
        fill="#024B5E"
      />
      <path
        d="M24.8833 38.6641C28.2701 49.922 25.882 61.3815 19.6062 64.2588C12.9921 67.1255 4.9284 60.3336 1.54162 49.0758C-1.84515 37.8179 0.543009 26.3584 6.81877 23.4811C13.4329 20.6144 21.4966 27.4063 24.8833 38.6641Z"
        fill="#024B5E"
      />
      <path
        d="M81.647 53.9635C72.6869 61.3363 69.216 71.7997 73.4888 77.4039C77.7615 83.008 88.4717 81.8887 97.4318 74.5159C106.392 67.1431 109.863 56.6798 105.59 51.0756C100.963 45.4602 90.2529 46.5795 81.647 53.9635Z"
        fill="#024B5E"
      />
      <path
        d="M57.0514 24.0781C55.9384 36.6549 48.6606 46.3611 41.3028 45.746C33.945 45.1309 28.9676 34.2723 30.0805 21.6955C31.1935 9.1188 38.4714 -0.587499 45.8292 0.0276175C53.187 0.642734 58.1643 11.5014 57.0514 24.0781Z"
        fill="#024B5E"
      />
      <path
        d="M63.2467 25.3261C58.146 35.9932 59.5446 46.8661 65.8751 49.861C72.5477 52.8667 81.821 46.8727 86.9005 36.5542C92.0012 25.8871 90.6026 15.0142 84.2721 12.0193C77.9627 8.67572 68.3473 14.6589 63.2467 25.3261Z"
        fill="#024B5E"
      />
    </g>
  </svg>
);

const PawWhiteImage = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="108"
    height="80"
    viewBox="0 0 108 80"
    fill="none"
  >
    <g opacity="0.6">
      <path
        d="M51.5987 56.3557C40.0034 53.8179 34.417 63.7711 21.1659 70.9491C2.01084 81.5581 1.20263 94.9187 9.80225 99.8942C18.4019 104.87 29.2529 96.1685 39.3831 99.3835C49.557 101.876 54.478 114.695 64.4713 114.287C74.4428 114.241 80.871 102.144 69.8815 83.7068C62.4294 71.5319 62.7731 59.9655 51.5987 56.3557Z"
        fill="white"
      />
      <path
        d="M24.8833 38.6641C28.2701 49.922 25.882 61.3815 19.6062 64.2588C12.9921 67.1255 4.9284 60.3336 1.54162 49.0758C-1.84515 37.8179 0.543009 26.3584 6.81877 23.4811C13.4329 20.6144 21.4966 27.4063 24.8833 38.6641Z"
        fill="white"
      />
      <path
        d="M81.647 53.9635C72.6869 61.3363 69.216 71.7997 73.4888 77.4039C77.7615 83.008 88.4717 81.8887 97.4318 74.5159C106.392 67.1431 109.863 56.6798 105.59 51.0756C100.963 45.4602 90.2529 46.5795 81.647 53.9635Z"
        fill="white"
      />
      <path
        d="M57.0514 24.0781C55.9384 36.6549 48.6606 46.3611 41.3028 45.746C33.945 45.1309 28.9676 34.2723 30.0805 21.6955C31.1935 9.1188 38.4714 -0.587499 45.8292 0.0276175C53.187 0.642734 58.1643 11.5014 57.0514 24.0781Z"
        fill="white"
      />
      <path
        d="M63.2467 25.3261C58.146 35.9932 59.5446 46.8661 65.8751 49.861C72.5477 52.8667 81.821 46.8727 86.9005 36.5542C92.0012 25.8871 90.6026 15.0142 84.2721 12.0193C77.9627 8.67572 68.3473 14.6589 63.2467 25.3261Z"
        fill="white"
      />
    </g>
  </svg>
);

export default function UpdatedHeroSection() {
  const router = useRouter();
  return (
    <>
      {/* Mobile Section */}
      <div className="md:hidden bg-[#F8F4EF] px-6 py-8">
        <div className="relative">
          <div className="font-bakso text-[#024B5E] text-[32px] leading-tight mb-6">
            GET PAID TO HANG <br />
            OUT WITH PETS
          </div>

          <div className="font-montserrat text-[#024B5E] text-[14px] font-medium mb-6 leading-relaxed">
            <p>Turn your free time into income doing something that feels good. Join the Wuffoos community of trusted pet care. Set your availability, connect with local pet parents, and earn money taking care of pets you'll love. Do what you enjoy. Get paid for it.</p>
          </div>

          <button className="flex items-center justify-center bg-[#FE6C5D] rounded-2xl gap-2 px-6 py-4 mb-8">
            <div className="font-bakso text-white text-[18px]">Get started</div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g clip-path="url(#clip0_5012_11309)">
                  <path
                    d="M20.3635 11.2929C20.5509 11.4805 20.6562 11.7348 20.6562 11.9999C20.6562 12.2651 20.5509 12.5194 20.3635 12.7069L14.7065 18.3639C14.5179 18.5461 14.2653 18.6469 14.0031 18.6446C13.7409 18.6423 13.4901 18.5372 13.3046 18.3518C13.1192 18.1663 13.0141 17.9155 13.0118 17.6533C13.0095 17.3911 13.1103 17.1385 13.2925 16.9499L17.2425 12.9999H3.99946C3.73425 12.9999 3.47989 12.8946 3.29236 12.707C3.10482 12.5195 2.99946 12.2652 2.99946 11.9999C2.99946 11.7347 3.10482 11.4804 3.29236 11.2928C3.47989 11.1053 3.73425 10.9999 3.99946 10.9999H17.2425L13.2925 7.04994C13.1103 6.86133 13.0095 6.60873 13.0118 6.34653C13.0141 6.08434 13.1192 5.83353 13.3046 5.64812C13.4901 5.46271 13.7409 5.35754 14.0031 5.35526C14.2653 5.35298 14.5179 5.45378 14.7065 5.63594L20.3635 11.2929Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5012_11309">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="matrix(-1 0 0 1 24 0)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </button>

          <div className="relative bg-[#FE6C5D] rounded-3xl overflow-hidden h-[400px] flex items-end justify-center">
            <HeroImage className="w-[280px] h-[380px] object-contain" />
            <div className="absolute top-4 right-4 opacity-40">
              <PawWhiteImage />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Section (md and up) */}
      <div className="hidden md:flex bg-[#F8F4EF] overflow-hidden">
        <div className="relative xl:py-50 xl:px-82 2xl:py-50 2xl:px-80 lg:py-52 lg:px-8 md:py-52 md:px-8 hero-1280-sitter-new">
          <div className="font-bakso text-[#024B5E] md:text-[36px] lg:text-[26px] xl:text-[36px] 2xl:text-[66px]  ">
              GET PAID TO HANG <br />
              OUT WITH PETS
          </div>

          <div className="font-montserrat text-justify text-[#024B5E] lg:text-[10px] xl:text-[16px] 2xl:text-[16px] font-medium 2xl:py-8 xl:py-8 lg:py-4 ">
              <p>Turn your free time into income doing something that feels good. Join the</p>
              <p>Wuffoos community of trusted pet care. Set your availability, connect with</p>
              <p>local pet parents, and earn money taking care of pets you'll love. Do what</p>
              <p> you enjoy. Get paidfor it.</p>

          </div>
          <div className="absolute top-20 left-220">
            <PawGreenImage />
          </div>
          <Link href="/login">
            <button className="flex items-center justify-center bg-[#FE6C5D] rounded-2xl gap-2 w-50 h-15 ">
              <div className="font-montserrat font-bold text-white text-[18px]">Get started</div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_5012_11309)">
                    <path
                      d="M20.3635 11.2929C20.5509 11.4805 20.6562 11.7348 20.6562 11.9999C20.6562 12.2651 20.5509 12.5194 20.3635 12.7069L14.7065 18.3639C14.5179 18.5461 14.2653 18.6469 14.0031 18.6446C13.7409 18.6423 13.4901 18.5372 13.3046 18.3518C13.1192 18.1663 13.0141 17.9155 13.0118 17.6533C13.0095 17.3911 13.1103 17.1385 13.2925 16.9499L17.2425 12.9999H3.99946C3.73425 12.9999 3.47989 12.8946 3.29236 12.707C3.10482 12.5195 2.99946 12.2652 2.99946 11.9999C2.99946 11.7347 3.10482 11.4804 3.29236 11.2928C3.47989 11.1053 3.73425 10.9999 3.99946 10.9999H17.2425L13.2925 7.04994C13.1103 6.86133 13.0095 6.60873 13.0118 6.34653C13.0141 6.08434 13.1192 5.83353 13.3046 5.64812C13.4901 5.46271 13.7409 5.35754 14.0031 5.35526C14.2653 5.35298 14.5179 5.45378 14.7065 5.63594L20.3635 11.2929Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5012_11309">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="matrix(-1 0 0 1 24 0)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>
          </Link>
        </div>

        <div className="relative bg-[#FE6C5D] xl:w-[700px] xl:h-[750px]  2xl:w-[550px] 2xl:h-[750px] lg:w-[550px] lg:h-[750px] md:w-[400px] md:h-[650px] ">
          <HeroImage className="absolute md:w-[252px] md:h-[369px] lg:w-[452px] lg:h-[569px] xl:w-[452px] xl:h-[469px] 2xl:w-[452px] 2xl:h-[569px] 2xl:-left-40 xl:-left-40 xl:top-20 bottom-26 lg:left-10 md:left-5 " />
          <div className="absolute top-168 left-90">
            <PawWhiteImage />
          </div>
        </div>
      </div>
    </>
  );
}
