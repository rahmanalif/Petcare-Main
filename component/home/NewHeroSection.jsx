"use client";
import images from "next/image";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

const LeftImage = ({ className }) => (
  <img
    src="/icons/HeroImage01.png"
    alt="Left Hero Image"
    className="w-full h-full object-contain "
  />
);

const RightImage = ({ className }) => (
  <img
    src="/icons/HeroImage02.png"
    alt="Right Hero Image"
    className="w-full h-full object-contain "
  />
);

const DogMan = ({ className }) => (
  <img
    src="/icons/dogman.png"
    alt="Dog Man"
    className={`${className} w-full h-auto object-contain`}
  />
);

const BoardingIcon = ({ className }) => (
  <img
    src="/icons/boardingIcon.png"
    alt="Boarding"
    className={`${className} object-contain`}
  />
);

const DaycareIcon = ({ className }) => (
  <img
    src="/icons/doggy.png"
    alt="Doggy Day Care"
    className={`${className} object-contain`}
  />
);

const WalkingIcon = ({ className }) => (
  <img
    src="/icons/walking.png"
    alt="Dog Walking"
    className={`${className} object-contain`}
  />
);

const PawIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="106"
    height="89"
    viewBox="0 0 106 89"
    fill="none"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.4559 37.117C32.8586 44.2371 35.202 53.5918 30.2215 57.2494C25.2409 60.9069 15.1165 58.3626 7.40195 50.8134C-0.000628678 43.6933 -2.3441 34.3386 2.63633 30.681C7.61693 27.0235 17.6637 29.8991 25.4559 37.117ZM46.7011 16.8613C50.2124 26.5102 47.6495 35.6849 40.7204 37.0995C33.7914 38.5138 25.0657 31.7622 21.5544 22.1135C18.0431 12.4648 20.6055 3.29081 27.5345 1.87619C34.3859 0.792804 42.8002 7.11484 46.7011 16.8613ZM79.0949 19.3968C78.7912 29.4895 72.5673 36.692 65.3251 35.924C57.6936 35.058 52.314 26.3425 52.5401 16.5811C52.7662 6.81962 59.0678 -0.713979 66.3099 0.0538818C73.9414 0.919741 79.3209 9.63543 79.0949 19.3968ZM81.151 59.887C98.2125 71.5383 97.2868 82.5261 88.4123 85.2052C79.5376 87.8841 70.0311 79.1838 59.9869 79.8155C49.9426 80.4472 43.6421 89.7346 34.1411 88.0483C24.2507 86.264 19.7266 75.6592 32.7201 62.4437C41.8236 53.5105 42.8285 43.9445 54.1187 43.2751C65.3312 42.937 69.3872 52.0215 81.151 59.887ZM100.203 26.0984C106.435 29.4179 107.61 38.4801 102.477 46.307C97.7329 54.2318 88.6252 57.9041 82.3933 54.5848C76.1616 51.2655 74.9867 42.204 80.1196 34.377C85.2528 26.55 94.361 22.8769 100.203 26.0984Z"
      fill="#FE6C5D"
    />
  </svg>
);

