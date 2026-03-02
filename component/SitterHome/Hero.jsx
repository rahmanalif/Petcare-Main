"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8F4EF]">
      {/* Hero Section with Background Image */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0">
          {/* You can replace this with an actual image */}
          <div className="w-full h-150 bg-[url('/sitter.png')] bg-cover bg-center"></div>
        </div>

        {/* Overlay to darken background slightly */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Glass Card */}
        <div className="relative h-full flex items-center justify-center px-4 mt-24">
          <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
            <h1 className="text-4xl md:text-4xl font-bold text-[#024B5E] mb-4 text-center leading-tight font-bakso">
              GET PAID TO PLAY WITH PETS
            </h1>
            <p className="text-[#024B5E] text-center text-lg mb-8 leading-relaxed font-normal font-montserra">
              Wuffoos makes it <span className="font-normal font-montserrat">easy</span> and promotes you to the nation's largest network of pet owners, delivering dog-walking, connecting you love.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/signup?role=pet_sitter')}
                className="bg-[#035F75] hover:bg-[#044c5e] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold text-[#024B5E] mb-8 font-montserrat">
              Flexibility puts you in control
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#024B5E] text-lg leading-relaxed font-montserrat">
                  Set your own schedule and prices
                </p>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#024B5E] text-lg leading-relaxed font-montserrat">
                  Offer any combination of pet care services
                </p>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#024B5E] text-lg leading-relaxed font-montserrat">
                  Set the, age, and other pet preferences that work for you
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-3xl font-bold text-[#024B5E] mb-8">
              The tools to succeed
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#024B5E] text-lg leading-relaxed ">
                    <span className="text-teal-600 font-semibold font-montserrat">The Wuffoos Guarantee</span> which includes up to $25,000 in vet cost reimbursement
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#024B5E] text-lg leading-relaxed font-montserrat">
                  Manage your pet sitting schedule and more with the Wuffoos app
                </p>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#024B5E] text-lg leading-relaxed font-montserrat">
                  24/7 support, including vet assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}