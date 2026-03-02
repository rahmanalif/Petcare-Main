"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

// Custom icons to match the design
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
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.4559 37.117C32.8586 44.2371 35.202 53.5918 30.2215 57.2494C25.2409 60.9069 15.1165 58.3626 7.40195 50.8134C-0.000628678 43.6933 -2.3441 34.3386 2.63633 30.681C7.61693 27.0235 17.6637 29.8991 25.4559 37.117ZM46.7011 16.8613C50.2124 26.5102 47.6495 35.6849 40.7204 37.0995C33.7914 38.5138 25.0657 31.7622 21.5544 22.1135C18.0431 12.4648 20.6055 3.29081 27.5345 1.87619C34.3859 0.792804 42.8002 7.11484 46.7011 16.8613ZM79.0949 19.3968C78.7912 29.4895 72.5673 36.692 65.3251 35.924C57.6936 35.058 52.314 26.3425 52.5401 16.5811C52.7662 6.81962 59.0678 -0.713979 66.3099 0.0538818C73.9414 0.919741 79.3209 9.63543 79.0949 19.3968ZM81.151 59.887C98.2125 71.5383 97.2868 82.5261 88.4123 85.2052C79.5376 87.8841 70.0311 79.1838 59.9869 79.8155C49.9426 80.4472 43.6421 89.7346 34.1411 88.0483C24.2507 86.264 19.7266 75.6592 32.7201 62.4437C41.8236 53.5105 42.8285 43.9445 54.1187 43.2751C65.3312 42.937 69.3872 52.0215 81.151 59.887ZM100.203 26.0984C106.435 29.4179 107.61 38.4801 102.477 46.307C97.7329 54.2318 88.6252 57.9041 82.3933 54.5848C76.1616 51.2655 74.9867 42.204 80.1196 34.377C85.2528 26.55 94.361 22.8769 100.203 26.0984Z"
      fill="#357F91"
    />
  </svg>
);

export default function HeroSection() {
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

  // Render form fields based on active service
  const renderFormFields = () => {
    if (activeService === "boarding") {
      // Boarding: 4 columns - Start date, End date, Start time, End time
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 border-2 border-gray-200 shadow-amber-50 rounded-lg p-7 sm:p-7">
          <div className="space-y-2 ">
            <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
              Start date
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#035F75] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
              End date
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
              Start time
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#035F75] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
              End time
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    } else {
      // Daycare & Walking: 5 columns - Start date, End date, Start time, End time, Schedule
      return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-2 border-gray-200 shadow-amber-50 rounded-lg p-3 sm:p-4 lg:col-span-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                Start date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-gray-500 font-medium">
                End date
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                Start time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
                End time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-[#024B5E] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-2 border-2 border-gray-200 rounded-lg p-3 sm:p-4 h-full flex flex-col">
            <label className="text-xs sm:text-sm text-[#024B5E] font-medium">
              Schedule
            </label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden flex-1">
              <button
                onClick={() => setSchedule("onetime")}
                className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${schedule === "onetime"
                  ? "bg-white text-[#024B5E] border-r border-gray-200"
                  : "bg-gray-50 text-[#024B5E] border-r border-gray-200 hover:bg-gray-100"
                  }`}
              >
                One Time
              </button>
              <button
                onClick={() => setSchedule("repeat")}
                className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${schedule === "repeat"
                  ? "bg-white text-[#024B5E]"
                  : "bg-gray-50 text-[#024B5E] hover:bg-gray-100"
                  }`}
              >
                Repeat Weekly
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#F8F4EF] w-full">
      <div className="relative w-full max-w-[1669px] mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background Image Container */}
        <div
          className="w-full h-[600px] sm:h-[500px] md:h-[600px] lg:h-[777px] bg-size-[100%_auto] bg-bottom md:bg-cover md:bg-center bg-no-repeat rounded-lg sm:rounded-xl lg:rounded-2xl bg-[url('/MobileIMAGE%20.png')] md:bg-[url('/IMAGE%20(2).png')]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-6 lg:pt-4 pb-8 sm:pb-12 lg:pb-16 hero-1280-up-outer">
            {/* Left Content */}
            <div className="max-w-xl py-6 sm:py-10 md:py-12 lg:pt-6 lg:pb-20 hero-1280-up-inner">
              <h1 className="mb-4 sm:mb-6 font-bakso">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#024B5E] leading-tight">
                  trusted Pet Care,
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#024B5E] leading-tight">
                  Whenever You Need It.
                </span>
              </h1>
              <p className="text-[#024B5E] text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 font-montserrat">
                <span className=" tracking-wide font-bakso text-[#024B5E]">
                  Find reliable sitters, walkers, and groomers near you—book in minutes.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Service Selection Cards - positioned to overlap the background */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-w-5xl mx-auto -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 relative z-10">
          {/* Service Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex flex-row sm:flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${activeService === service.id
                  ? "border-teal-600 bg-white"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <service.icon
                  className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 ${activeService === service.id
                    ? "text-teal-600"
                    : "text-teal-600"
                    }`}
                />
                <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm font-bakso text-[#024B5E]">
                  {service.label}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Form Fields */}
          {renderFormFields()}

          {/* Bottom row with paw, day selector (for daycare), and search button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <PawIcon className="w-12 h-12 md:w-16 md:h-16 text-teal-600" />
              </div>
              {activeService === "daycare" && (
                <div className="flex gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium text-sm sm:text-base transition-colors ${selectedDays.includes(day.id)
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
            <Link
              href={searchHref}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#035F75] hover:bg-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-colors"
            >
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