export default function NewHeroSection() {
  const today = new Date();
  const todayFormatted = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
    today.getDate()
  ).padStart(2, "0")}/${today.getFullYear()}`;
  const [activeService, setActiveService] = useState("boarding");
    const [startDate, setStartDate] = useState(todayFormatted);
    const [endDate, setEndDate] = useState(todayFormatted);
    const [startTime, setStartTime] = useState("11:00pm");
    const [endTime, setEndTime] = useState("11:00pm");
    const [schedule, setSchedule] = useState("onetime");
    const [selectedDays, setSelectedDays] = useState([]);
  
    const services = [
      { id: "boarding", label: "Boarding", icon: BoardingIcon },
      { id: "daycare", label: "Doggy Day Care", icon: DaycareIcon },
      { id: "walking", label: "Dog Walking", icon: WalkingIcon },
    ];
  
    const daysOfWeek = [
      { id: "S", label: "S", full: "Sunday" },
      { id: "M", label: "M", full: "Monday" },
      { id: "T", label: "T", full: "Tuesday" },
      { id: "W", label: "W", full: "Wednesday" },
      { id: "Th", label: "T", full: "Thursday" },
      { id: "F", label: "F", full: "Friday" },
      { id: "Sa", label: "S", full: "Saturday" },
    ];
  
    const toggleDay = (dayId) => {
      setSelectedDays((prev) =>
        prev.includes(dayId)
          ? prev.filter((id) => id !== dayId)
          : [...prev, dayId]
      );
    };

  const serviceToSearchValue = {
    boarding: "boarding",
    daycare: "Doggy Day Care",
    walking: "Dog Walking",
  };

  const searchHref = {
    pathname: "/search",
    query: {
      fromHome: "1",
      service: serviceToSearchValue[activeService] || "boarding",
      startDate,
      endDate,
      startTime,
      endTime,
      schedule: schedule === "repeat" ? "repeatWeekly" : "oneTime",
      days: selectedDays.join(","),
    },
  };

  return (
    <div className="w-full bg-[#024B5E] relative">
      {/* Paw decorations */}
      <div className="absolute bottom-32 left-4 sm:left-8 md:left-12 lg:left-20 z-5 w-10 sm:w-14 md:w-16 -rotate-32">
        <PawIcon className="text-[#FE6C5D] opacity-80" />
      </div>
      <div className="absolute bottom-32 right-4 sm:right-8 md:right-12 lg:-right-0.5 z-5 w-10 sm:w-14 md:w-16 -rotate-50 ">
        <PawIcon className="text-[#EB5B13] opacity-80" />
      </div>

      {/* Hero Background Section */}
      <div className="relative w-full pb-32 md:pb-40 lg:-mt-40 xl:-mt-30 hero-1280-new-outer">
        {/* Mobile/Tablet Layout - Stack vertically */}
        <div className="block lg:hidden relative">
          {/* Images Row - Top */}
          <div className="flex justify-between items-start pt-4 sm:pt-6">
            <div className="w-[40%] sm:w-[25%]">
              <LeftImage />
            </div>
            <div className="w-[40%] sm:w-[25%]">
              <RightImage />
            </div>
          </div>

          {/* Text Content - Bottom */}
          <div className="px-4 pb-12 sm:pb-16 pt-6 sm:pt-8 text-center relative z-10 md:-top-25 ">
            <h1 className="font-bakso text-white mb-4">
              <span className="block text-3xl sm:text-4xl md:text-4xl  leading-tight">
                Trusted Pet Care,
              </span>
              <span className="block text-3xl sm:text-4xl md:text-4xl leading-tight">
                Whenever You Need It.
              </span>
            </h1>
            <p className="text-white text-sm sm:text-base max-w-2xl mx-auto font-montserrat">
              Trusted sitters, flexible bookings, and quality pet care—all in one
              place.
            </p>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex relative min-h-[700px] items-center justify-center py-16 lg:py-20 hero-1280-new-desktop">
          {/* Left Image */}
          <div className="absolute left-0 top-0 sm:w-[20%] xl:w-[23%] 2xl:w-[22%] h-full flex items-start z-10 hero-1280-new-left">
            <LeftImage />
          </div>

          {/* Center Content */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto hero-1280-new-center">
            <h1 className="font-bakso text-white mb-4">
              <span className="block text-3xl lg:text-4xl xl:text-5xl leading-tight">
                Trusted Pet Care,
              </span>
              <span className="block text-3xl lg:text-4xl xl:text-5xl leading-tight">
                Whenever You Need It.
              </span>
            </h1>
            <p className="text-white text-lg max-w-md xl:max-w-2xl font-montserrat">
              Trusted sitters, flexible bookings, and quality pet care—all in one
              place.
            </p>
          </div>

          {/* Right Image */}
          <div className="absolute right-0 top-0 sm:w-[18%] xl:w-[20%] 2xl:w-[20%] h-full flex items-start z-10 hero-1280-new-right">
            <RightImage />
          </div>
        </div>
      </div>

      {/* Booking Card - Overlapping Section */}
      <div id="booking-section" className="relative z-20 -mt-24 md:-mt-110 md:py-30  lg:-mt-110 xl:-mt-118 2xl:-mt-120 xl:mr- 2xl:mr-5 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:max-w-2xl lg:max-w-3xl xl:max-w-5xl  mx-auto">
          {/* Service Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
                  activeService === service.id
                    ? "border-[#024B5E] bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <service.icon className="w-12 h-12 sm:w-16 sm:h-16 shrink-0" />
                <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm font-bakso text-[#024B5E]">
                  {service.label}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Form Fields based on service */}
          {activeService === "boarding" ? (
            // Boarding: 4 columns - Start date, End date, Start time, End time
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4 border-2 border-gray-200 shadow-amber-50 rounded-lg p-3 sm:p-4">
              <div className="space-y-1">
                <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                  Start date
                </label>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  className="w-full text-[#024B5E] text-sm sm:text-base font-medium border-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                  End date
                </label>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  className="w-full text-[#024B5E] text-sm sm:text-base font-medium border-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                  Start time
                </label>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  className="w-full text-[#024B5E] text-sm sm:text-base font-medium border-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                  End time
                </label>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  className="w-full text-[#024B5E] text-sm sm:text-base font-medium border-gray-200"
                />
              </div>
            </div>
          ) : (
            // Daycare & Walking: 5 columns - Start date, End date, Start time, End time, Schedule
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 sm:gap-4 mb-3 sm:mb-4 items-stretch">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 border-2 border-gray-200 shadow-amber-50 rounded-lg p-2 sm:p-3 lg:col-span-4">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                    Start date
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    className="w-full text-[#024B5E] text-xs sm:text-sm font-medium border-gray-200 h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                    End date
                  </label>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    className="w-full text-[#024B5E] text-xs sm:text-sm font-medium border-gray-200 h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                    Start time
                  </label>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    className="w-full text-[#024B5E] text-xs sm:text-sm font-medium border-gray-200 h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                    End time
                  </label>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    className="w-full text-[#024B5E] text-xs sm:text-sm font-medium border-gray-200 h-9"
                  />
                </div>
              </div>
              <div className="space-y-1 border-2 border-gray-200 rounded-lg p-2 sm:p-3 h-full flex flex-col lg:col-span-2">
                <label className="text-xs sm:text-sm text-[#024B5E] font-medium mb-2">
                  Schedule
                </label>
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => setSchedule("onetime")}
                    className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium rounded-lg border-2 transition-all whitespace-nowrap ${
                      schedule === "onetime"
                        ? "bg-white text-[#024B5E] border-[#024B5E]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#024B5E]"
                    }`}
                  >
                    One Time
                  </button>
                  <button
                    onClick={() => setSchedule("repeat")}
                    className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium rounded-lg border-2 transition-all whitespace-nowrap ${
                      schedule === "repeat"
                        ? "bg-white text-[#024B5E] border-[#024B5E]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#024B5E]"
                    }`}
                  >
                    Repeat Weekly
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom row with day selector (for daycare and walking when repeat weekly) and search button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
              {(activeService === "daycare" || activeService === "walking") && schedule === "repeat" && (
                <div className="flex gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium text-sm sm:text-base transition-colors ${
                        selectedDays.includes(day.id)
                          ? "bg-[#024B5E] text-white"
                          : "bg-white text-[#024B5E] border-2 border-gray-200 hover:border-[#024B5E]"
                      }`}
                      title={day.full}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href={searchHref}>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#024B5E] hover:bg-[#035F75] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-colors">
              
                <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-6 sm:h-6"
              >
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Search here
            </button>
            </Link>
            
          </div>
        </div>
        {/* Dog Man Image - Below the card in teal background */}
      {/* <div className="absolute top-2 left-75 -z-10  pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
        <div className="  w-[300px] sm:w-[350px] md:w-[400px] lg:w-full xl:w-[11px]">
          <DogMan />
        </div>
      </div> */}
      </div>

      
    </div>
  );
}
