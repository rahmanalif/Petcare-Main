"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Map, MapTileLayer, MapMarker } from "@/components/ui/map";
import Portfolio from "../Portfolio";
import BookingModal from "../Booking/BookingServiceDaycare";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearProfile, fetchSitterProfile } from "@/redux/sitterProfileSlice";

const BoardingIcon = ({ className = "" }) => (
  <img
    src="/icons/boardingIcon.png"
    alt="Boarding"
    className={`${className} object-contain w-5 h-5`}
  />
);

const DayCareIcon = ({ className = "" }) => (
  <img
    src="/icons/doggy.png"
    alt="Day Care"
    className={`${className} object-contain w-5 h-5`}
  />
);

const WalkingIcon = ({ className = "" }) => (
  <img
    src="/icons/walking.png"
    alt="Walking"
    className={`${className} object-contain w-5 h-5`}
  />
);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const resolveImage = (path) => {
  if (!path) return "/Ellipse 52.png";
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/+$/, "");
  const clean = String(path).replace(/^\/+/, "");
  return base ? `${base}/${clean}` : path;
};

const toDisplayLocation = (profile) =>
  profile?.address ||
  [profile?.street, profile?.state, profile?.zipCode].filter(Boolean).join(", ") ||
  "New York, NY";

const DEFAULT_COORDINATES = [40.7128, -74.006];
const getProfileCoordinates = (profile) => {
  const lat = Number(profile?.coordinates?.lat);
  const lng = Number(profile?.coordinates?.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lat, lng];
  }
  return DEFAULT_COORDINATES;
};

const defaultServices = [
  { title: "Boarding", subtitle: "In the sitter's home", price: 99, unit: "per night", type: "boarding" },
  { title: "Doggy Day Care", subtitle: "In the sitter's home", price: 99, unit: "Per visit", type: "daycare" },
  { title: "Dog Walking", subtitle: "In your neighbourhood", price: 99, unit: "Per walk", type: "walking" },
];

