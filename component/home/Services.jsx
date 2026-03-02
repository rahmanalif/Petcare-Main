"use client";

import Image from "next/image";

const handleBookNowClick = () => {
    const element = document.getElementById('booking-section');

    if (element) {
        // Get the element's position
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - 100; // 100px offset for header

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } else {
        console.error('booking-section element not found');
        // Fallback: scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const PawImage = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="41" viewBox="0 0 42 41" fill="none">
  <g opacity="0.5">
    <path d="M21.2973 19.7631C16.8608 20.4365 16.2561 24.6345 12.5683 28.8971C7.2693 35.1397 8.81679 39.8786 12.5314 40.4512C16.2461 41.0238 18.8787 36.5547 22.8916 36.3121C26.8208 35.8134 30.3141 39.597 33.7818 38.1174C37.2915 36.7659 37.8988 31.7121 31.4952 26.7939C27.1977 23.5723 25.7325 19.5175 21.2973 19.7631Z" fill="white"/>
    <path d="M9.451 17.2096C12.1892 20.6578 12.9189 24.9494 11.1007 26.7872C9.16179 28.6667 5.38697 27.3927 2.64872 23.9445C-0.0895253 20.4963 -0.819192 16.2047 0.998996 14.3669C2.93795 12.4874 6.71275 13.7614 9.451 17.2096Z" fill="white"/>
    <path d="M31.5642 14.9093C29.4162 18.6648 29.6274 22.7561 31.9026 24.1262C34.1778 25.4962 37.8007 23.6738 39.9488 19.9184C42.0969 16.1629 41.8857 12.0715 39.6104 10.7015C37.2089 9.37497 33.5859 11.1974 31.5642 14.9093Z" fill="white"/>
    <path d="M18.7929 7.84569C20.1254 12.3537 18.8905 16.6926 16.2118 17.4649C13.5331 18.2372 10.2887 15.1404 8.95619 10.6324C7.62365 6.12434 8.85857 1.78545 11.5373 1.01314C14.216 0.24084 17.4604 3.33767 18.7929 7.84569Z" fill="white"/>
    <path d="M21.1485 7.44841C20.8131 11.8287 22.7975 15.4098 25.4404 15.5999C28.2054 15.7479 30.653 12.4284 31.0289 8.17179C31.3643 3.7915 29.3799 0.210398 26.737 0.0203016C24.0537 -0.293455 21.484 3.06812 21.1485 7.44841Z" fill="white"/>
  </g>
</svg>

);

const BgImage = ({className}) => (  
    <img src="/bg.png" alt="BackGroundImage" className="w-full h-full object-cover" />
);

const DogBoardingIcon = ({className}) => (
    <img src="icons/boardingIcon01.png" alt="Dog Boarding Icon" />
);

const DogDayCareIcon = ({className}) => (
    <img src="icons/doggy.png" alt="Dog Day Care Icon" />
);

const DogWalkingIcon = ({className}) => (
    <img src="icons/walking.png" alt="Dog Walking Icon" />
);



export default function Services() {
    return (
        <div id="services" className="relative py-46 px-8 md:px-16 lg:px-24 overflow-hidden " style={{ backgroundColor: '#012e3a' }}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <BgImage />
            </div>

            {/* Decorative Paw Prints */}
            <div className="absolute top-8 right-[55%] z-5">
                <PawImage />
            </div>
            <div className="absolute top-20 right-[52%] z-5">
                <PawImage />
            </div>
            <div className="absolute bottom-16 left-8 z-5">
                <PawImage />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Section - Heading and Description */}
                <div className="text-white">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide font-bakso" >
                        SERVICES
                    </h2>
                    <p className="text-base md:text-lg text-justify leading-relaxed mb-8 max-w-md">
                        We offer reliable and loving pet care services to ensure your pets receive the attention, comfort, and care they deserve. Whether it's safe boarding, engaging doggy day care, or regular dog walking, our experienced caregivers focus on your pet's well-being, happiness, and daily routine, giving you complete peace of mind.
                    </p>
                    <button
                        onClick={handleBookNowClick}
                        type="button"
                        className="bg-white text-[#FF6B6B] hover:text-[#FF6B6B] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors font-bakso"
                    >
                        BOOK NOW
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Right Section - Services List */}
                <div className="space-y-8">
                    {/* Dog Boarding */}
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 w-14 h-14 flex items-center justify-center">
                            <DogBoardingIcon />
                        </div>
                        <div className="text-white">
                            <h3 className="text-2xl font-bold mb-2 font-bakso" >
                                DOG BOARDING
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed">
                                Your pets stay overnight in your sitter's home. They'll be treated like part of the family in a familiar environment.
                            </p>
                        </div>
                    </div>

                    {/* Doggy Day Care */}
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 w-14 h-14 flex items-center justify-center">
                            <DogDayCareIcon />
                        </div>
                        <div className="text-white">
                            <h3 className="text-2xl font-bold mb-2 font-bakso">
                                DOGGY DAY CARE
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed">
                                Your dog spends the day at your sitter's home. Drop them off in the morning and pick up a happy pup in the evening.
                            </p>
                        </div>
                    </div>

                    {/* Dog Walking */}
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 w-14 h-14 flex items-center justify-center">
                            <DogWalkingIcon />
                        </div>
                        <div className="text-white">
                            <h3 className="text-2xl font-bold mb-2 font-bakso">
                                DOG WALKING
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed">
                                Your dog gets a walk around your neighborhood. Perfect for busy days and dogs with extra energy to burn.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
