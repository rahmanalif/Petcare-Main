"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Home,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "@/redux/petSlice";
import { fetchWithAuth } from "@/lib/auth";
import BookingStatusModal from "./BookingStatusModal";
import BookingPaymentModal from "./BookingPaymentModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_KEY_MAP = {
  M: "Mon",
  T: "Tue",
  W: "Wed",
  T2: "Thu",
  F: "Fri",
  S: "Sat",
  Sun: "Sun",
};
const RATE_LABEL_MAP = {
  holiday: "Holiday Rate",
  puppy: "Puppy Rate",
  cat: "Cat Care",
  additionalCat: "Additional Cat",
  extendedStay: "Extended Care",
  bathingGrooming: "Bathing/ Grooming",
  pickupDropoff: "Sitter Pick-Up and Drop-off",
  sixtyMinuteRate: "60 minute rate",
  walking60MinRate: "60 minute rate",
};
const FALLBACK_EXTRA_SERVICES = [
  { name: "Bathing/ Grooming", price: 60 },
  { name: "Sitter Pick-Up and Drop-off", price: 48 },
  { name: "Extended Care", price: 10 },
];

const normalizeDateForInput = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!mdy) return "";
  const mm = mdy[1].padStart(2, "0");
  const dd = mdy[2].padStart(2, "0");
  const yyyy = mdy[3];
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeTimeForInput = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{2}:\d{2}$/.test(raw)) return raw;
  const match = raw.toUpperCase().replace(/\s+/g, "").match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  if (match[3] === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const toAmPm = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  const upper = raw.toUpperCase().replace(/\s+/g, "");
  const amPm = upper.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (amPm) return `${Number(amPm[1])}:${amPm[2]} ${amPm[3]}`;
  const twentyFour = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!twentyFour) return raw;
  const hour = Number(twentyFour[1]);
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return raw;
  const minute = twentyFour[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const converted = hour % 12 === 0 ? 12 : hour % 12;
  return `${converted}:${minute} ${suffix}`;
};

const toIsoDateTime = (dateValue, timeValue, fallbackDate = null) => {
  const dateRaw = String(dateValue || "").trim();
  const timeRaw = String(timeValue || "").trim();
  const [hourPart = "00", minutePart = "00"] = timeRaw.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  const dateBase = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
    ? new Date(`${dateRaw}T00:00:00`)
    : fallbackDate instanceof Date
      ? new Date(fallbackDate)
      : null;
  if (!dateBase || Number.isNaN(dateBase.getTime())) return "";

  if (Number.isFinite(hour) && Number.isFinite(minute)) {
    dateBase.setHours(hour, minute, 0, 0);
  }
  return dateBase.toISOString();
};

const resolvePetImage = (path) => {
  if (!path) return "/Ellipse.png";
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/+$/, "");
  const clean = String(path).replace(/^\/+/, "");
  return base ? `${base}/${clean}` : path;
};