export default function DaycareProfile({ sitterName = "Maya Johnson", sitterId = "" }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile, services, reviews, bookedDates } = useSelector((state) => state.sitterProfile);
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showBooking, setShowBooking] = useState(false);
  const [effectiveSitterId, setEffectiveSitterId] = useState(sitterId || "");
  const [cachedAvailabilitySummary, setCachedAvailabilitySummary] = useState("");
  const requestedServiceType = "daycare";

  useEffect(() => {
    if (sitterId) {
      setEffectiveSitterId(sitterId);
      if (typeof window !== "undefined") localStorage.setItem("selectedSitterId", sitterId);
      return;
    }
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("selectedSitterId") || "";
      if (cached) setEffectiveSitterId(cached);
      setCachedAvailabilitySummary(
        localStorage.getItem("selectedSitterAvailabilitySummary") || ""
      );
    }
  }, [sitterId]);

  useEffect(() => {
    if (!effectiveSitterId) return;
    dispatch(fetchSitterProfile({ sitterId: effectiveSitterId }));
    return () => dispatch(clearProfile());
  }, [dispatch, effectiveSitterId]);

  const displayName = profile?.fullName || sitterName;
  const displayLocation = toDisplayLocation(profile);
  const profileCoordinates = useMemo(
    () => getProfileCoordinates(profile),
    [profile?.coordinates?.lat, profile?.coordinates?.lng]
  );
  const displayAvatar = resolveImage(profile?.profilePicture);
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const homeDetails = Array.isArray(profile?.homeDetails) ? profile.homeDetails : [];
  const displayRating = Number(profile?.averageRating ?? 0).toFixed(1);
  const displayReviewsCount = profile?.reviewsCount ?? 0;
  const fallbackAvailabilitySummary = useMemo(() => {
    const values = Array.isArray(services)
      ? services
          .map((service) => Number(service?.availability?.maxWalksPerDay))
          .filter((value) => Number.isFinite(value) && value > 0)
      : [];
    const max = values.length > 0 ? Math.max(...values) : 0;
    return `Still available for ${max} more pets today. (0 booked, ${max} remaining)`;
  }, [services]);
  const displayAvailabilitySummary =
    String(profile?.availabilitySummary || "").trim() ||
    String(cachedAvailabilitySummary || "").trim() ||
    fallbackAvailabilitySummary;
  const aboutText =
    profile?.about ||
    "I provide attentive daycare with safe play, rest, and personalized pet routines.";

  const serviceSections = useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) {
      return defaultServices.map((s) => ({
        ...s,
        icon:
          s.type === "walking"
            ? <WalkingIcon className="w-10 h-10" />
            : s.type === "daycare"
              ? <DayCareIcon className="w-10 h-10" />
              : <BoardingIcon className="w-10 h-10" />,
        items: [],
      }));
    }

    const visibleServices = services.filter(
      (service) => String(service?.serviceType || "").toLowerCase() !== "sitting"
    );
    if (visibleServices.length === 0) return [];

    const metaMap = {
      walking: {
        title: "Dog Walking",
        subtitle: "In your neighbourhood",
        unit: "Per walk",
        icon: <WalkingIcon className="w-10 h-10" />,
      },
      daycare: {
        title: "Doggy Day Care",
        subtitle: "In the sitter's home",
        unit: "Per visit",
        icon: <DayCareIcon className="w-10 h-10" />,
      },
      boarding: {
        title: "Boarding",
        subtitle: "In the sitter's home",
        unit: "per night",
        icon: <BoardingIcon className="w-10 h-10" />,
      },
    };

    return visibleServices.map((service) => {
      const serviceType = String(service?.serviceType || "").toLowerCase();
      const meta = metaMap[serviceType] || {
        title: service?.serviceType || "Service",
        subtitle: "In the sitter's home",
        unit: "per day",
        icon: <BoardingIcon className="w-10 h-10" />,
      };
      const items = Object.entries(service?.rates || {})
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => ({ name: k, price: v, unit: "per day" }));
      return {
        type: serviceType,
        title: meta.title,
        subtitle: meta.subtitle,
        price: service?.rates?.base ?? 0,
        unit: meta.unit,
        icon: meta.icon,
        items,
      };
    });
  }, [services]);

  const filteredServiceSections = useMemo(() => {
    const matchedServices = serviceSections.filter(
      (section) => section?.type === requestedServiceType
    );
    return matchedServices.length > 0 ? matchedServices : serviceSections;
  }, [serviceSections]);

  const displayReviews = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) return [];
    return reviews.map((review) => ({
      name: review?.reviewerName || review?.name || "Pet Owner",
      rating: review?.rating || 0,
      date: review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : "",
      text: review?.comment || review?.text || "No comment.",
    }));
  }, [reviews]);

  const portfolioImages = useMemo(() => {
    const raw = Array.isArray(profile?.portfolioImages) ? profile.portfolioImages : [];
    return raw
      .map((src, i) => ({ id: i + 1, src: resolveImage(src), alt: `Pet ${i + 1}` }))
      .filter((item) => item.src);
  }, [profile?.portfolioImages]);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const totalDaysInMonth = lastDay.getDate();

    const days = [];

    // Add previous month's trailing days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
      });
    }

    // Add current month's days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        month: currentMonth,
        year: currentYear,
      });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const maxBookingsPerDay = useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) return 0;
    const values = services
      .map((service) => Number(service?.availability?.maxWalksPerDay))
      .filter((value) => Number.isFinite(value) && value > 0);
    return values.length > 0 ? Math.max(...values) : 0;
  }, [services]);

  const bookedDateMap = useMemo(() => {
    const dayCountMap = new globalThis.Map();
    if (!Array.isArray(bookedDates) || bookedDates.length === 0) return dayCountMap;

    bookedDates.forEach((entry) => {
      const rawDate = typeof entry === "string" ? entry : entry?.date;
      if (!rawDate) return;

      const dateObj = new Date(rawDate);
      if (Number.isNaN(dateObj.getTime())) return;
      if (dateObj.getMonth() !== currentMonth || dateObj.getFullYear() !== currentYear) return;

      const day = dateObj.getDate();
      const parsedCount = Number(typeof entry === "object" ? entry?.count : 1);
      const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1;
      dayCountMap.set(day, count);
    });

    return dayCountMap;
  }, [bookedDates, currentMonth, currentYear]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isCurrentMonth) {
      setSelectedDate({
        day: dayInfo.day,
        month: dayInfo.month,
        year: dayInfo.year,
      });
    }
  };

  const isDateSelected = (dayInfo) => {
    return (
      selectedDate &&
      selectedDate.day === dayInfo.day &&
      selectedDate.month === dayInfo.month &&
      selectedDate.year === dayInfo.year
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F4EF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 shrink-0 space-y-4">
            {!showBooking ? (
              <>
                <Card>
                  {/* Profile Section */}
                  <div className="p-6 m-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-300">
                        <img
                          src={displayAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{displayName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{displayLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="py-3 space-y-2 border-b">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-current text-gray-700" />
                      <span className="">{displayRating} ({displayReviewsCount} reviews)</span>
                    </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.18336 5.15771C9.39364 4.94743 9.73458 4.94743 9.94486 5.15771L11.3807 6.59361C11.5347 6.74761 11.5808 6.97921 11.4975 7.18042C11.4141 7.38163 11.2178 7.51282 11 7.51282H9.56411C7.08591 7.51282 5.07692 9.5218 5.07692 12C5.07692 14.4782 7.08608 16.4872 9.56431 16.4872H9.92308C10.2205 16.4872 10.4615 16.7283 10.4615 17.0257C10.4615 17.323 10.2205 17.5641 9.92308 17.5641H9.56431C6.49136 17.5641 4 15.073 4 12C4 8.92703 6.49113 6.4359 9.56411 6.4359H9.70005L9.18336 5.91921C8.97308 5.70893 8.97308 5.36799 9.18336 5.15771ZM12.9744 6.97436C12.9744 6.67698 13.2155 6.4359 13.5128 6.4359H13.8718C16.9448 6.4359 19.4359 8.92703 19.4359 12C19.4359 15.073 16.9448 17.5641 13.8718 17.5641H13.7359L14.2525 18.0808C14.4628 18.2911 14.4628 18.632 14.2525 18.8423C14.0422 19.0526 13.7014 19.0526 13.4911 18.8423L12.0552 17.4064C11.9012 17.2524 11.8551 17.0208 11.9384 16.8196C12.0218 16.6184 12.2182 16.4872 12.4359 16.4872H13.8718C16.35 16.4872 18.359 14.4782 18.359 12C18.359 9.5218 16.35 7.51282 13.8718 7.51282H13.5128C13.2155 7.51282 12.9744 7.27174 12.9744 6.97436Z"
                            fill="#035F75"
                          />
                        </svg>
                        <span>Repeat pet owners</span>
                      </div>
                      <div className="flex items-center bg-[#FCF0D994] gap-2 text-sm text-[#E26A15] rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                            fill="#F3934F"
                          />
                          <path
                            d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                            fill="#F3934F"
                          />
                        </svg>
                        <span>Background check</span>
                      </div>
                    </div>

                    <div className="py-3 text-sm">
                      <Badge className="bg-[#E7F4F6] text-[#035F75] mb-2 text-xs leading-relaxed whitespace-normal">
                        <div className="px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              opacity="0.4"
                              d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                              fill="#035F75"
                            />
                            <path
                              d="M18 11.25H12.75V6C12.75 5.59 12.41 5.25 12 5.25C11.59 5.25 11.25 5.59 11.25 6V11.25H6C5.59 11.25 5.25 11.59 5.25 12C5.25 12.41 5.59 12.75 6 12.75H11.25V18C11.25 18.41 11.59 18.75 12 18.75C12.41 18.75 12.75 18.41 12.75 18V12.75H18C18.41 12.75 18.75 12.41 18.75 12C18.75 11.59 18.41 11.25 18 11.25Z"
                              fill="#035F75"
                            />
                          </svg>
                        </div>
                        {displayAvailabilitySummary}
                      </Badge>
                    </div>

                    <Button
                      className="w-full bg-[#035F75] hover:bg-[#024a5c] text-white mb-3"
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push("/login");
                          return;
                        }
                        setShowBooking(true);
                      }}
                    >
                      Book Service
                    </Button>
                  </div>

                  {/* Services List */}
                  <div className="px-4 pb-4">
                    {filteredServiceSections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {sectionIndex > 0 && <div className="border-t my-4" />}

                        {/* Section Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 shrink-0">
                              {section.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-base">
                                {section.title}
                              </h4>
                              <p className="text-gray-500 text-xs mt-0.5">
                                {section.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 text-base">
                              ${section.price}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {section.unit}
                            </div>
                          </div>
                        </div>

                        {/* Section Items */}
                        <div className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-start justify-between"
                            >
                              <span className="text-gray-600 text-sm font-medium">
                                {item.name}
                              </span>
                              <div className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-gray-400 text-sm">-</span>
                                  <span className="font-bold text-gray-900 text-sm">
                                    {item.isPlus ? "+" : ""}
                                    ${item.price}
                                  </span>
                                </div>
                                {item.unit && (
                                  <div className="text-gray-500 text-xs">
                                    {item.unit}
                                  </div>
                                )}
                                {item.note && (
                                  <div className="text-gray-500 text-xs text-right max-w-[120px]">
                                    {item.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar */}
                  <div className="p-4 border-t">
                    <h3 className="font-semibold mb-3">Calendar</h3>

                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#FF4747] rounded shrink-0"></div>
                        <span className="text-xs">Book</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=""
                        onClick={goToPreviousMonth}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-sm">
                        {monthNames[currentMonth]} {currentYear}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className=""
                        onClick={goToNextMonth}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-semibold text-gray-600 py-1"
                          >
                            {day}
                          </div>
                        )
                      )}

                      {calendarDays.map((dayInfo, index) => {
                        const bookedCount = dayInfo.isCurrentMonth ? (bookedDateMap.get(dayInfo.day) || 0) : 0;
                        const isBooked = bookedCount > 0;
                        const bookingMeta =
                          bookedCount > 0
                            ? maxBookingsPerDay > 0
                              ? `${bookedCount}/${maxBookingsPerDay} booked`
                              : `${bookedCount} booked`
                            : "";
                        const isSelected = isDateSelected(dayInfo);
                        const today = new Date();
                        const isToday =
                          dayInfo.day === today.getDate() &&
                          dayInfo.month === today.getMonth() &&
                          dayInfo.year === today.getFullYear();

                        return (
                          <div
                            key={index}
                            onClick={() => handleDateClick(dayInfo)}
                            title={bookingMeta || undefined}
                            className={`
                              aspect-square flex items-center justify-center text-sm rounded
                              ${!dayInfo.isCurrentMonth
                                ? "text-gray-300"
                                : "text-gray-700"
                              }
                              ${isBooked
                                ? "bg-[#FF4747] text-white font-semibold"
                                : ""
                              }
                              ${isSelected && !isBooked
                                ? "bg-[#008364] text-white font-semibold"
                                : ""
                              }
                              ${isToday && !isBooked && !isSelected
                                ? "border-2 border-[#008364]"
                                : ""
                              }
                              ${dayInfo.isCurrentMonth && !isBooked
                                ? "hover:bg-gray-100 cursor-pointer"
                                : ""
                              }
                              ${!dayInfo.isCurrentMonth ? "cursor-default" : ""}
                            `}
                          >
                            {dayInfo.day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <BookingModal
                isOpen={true}
                onClose={() => setShowBooking(false)}
              />
            )}
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-0">
                <div className="flex gap-8 px-6 pt-6 border-b border-gray-200 justify-center">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`pb-3 px-4 font-medium ${activeTab === "about"
                      ? "text-[#035F75] border-b-2 border-[#035F75]"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("portfolio")}
                    className={`pb-3 px-4 font-medium ${activeTab === "portfolio"
                      ? "text-[#035F75] border-b-2 border-[#035F75]"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Portfolio
                  </button>
                </div>

                {activeTab === "about" ? (
                  <>
                    {/* About Section */}
                    <div className="p-6">
                      <h2 className="font-semibold text-xl mb-3">
                        {displayName}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {aboutText}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Portfolio Section */}
                    <div className="p-6">
                      {portfolioImages.length > 0 ? (
                        <Portfolio images={portfolioImages} />
                      ) : null}
                    </div>
                  </>
                )}
              </CardContent>
              {activeTab === "about" && (
                <>
                  {/* Skills*/}
                  <Card className="p-2 m-4 mt-2">
                    <CardContent className="p-3">
                      <h3 className="font-semibold mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                          <Badge
                            key={`${skill}-${index}`}
                            variant="outline"
                            className="flex items-center gap-2 py-2 px-3"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>{skill}</span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Home Details - Boarding specific */}
                  <Card className="mt-6 mb-6 m-4">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Home Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {homeDetails.map((item, index) => (
                          <DetailItem
                            key={`${item}-${index}`}
                            icon={
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                  stroke="#292D32"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
                                  stroke="#292D32"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            }
                            text={item}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card className="mb-6 m-4">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">
                        Location{" "}
                        <span className="text-sm font-normal text-gray-500">
                          - {displayLocation}
                        </span>
                      </h3>
                      <div className="w-full h-48 rounded overflow-hidden">
                        <Map
                          key={`${profileCoordinates[0]}-${profileCoordinates[1]}`}
                          center={profileCoordinates}
                          zoom={13}
                        >
                          <MapTileLayer />
                          <MapMarker position={profileCoordinates} />
                        </Map>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews */}
                  <Card className="m-4">
                    <CardContent className="p-6 ">
                      <h3 className="font-semibold mb-4">Top Reviews</h3>
                      <div className="space-y-4">
                        {displayReviews.map((review, index) => (
                          <div
                            key={index}
                            className="pb-4 border-b last:border-b-0"
                          >
                            <div className="flex items-start justify-between mb-2 gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0">
                                  <img
                                    src="/Ellipse 10.png"
                                    alt="Pet"
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold truncate">
                                    {review.name}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-3 h-3 fill-current text-yellow-400"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className=" text-gray-500 shrink-0">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {review.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span className="shrink-0">{icon}</span>
      <span className="wrap-break-word">{text}</span>
    </div>
  );
}
