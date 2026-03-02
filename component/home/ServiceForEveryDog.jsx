"use client";
import { Calendar, Home, Footprints, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TickIcon = ({className}) => (
  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="13"
                    viewBox="0 0 16 13"
                    fill="none"
                    className="shrink-0 mt-1"
                  >
                    <path
                      d="M0.75 8.25C0.75 8.25 2.25 8.25 4.25 11.75C4.25 11.75 9.80882 2.58333 14.75 0.75"
                      stroke="#FE6C5D"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
)

export default function ServicesSection() {
  return (
    <div
      id="services"
      className="bg-[#F8F4EF] py-16 md:py-24 lg:py-36 px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column - Services */}
          <div>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl text-[#024B5E] mb-8 md:mb-12 tracking-wide font-bakso"
              //   style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              Services
            </h2>

            {/* Dog Boarding */}
            <div className="flex gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="shrink-0">
                <div className="w-10 h-12 md:w-10 md:h-12 flex items-center justify-center">
                  <img
                    src="/icons/boardingIcon.png"
                    alt="Boarding"
                    className={""}
                  />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg md:text-xl text-[#024B5E] mb-2 font-bakso"
                  //   style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Dog Boarding
                </h3>
                <p className="text-sm md:text-base text-[#024B5E] leading-relaxed">
                  Your pets stay overnight in your sitter's home. They'll be
                  treated like part of the family in a familiar environment.
                </p>
              </div>
            </div>

            {/* Doggy Day Care */}
            <div className="flex gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src="/icons/doggy.png"
                    alt="Doggy Day Care"
                    className={""}
                  />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg md:text-xl text-[#024B5E] mb-2 font-bakso"
                  //   style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Doggy Day Care
                </h3>
                <p className="text-sm md:text-base text-[#024B5E] leading-relaxed">
                  Your dog spends the day at your sitter's home. Drop them off
                  in the morning and pick your pup in the evening.
                </p>
              </div>
            </div>

            {/* Dog Walking */}
            <div className="flex gap-3 md:gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img
                    src="/icons/walking.png"
                    alt="Doggy Day Care"
                    className={""}
                  />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg md:text-xl text-[#024B5E] mb-2 font-bakso"
                  //   style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Dog Walking
                </h3>
                <p className="text-sm md:text-base text-[#024B5E] leading-relaxed">
                  Your dog gets a walk around your neighborhood. Perfect for
                  busy days and dogs with extra energy to burn.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Wuffoos Protect Card */}
          <div className="relative mt-8 lg:mt-0">
            {/* Image Container - Half outside card */}
            <div className="absolute -top-16 md:-top-24 lg:-top-32 -right-4 md:-right-6 lg:-right-12 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 z-10">
              <Image
                src="/Union.png"
                alt="Pet sitter with dog"
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 relative pt-28 md:pt-32 lg:pt-8">
              {/* Header */}
              <div className="flex items-center gap-2 md:gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  <img
                    src="/Frame 2147239658.png"
                    alt="Safety and trust"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3
                  className="text-xl md:text-2xl text-[#024B5E] font-bakso"
                  //   style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  Built for safety and trust
                </h3>
              </div>

              <p className="text-[#024B5E] mb-6 text-lg md:text-2xl font-bakso">
                {/* Find peace of mind with every
                <br className="hidden sm:block" /> */}
                <span className="sm:hidden"> </span>
                booking.
              </p>

              {/* Features List */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-start gap-2 md:gap-3">
                  <TickIcon/>
                  <p className="text-sm md:text-base text-[#024B5E]">
                    {/* <span className="text-[#357F91] font-semibold">
                      Screened pet sitters
                    </span>{" "}
                    have already passed a third-party background check and show
                    verified reviews from other pet parents, like you. */}
                    Peace of mind for pet parents, confidence for sitters.
                  </p>
                </div>

                <div className="flex item-start gap-2 md:gap-3">
                  <TickIcon/>
                  <p className="text-sm md:text-base text-[#024B5E]">
                    {/* <span className="text-[#357F91] font-semibold">
                      Messaging & photo updates
                    </span>{" "}
                    from your sitter during each stay. */}
                    Clear safety standards for every booking.
                  </p>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <TickIcon/>
                  <p className="text-sm md:text-base text-[#024B5E]">
                    {/* {/* <span className="text-[#357F91] font-semibold">
                      The Rover Guarantee
                    </span>{" "}
                    can protect you and your pet for up to $25,000 in eligible
                    vet care.{" "}
                    <span className="text-[#357F91] underline cursor-pointer">
                      Learn more 
                    </span> */}
                    Secure payments from start to finish.
                  </p>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <TickIcon/>
                  <p className="text-sm md:text-base text-[#024B5E]">
                    {/* {/* <span className="text-[#357F91] font-semibold">
                      The Rover Guarantee
                    </span>{" "}
                    can protect you and your pet for up to $25,000 in eligible
                    vet care.{" "}
                    <span className="text-[#357F91] underline cursor-pointer">
                      Learn more 
                    </span> */}
                    Support that’s there when it matters most.
                  </p>
                </div>
                
                <div className="flex items-start gap-2 md:gap-3">
                  <TickIcon/>
                  <p className="text-sm md:text-base text-[#024B5E]">
                    {/* {/* <span className="text-[#357F91] font-semibold">
                      The Rover Guarantee
                    </span>{" "}
                    can protect you and your pet for up to $25,000 in eligible
                    vet care.{" "}
                    <span className="text-[#357F91] underline cursor-pointer">
                      Learn more 
                    </span> */}
                    Resources and education to level up your pet care.
                  </p>
                </div>

                {/* <div>
                  <p className="text-[#024B5E] text-center text-semibold md:text-lg ">
                    Connect with pet owners once your <br /> profile is approved
                    </p>
                </div> */}
              </div>

              {/* CTA Button */}
              <Link
                href="/signup"
                className="w-full bg-[#035F75] hover:bg-[#024d5e] text-white font-semibold py-3 md:py-4 rounded-xl transition-all hover:shadow-lg block text-center text-sm md:text-base"
              >
                Start creating your profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