const resolveProfileImage = (path) => {
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

export default function BookingModalBoarding({ isOpen, onClose, providerData }) {
  const dispatch = useDispatch();
  const { list: petList = [] } = useSelector((state) => state.pets);
  const { user } = useSelector((state) => state.auth);
  const { profile, services: profileServices, bookedDates } = useSelector((state) => state.sitterProfile);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [selectedPets, setSelectedPets] = useState([]);
  const [cachedAvailabilitySummary, setCachedAvailabilitySummary] = useState("");

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCachedAvailabilitySummary(
      localStorage.getItem("selectedSitterAvailabilitySummary") || ""
    );
  }, []);

  const pets = useMemo(
    () =>
      (Array.isArray(petList) ? petList : []).map((pet) => ({
        id: String(pet?._id || pet?.id || ""),
        name: pet?.name || "Unnamed Pet",
        breed: pet?.breed || pet?.type || "",
        image: resolvePetImage(pet?.coverPhoto || pet?.gallery?.[0]),
      })),
    [petList]
  );
  const displayName = profile?.fullName || "Seam Rahman";
  const displayLocation = toDisplayLocation(profile);
  const displayAvatar = resolveProfileImage(profile?.profilePicture);
  const displayRating = Number(profile?.averageRating ?? 0).toFixed(1);
  const displayReviewsCount = profile?.reviewsCount ?? 0;
  const fallbackAvailabilitySummary = useMemo(() => {
    const values = Array.isArray(profileServices)
      ? profileServices
          .map((service) => Number(service?.availability?.maxWalksPerDay))
          .filter((value) => Number.isFinite(value) && value > 0)
      : [];
    const max = values.length > 0 ? Math.max(...values) : 0;
    return `Still available for ${max} more pets today. (0 booked, ${max} remaining)`;
  }, [profileServices]);
  const displayAvailabilitySummary =
    String(profile?.availabilitySummary || "").trim() ||
    String(cachedAvailabilitySummary || "").trim() ||
    fallbackAvailabilitySummary;

  const addPet = (petId) => {
    if (!selectedPets.includes(petId)) {
      setSelectedPets([...selectedPets, petId]);
    }
  };

  const removePet = (petId) => {
    setSelectedPets(selectedPets.filter(id => id !== petId));
  };

  if (!isOpen) return null;

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

  const maxBookingsPerDay = !Array.isArray(profileServices) || profileServices.length === 0
    ? 0
    : (() => {
        const values = profileServices
          .map((service) => Number(service?.availability?.maxWalksPerDay))
          .filter((value) => Number.isFinite(value) && value > 0);
        return values.length > 0 ? Math.max(...values) : 0;
      })();

  const bookedDateMap = (() => {
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
  })();

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
    if (!dayInfo.isCurrentMonth) return;

    const nextDate = {
      day: dayInfo.day,
      month: dayInfo.month,
      year: dayInfo.year,
    };
    const isoDate = `${nextDate.year}-${String(nextDate.month + 1).padStart(2, "0")}-${String(nextDate.day).padStart(2, "0")}`;

    if (isSelectingStartDate || scheduleType === "one_time") {
      setSelectedDate(nextDate);
      setSelectedEndDate(scheduleType === "one_time" ? nextDate : null);
      setStartDate(isoDate);
      if (scheduleType === "one_time") setEndDate(isoDate);
      setIsSelectingStartDate(scheduleType !== "one_time");
      return;
    }

    setSelectedEndDate(nextDate);
    setEndDate(isoDate);
    setIsSelectingStartDate(true);
  };

  const isDateSelected = (dayInfo) => {
    return (
      (selectedDate &&
        selectedDate.day === dayInfo.day &&
        selectedDate.month === dayInfo.month &&
        selectedDate.year === dayInfo.year) ||
      (selectedEndDate &&
        selectedEndDate.day === dayInfo.day &&
        selectedEndDate.month === dayInfo.month &&
        selectedEndDate.year === dayInfo.year)
    );
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [note, setNote] = useState("");
  const [scheduleType, setScheduleType] = useState("one_time");
  const [repeatDays, setRepeatDays] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentIntentData, setPaymentIntentData] = useState(null);

  const openResultModal = (type, message) => {
    setResultModal({ open: true, type, message });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("selectedSearchContext");
    if (!raw) return;

    try {
      const context = JSON.parse(raw);
      setStartDate(normalizeDateForInput(context?.startDate));
      setEndDate(normalizeDateForInput(context?.endDate));
      setStartTime(normalizeTimeForInput(context?.startTime));
      setEndTime(normalizeTimeForInput(context?.endTime));
      if (Array.isArray(context?.selectedPets)) {
        setSelectedPets(context.selectedPets.map((id) => String(id)));
      }
      setScheduleType(context?.schedule === "repeatWeekly" ? "repeat_weekly" : "one_time");
      if (context?.selectedDays && typeof context.selectedDays === "object") {
        const normalizedDays = Object.entries(context.selectedDays)
          .filter(([, checked]) => Boolean(checked))
          .map(([key]) => DAY_KEY_MAP[key] || "")
          .filter(Boolean);
        setRepeatDays(normalizedDays);
      }
    } catch (error) {
      console.error("Failed to parse selectedSearchContext", error);
    }
  }, []);

  const toggleExtra = (name) => {
    setSelectedExtras((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const toggleRepeatDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const boardingService = useMemo(
    () =>
      (Array.isArray(profileServices) ? profileServices : []).find(
        (item) => String(item?.serviceType || "").toLowerCase() === "boarding"
      ),
    [profileServices]
  );

  const extraServiceOptions = useMemo(() => {
    const rates =
      boardingService?.rates && typeof boardingService.rates === "object"
        ? boardingService.rates
        : {};
    const mappedRates = Object.entries(rates)
      .filter(([key, value]) => key !== "base" && Number.isFinite(Number(value)) && Number(value) > 0)
      .map(([key, value]) => ({
        name: RATE_LABEL_MAP[key] || key,
        price: Number(value),
      }));
    return mappedRates.length > 0 ? mappedRates : FALLBACK_EXTRA_SERVICES;
  }, [boardingService]);

  const basePrice = useMemo(() => {
    return Number(boardingService?.rates?.base ?? 0);
  }, [boardingService]);

  const selectedServiceItems = useMemo(
    () => extraServiceOptions.filter((service) => selectedExtras.includes(service.name)),
    [extraServiceOptions, selectedExtras]
  );

  const totalPrice = useMemo(
    () => basePrice + selectedServiceItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [basePrice, selectedServiceItems]
  );

  const handleBookService = async () => {
    if (!API_BASE) {
      openResultModal("error", "API base URL is missing.");
      return;
    }
    if (!selectedPets.length) {
      openResultModal("error", "Please select at least one pet.");
      return;
    }

    const fallbackSitterId =
      typeof window !== "undefined" ? localStorage.getItem("selectedSitterId") || "" : "";
    const sitterId = String(
      profile?._id || profile?.id || providerData?.sitterId || fallbackSitterId || ""
    ).trim();
    if (!sitterId) {
      openResultModal("error", "Sitter ID not found.");
      return;
    }

    const startFallback = selectedDate
      ? new Date(selectedDate.year, selectedDate.month, selectedDate.day)
      : new Date();
    const endFallback = selectedEndDate
      ? new Date(selectedEndDate.year, selectedEndDate.month, selectedEndDate.day)
      : startFallback;
    const normalizedStartTime = toAmPm(startTime || "10:00");
    const normalizedEndTime = toAmPm(endTime || "18:00");
    const payload = {
      sitterId,
      pets: selectedPets,
      serviceType: "boarding",
      startDate: toIsoDateTime(startDate, startTime, startFallback),
      endDate: toIsoDateTime(endDate || startDate, endTime, endFallback),
      startTime: normalizedStartTime,
      endTime: normalizedEndTime,
      totalPrice,
      currency: "MXN",
      priceBreakdown: [
        { label: "Base Price", amount: basePrice },
        ...selectedServiceItems.map((item) => ({ label: item.name, amount: Number(item.price || 0) })),
      ],
      extrasIncluded: selectedServiceItems.map((item) => item.name),
      contactInfo: {
        phone: user?.phoneNumber || user?.phone || "",
        email: user?.email || "",
        home: user?.address || user?.home || "",
      },
      note,
      schedule:
        scheduleType === "repeat_weekly" && repeatDays.length > 0
          ? { type: "repeat_weekly", days: repeatDays }
          : { type: "one_time" },
    };

    if (!payload.startDate || !payload.endDate) {
      openResultModal("error", "Start date and end date are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetchWithAuth(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Failed to create booking.");
      }
      const bookingId = String(
        result?.data?._id || result?.data?.id || result?._id || result?.booking?._id || ""
      ).trim();

      if (!bookingId) {
        throw new Error("Booking created, but booking ID was not returned.");
      }

      const paymentResponse = await fetchWithAuth(
        `${API_BASE}/api/payments/create-booking-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        }
      );
      const paymentResult = await paymentResponse.json();
      if (!paymentResponse.ok || paymentResult?.success === false || !paymentResult?.clientSecret) {
        throw new Error(paymentResult?.message || "Booking created, but payment intent failed.");
      }

      setPaymentIntentData({
        ...paymentResult,
        bookingId,
      });
      setPaymentModalOpen(true);
    } catch (error) {
      openResultModal("error", error?.message || "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const BoardingIcon = ({ className = "" }) => (
    <img
      src="/icons/boardingIcon.png"
      alt="Boarding"
      className={`${className} object-contain w-5 h-5`}
    />
  );

  const DaycareIcon = ({ className = "" }) => (
    <img
      src="/icons/doggy.png"
      alt="Doggy Day Care"
      className={`${className} object-contain w-5 h-5`}
    />
  );

  const WalkingIcon = ({ className = "" }) => (
    <img
      src="/icons/walking.png"
      alt="Dog Walking"
      className={`${className} object-contain w-5 h-5`}
    />
  );

  return (
    <>
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto">
        {/* Header */}

        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {/* Profile Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300">
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-[#024B5E]">{displayName}</h3>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#024B5E]">
                <MapPin className="w-3 h-3" />
                <span className="">{displayLocation}</span>
              </div>
            </div>
          </div>

          {/* Price Badge */}
          {/* <div className="text-center bg-[#FCF0D980] py-3 border-2 border-amber-50 rounded-lg">
            <div className="text-2xl font-normal text-[#035F75] font-bakso">
              $25
            </div>
            <div className="text-xs text-[#E26A15]">
              Total per day
            </div>
          </div> */}

          {/* Stats */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-[#024B5E]">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-[#024B5E]" />
              <span className="">{displayRating} ({displayReviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-[#024B5E]">
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
                  fill="#024B5E"
                />
              </svg>
              <span className="text-[#024B5E]">Repeat pet owners</span>
            </div>
            <div className="flex items-center bg-[#FCF0D994] gap-2 text-xs sm:text-sm text-[#E26A15] p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-6 sm:h-6"
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
              <span className="font-montserrat">Background check</span>
            </div>
          </div>

          <Badge className="bg-[#E7F4F6] text-[#035F75] mb-2 font-montserrat text-[10px] sm:text-xs leading-relaxed whitespace-normal">
            <div className="px-1 sm:px-2">
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

          {/* Looking For Section */}
          <div>
            <h3 className="font-semibold mb-2 font-montserrat text-sm sm:text-base text-[#024B5E]">Looking For</h3>
            <div className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-sm text-[#024B5E] bg-gray-50 font-montserrat">
              <BoardingIcon className="w-5 h-5" />
              <span>Boarding</span>
            </div>
          </div>

          {/* Pet Selection */}
          <div>

            {/* Display Selected Pets */}
            <div className="space-y-3 mb-3">
              {selectedPets.map((petId) => {
                const pet = pets.find(p => p.id === petId);
                if (!pet) return null;
                return (
                  <div key={pet.id} className="border-2 border-[#024B5E] rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-xs sm:text-sm text-[#024B5E] font-montserrat">{pet.name}</div>
                      <div className="text-[10px] sm:text-xs text-[#024B5E] font-montserrat">{pet.breed}</div>
                    </div>
                    <button
                      onClick={() => removePet(pet.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove pet"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6.75 3.25V3.5H9.25V3.25C9.25 2.91848 9.1183 2.60054 8.88388 2.36612C8.64946 2.1317 8.33152 2 8 2C7.66848 2 7.35054 2.1317 7.11612 2.36612C6.8817 2.60054 6.75 2.91848 6.75 3.25ZM5.75 3.5V3.25C5.75 2.65326 5.98705 2.08097 6.40901 1.65901C6.83097 1.23705 7.40326 1 8 1C8.59674 1 9.16903 1.23705 9.59099 1.65901C10.0129 2.08097 10.25 2.65326 10.25 3.25V3.5H14C14.1326 3.5 14.2598 3.55268 14.3536 3.64645C14.4473 3.74021 14.5 3.86739 14.5 4C14.5 4.13261 14.4473 4.25979 14.3536 4.35355C14.2598 4.44732 14.1326 4.5 14 4.5H13.246L12.3 12.784C12.2302 13.3941 11.9384 13.9572 11.4801 14.3659C11.0218 14.7746 10.4291 15.0003 9.815 15H6.185C5.57093 15.0003 4.97823 14.7746 4.51993 14.3659C4.06162 13.9572 3.76976 13.3941 3.7 12.784L2.754 4.5H2C1.86739 4.5 1.74021 4.44732 1.64645 4.35355C1.55268 4.25979 1.5 4.13261 1.5 4C1.5 3.86739 1.55268 3.74021 1.64645 3.64645C1.74021 3.55268 1.86739 3.5 2 3.5H5.75ZM4.694 12.67C4.73574 13.036 4.91068 13.3738 5.18546 13.619C5.46025 13.8643 5.81567 13.9999 6.184 14H9.8155C10.1838 13.9999 10.5393 13.8643 10.814 13.619C11.0888 13.3738 11.2638 13.036 11.3055 12.67L12.24 4.5H3.7605L4.694 12.67ZM6.5 6.25C6.63261 6.25 6.75979 6.30268 6.85355 6.39645C6.94732 6.49021 7 6.61739 7 6.75V11.75C7 11.8826 6.94732 12.0098 6.85355 12.1036C6.75979 12.1973 6.63261 12.25 6.5 12.25C6.36739 12.25 6.24021 12.1973 6.14645 12.1036C6.05268 12.0098 6 11.8826 6 11.75V6.75C6 6.61739 6.05268 6.49021 6.14645 6.39645C6.24021 6.30268 6.36739 6.25 6.5 6.25ZM10 6.75C10 6.61739 9.94732 6.49021 9.85355 6.39645C9.75979 6.30268 9.63261 6.25 9.5 6.25C9.36739 6.25 9.24021 6.30268 9.14645 6.39645C9.05268 6.49021 9 6.61739 9 6.75V11.75C9 11.8826 9.05268 12.0098 9.14645 12.1036C9.24021 12.1973 9.36739 12.25 9.5 12.25C9.63261 12.25 9.75979 12.1973 9.85355 12.1036C9.94732 12.0098 10 11.8826 10 11.75V6.75Z" fill="#F34F4F"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Pet Dropdown */}
            <Select onValueChange={addPet}>
              <SelectTrigger className="text-[#024B5E] border-2 border-dashed border-[#024B5E] rounded-lg px-4 sm:px-17 py-3 sm:py-4 hover:bg-[#E7F4F6] transition-colors h-auto min-h-[50px] sm:min-h-[60px] font-montserrat">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="text-lg sm:text-xl font-medium">+</span>
                  <span className="text-sm sm:text-base font-medium">Add your pet</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {pets.filter(pet => !selectedPets.includes(pet.id)).map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium text-[#024B5E] font-montserrat">{pet.name}</span>
                        <span className="text-[#024B5E] text-sm font-montserrat"> - {pet.breed}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            {/* Calendar */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-montserrat h-8 w-8 sm:h-10 sm:w-10 p-0"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <span className="font-semibold font-montserrat text-xs sm:text-sm">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-montserrat h-8 w-8 sm:h-10 sm:w-10 p-0"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] sm:text-xs font-semibold text-[#024B5E] py-0.5 sm:py-1 font-montserrat"
                  >
                    {day}
                  </div>
                ))}

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
                        aspect-square flex items-center justify-center text-xs sm:text-sm rounded font-montserrat
                        ${!dayInfo.isCurrentMonth
                          ? "text-gray-300"
                          : "text-[#024B5E]"
                        }
                        ${isBooked ? "bg-[#FF4747] text-white font-semibold" : ""}
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

            <div className="mt-4">
              <span className="font-semibold text-black font-montserrat text-sm sm:text-base">
                Schedule
              </span>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setScheduleType("one_time")}
                  className={`border rounded-lg p-2 sm:p-4 text-[10px] sm:text-xs font-montserrat text-left ${
                    scheduleType === "one_time"
                      ? "border-[#024B5E] bg-[#E7F4F6] text-[#024B5E] font-semibold"
                      : "border-gray-300 text-[#024B5E]"
                  }`}
                >
                  Specific dates
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType("repeat_weekly")}
                  className={`border rounded-lg p-2 sm:p-4 text-[10px] sm:text-xs font-montserrat text-left ${
                    scheduleType === "repeat_weekly"
                      ? "border-[#024B5E] bg-[#E7F4F6] text-[#024B5E] font-semibold"
                      : "border-gray-300 text-[#024B5E]"
                  }`}
                >
                  Repeat Weekly
                </button>
              </div>
              {scheduleType === "repeat_weekly" ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleRepeatDay(day)}
                      className={`px-2 py-1 rounded border text-xs font-montserrat ${
                        repeatDays.includes(day)
                          ? "bg-[#024B5E] text-white border-[#024B5E]"
                          : "bg-white text-[#024B5E] border-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Start/End Date and Time */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-xs sm:text-sm font-montserrat text-[#024B5E] mb-1 block">
                  Start date
                </label>
                <input
                  type="date"
                  placeholder="Select"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm font-montserrat"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-montserrat text-[#024B5E] mb-1 block">
                  End date
                </label>
                <input
                  type="date"
                  placeholder="Select"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm font-montserrat"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-montserrat text-[#024B5E] mb-1 block">
                  Start time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm font-montserrat"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-montserrat text-[#024B5E] mb-1 block">
                  End time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm font-montserrat"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-2 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold mb-2 font-montserrat text-sm sm:text-base text-[#024B5E]">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm border-2 rounded-lg p-2 boarder-[#292D32] font-montserrat text-[#024B5E]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z"
                    stroke="#024B5E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z"
                    stroke="#024B5E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 9V18"
                    stroke="#024B5E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.5 13.5H16.5"
                    stroke="#024B5E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <span>Address</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm border-2 rounded-lg p-2 font-montserrat text-[#024B5E]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[22px] sm:h-[22px]"
                >
                  <path
                    d="M2.52762 10.6924C1.5796 9.03931 1.12185 7.68948 0.845837 6.32121C0.437622 4.29758 1.37181 2.32081 2.91938 1.05947C3.57345 0.526383 4.32323 0.708518 4.71 1.4024L5.58318 2.96891C6.27529 4.21057 6.62134 4.83139 6.5527 5.48959C6.48407 6.14779 6.01737 6.68386 5.08397 7.75601L2.52762 10.6924ZM2.52762 10.6924C4.44651 14.0383 7.45784 17.0513 10.8076 18.9724M10.8076 18.9724C12.4607 19.9204 13.8105 20.3782 15.1788 20.6542C17.2024 21.0624 19.1792 20.1282 20.4405 18.5806C20.9736 17.9266 20.7915 17.1768 20.0976 16.79L18.5311 15.9168C17.2894 15.2247 16.6686 14.8787 16.0104 14.9473C15.3522 15.0159 14.8161 15.4826 13.744 16.416L10.8076 18.9724Z"
                    stroke="#024B5E"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>

                <span>(225) 555-0109</span>
              </div>
            </div>
          </div>

          {/* Service Section */}
          <div>
            <h3 className="font-semibold mb-2 font-montserrat text-sm sm:text-base text-[#024B5E]">Service</h3>
            <div className="space-y-2">
              {extraServiceOptions.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-xs sm:text-sm font-montserrat text-[#024B5E]">
                    {service.name}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedExtras.includes(service.name)}
                      onChange={() => toggleExtra(service.name)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#035F75]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            {/* Note Section */}
            <div className="mb-3 sm:mb-4">
              <h3 className="font-semibold mb-2 text-sm sm:text-base text-[#024B5E] font-montserrat">Note</h3>
              <textarea
                placeholder="Please make sure all windows are secure locked after cleaning. Kindly use eco-friendly cleaning products. Thank you!"
                className="w-full px-2 sm:px-3 py-2 border rounded-lg border-[#024B5E] text-xs sm:text-sm font-montserrat resize-none text-[#024B5E]"
                rows="4"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            {/* Pricing Section */}
            <div>
              <h3 className="font-semibold mb-2 font-montserrat text-sm sm:text-base text-[#024B5E]">Pricing</h3>
              <div className="space-y-1 text-xs sm:text-sm text-[#024B5E]">
                <div className="flex justify-between font-montserrat">
                  <span>Base Price</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {selectedServiceItems.map((item) => (
                  <div className="flex justify-between font-montserrat" key={item.name}>
                    <span>{item.name}</span>
                    <span>${Number(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold font-montserrat pt-2 border-t">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Service Button */}
          <Button
            onClick={handleBookService}
            disabled={isSubmitting}
            className="w-full bg-[#024B5E] hover:bg-[#024a5c] text-white font-montserrat py-4 sm:py-6 text-sm sm:text-base disabled:opacity-70"
          >
            {isSubmitting ? "Booking..." : "Book Service"}
          </Button>
        </div>
      </div>
      <BookingStatusModal
        open={resultModal.open}
        type={resultModal.type}
        message={resultModal.message}
        onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
        onPrimary={() => {
          const isSuccess = resultModal.type === "success";
          setResultModal((prev) => ({ ...prev, open: false }));
          if (isSuccess) onClose?.();
        }}
      />
      <BookingPaymentModal
        open={paymentModalOpen}
        intentData={paymentIntentData}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={(message) => {
          setPaymentModalOpen(false);
          openResultModal("success", message || "Booking payment completed.");
        }}
      />
    </>
  );
}
