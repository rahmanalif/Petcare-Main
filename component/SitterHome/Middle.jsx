
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <div className="bg-[#F8F4EF] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto shadow-xl rounded-2xl overflow-hidden">
        {/* Top Section: Images with Speech Bubbles */}
        <div className="grid md:grid-cols-2 w-full">
          {/* Left Image Section */}
          <div className="relative h-[300px] md:h-[400px] w-full">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop"
              alt="Beagle dog"
              className="w-full h-full object-cover"
            />
            {/* Speech Bubble */}
            <div className="absolute -bottom-15 right-12 md:right-12 max-w-[280px] z-10 hidden md:block">
              <div className=" bg-[#FE6C5D] text-[#FFF] p-6 rounded-2xl shadow-lg text-sm font-medium leading-relaxed relative">
                It's easy. Go to the calendar and mark yourself as available when you want to be
                {/* Triangle Tail */}
                {/* <div className="absolute -bottom-2 right-0 w-4 h-4 bg-[#FF6E61] transform rotate-45 translate-x-[-50%] translate-y-[-50%]"></div> */}
              </div>
            </div>
            {/* Mobile Speech Bubble (Adjusted position) */}
            <div className="absolute bottom-4 right-4 max-w-60 z-10 md:hidden">
              <div className="bg-[#FE6C5D] text-[#FFF] p-4 rounded-xl  shadow-lg text-xs font-medium leading-relaxed relative">
                It's easy. Go to the calendar and mark yourself as available when you want to be
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative h-[300px] md:h-[400px] w-full">

            <Image
              src="/Kutta.png"
              alt="Australian Shepherd dog"
              fill
              className="object-cover"
            />
            {/* Speech Bubble */}
            <div className="absolute -bottom-17 left-8 md:left-12 max-w-[280px] z-10 hidden md:block">
              <div className="bg-[#FF6E61] text-[#FFF] p-6 text-justify rounded-2xl  shadow-lg text-sm font-medium leading-relaxed">
                With Wuffoos you can build trust from the first visit to the last by staying connected with pet parents by sharing photos, videos, and live location updates
              </div>
            </div>
            {/* Mobile Speech Bubble */}
            <div className="absolute bottom-4 left-4 max-w-60 z-10 md:hidden">
              <div className="bg-[#FF6E61] text-white p-4 rounded-xl  shadow-lg text-xs font-medium leading-relaxed">
                With Wuffoos you can build trust from the first visit to the last by staying connected with pet parents by sharing photos, videos, and live location updates
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: How It Works */}
        <div className="bg-[#E7F4F6] py-16 px-8 md:px-16 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#035F75] mb-12 font-bakso">
              HOW iT WORKS
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6 xl:gap-8 text-left mb-12">
              {/* Step 1 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {/* Placeholder for Paw Icon */}
                    <img src="/paw.png" alt="paw" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#035F75] font-bakso">Join a trusted care community</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs md:text-sm text-justify">
                  Sign up, then complete your $199 MXN document validation + background check in seconds.
                </p>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img src="/iconos.png" alt="W" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#035F75] font-bakso">Accept requests</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs md:text-sm text-justify">
                  Review each request, confirm the details, and accept the bookings that fit your schedule and preferences.
                </p>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {/* Placeholder for Paw Icon */}
                    <img src="/paw.png" alt="paw" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#035F75] font-bakso">Get paid</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs md:text-sm text-justify">
                  Payments are sent directly to your bank once you have completed a service.
                </p>
              </div>

              {/* Step 4 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {/* Placeholder for Profile Icon */}
                    <img src="/people.png" alt="people" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#035F75] font-bakso">Create your profile</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs md:text-sm text-justify">
                  Tell us a little about yourself and what pet services you want to offer.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/signup?role=pet_sitter')}
              className="bg-[#035F75] hover:bg-[#034e61] text-white font-medium px-10 py-3 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 text-sm md:text-base"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}