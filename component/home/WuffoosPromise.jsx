"use client";
import { Calendar, Home, Footprints, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";   

export default function ServicesSection() {
  return (
    <div
      id="wuffoos-promise"
      className="bg-[#F8F4EF] py-16 md:py-24 lg:py-36 px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column - Services */}
          <div>
            <h1
              className="text-2xl md:text-3xl lg:text-[64px] text-[#FE6C5D] mb-8 md:mb-12 tracking-wide font-bakso"
            >
              Wuffoos Promise
            </h1>

            <h2 className="text-2xl md:text-3xl lg:text-[32px] text-[#024B5E] mb-4 md:mb-12 tracking-wide font-bakso">
              Find peace of mind with every booking.
            </h2>

            {/* Dog Boarding */}
            <div className="flex gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src="01.png"
                    alt="01 Logo"
                    className={""}
                  />
                </div>
              </div>
              <div>
                
                <p className="text-sm md:text-base text-[#024B5E] leading-relaxed">
                  Verified pet sitters have already passed a third party background check and show verified reviews from other pet parents, like you
                </p>
              </div>
            </div>

            {/* Doggy Day Care */}
            <div className="flex gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src="02.png"
                    alt="02 Logo"
                    className={""}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm md:text-base text-[#024B5E] leading-relaxed">
                  Live location, messaging & photo updates from your sitter during each stay
                </p>
              </div>
            </div>

            {/* Dog Walking */}
            <div className="flex gap-3 md:gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src="03.png"
                    alt="03 Logo"
                    className={""}
                  />
                </div>
              </div>
              <div className="text-[#024B5E]">
                24/7 support and Pet Assistance
              </div>
            </div>
          </div>

          {/* Right Column - Image with Paw */}
          <div className="relative mt-8 lg:mt-0">
            {/* Paw SVG in top-right corner */}
            <div className="absolute top-8 right-18 w-16 h-16 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="61" height="62" viewBox="0 0 61 62" fill="none">
                <g opacity="0.6">
                  <path d="M31.5345 29.6491C25.0757 31.0418 24.5621 37.2951 19.524 43.9207C12.2953 53.6146 14.9923 60.4736 20.5016 60.9858C26.011 61.4981 29.4802 54.6623 35.3549 53.944C41.0839 52.8549 46.5547 58.1286 51.518 55.6324C56.5542 53.3216 56.9954 45.8042 47.1468 39.1162C40.5446 34.7446 38.0295 28.8884 31.5345 29.6491Z" fill="#FE6C5D"/>
                  <path d="M13.8998 26.9416C18.2312 31.7878 19.6867 38.0597 17.1792 40.9368C14.498 43.8861 8.83762 42.3437 4.50618 37.4975C0.174735 32.6513 -1.28067 26.3794 1.22681 23.5023C3.90802 20.5529 9.56837 22.0954 13.8998 26.9416Z" fill="#FE6C5D"/>
                  <path d="M46.187 21.5602C43.366 27.2986 44.0418 33.3213 47.5073 35.1403C50.9728 36.9593 56.1334 33.9429 58.9544 28.2045C61.7753 22.4661 61.0996 16.4433 57.6341 14.6244C53.9868 12.881 48.8261 15.8974 46.187 21.5602Z" fill="#FE6C5D"/>
                  <path d="M26.7903 12.2755C29.1509 18.8129 27.7238 25.3309 23.8568 26.7118C19.9897 28.0927 14.946 23.8108 12.5854 17.2734C10.2248 10.736 11.6519 4.218 15.519 2.83714C19.3861 1.45627 24.4298 5.73817 26.7903 12.2755Z" fill="#FE6C5D"/>
                  <path d="M30.2161 11.4775C30.1144 17.9759 33.3501 23.086 37.2505 23.1296C41.3265 23.1 44.6265 17.9784 44.7986 11.659C44.9003 5.16051 41.6647 0.0504128 37.7643 0.00689055C33.7936 -0.215616 30.3178 4.97903 30.2161 11.4775Z" fill="#FE6C5D"/>
                </g>
              </svg>
            </div>

            {/* Image Container */}
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/wuffo.png"
                alt="Pet sitter with dog"
                width={500}
                height={500}
                className="w-full h-auto"
              />

              {/* Book a Local Sitter Button */}
              <div className="absolute bottom-12 left-1/3 transform -translate-x-1/3">
              <Link href="/search">
              <button className="bg-[#FE6C5D] text-white px-10 py-4 rounded-full font-bakso text-sm md:text-base uppercase tracking-wide hover:bg-[#ff5744] transition-colors">
                  Book a local sitter
                </button>
              </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
