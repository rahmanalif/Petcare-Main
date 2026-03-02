"use client";
import React, { useState } from "react";
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

export default function BookingModal({ isOpen, onClose, providerData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  if (!isOpen) return null;

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
    const remainingDays = 42 - days.length;
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
  const bookedDays = [12, 13, 14];

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
      if (isSelectingStartDate) {
        setSelectedDate({
          day: dayInfo.day,
          month: dayInfo.month,
          year: dayInfo.year,
        });
        setIsSelectingStartDate(false);
      } else {
        setSelectedEndDate({
          day: dayInfo.day,
          month: dayInfo.month,
          year: dayInfo.year,
        });
      }
    }
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

  const services = [
    { name: "Bathing/ Grooming", price: 60.0 },
    { name: "Sitter Pick-Up and Drop-off", price: 48.0 },
    { name: "Extended Care", price: 10.0 },
    { name: "Additional Pet Rate", price: 10.0 },
  ];

  const [lookingFor, setLookingFor] = useState("boarding");
  const [startDate, setStartDate] = useState("01/09/2025");
  const [endDate, setEndDate] = useState("01/09/2025");
  const [startTime, setStartTime] = useState("11:00am");
  const [endTime, setEndTime] = useState("11:00pm");
  const [selectedPet, setSelectedPet] = useState("bob");
  const [showMap, setShowMap] = useState(false);

  const BoardingIcon = ({ className = "" }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2V4M6 2V4"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.05 22C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.4765 5.68186 21.4996 7.80438 21.5 12"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 8H21"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 18H21M17 14L17 22"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const DaycareIcon = ({ className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2V10"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.92969 10.9297L6.33969 12.3397"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 18H4"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20 18H22"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.0702 10.9297L17.6602 12.3397"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 22H2"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 6L12 2L16 6"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 18C16 16.9391 15.5786 15.9217 14.8284 15.1716C14.0783 14.4214 13.0609 14 12 14C10.9391 14 9.92172 14.4214 9.17157 15.1716C8.42143 15.9217 8 16.9391 8 18"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const WalkingIcon = ({ className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 6C12.1046 6 13 5.10457 13 4C13 2.89543 12.1046 2 11 2C9.89543 2 9 2.89543 9 4C9 5.10457 9.89543 6 11 6Z"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 10C19.1046 10 20 9.10457 20 8C20 6.89543 19.1046 6 18 6C16.8954 6 16 6.89543 16 8C16 9.10457 16.8954 10 18 10Z"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.99975 10C9.65636 10 10.3065 10.1293 10.9132 10.3806C11.5198 10.6319 12.071 11.0002 12.5353 11.4645C12.9996 11.9288 13.3679 12.48 13.6191 13.0866C13.8704 13.6932 13.9997 14.3434 13.9997 15V18.5C13.9995 19.3365 13.6996 20.1452 13.1546 20.7796C12.6095 21.4141 11.8552 21.8324 11.0283 21.9587C10.2015 22.085 9.3567 21.9111 8.64704 21.4683C7.93738 21.0255 7.40976 20.3432 7.15975 19.545C6.73308 18.1683 5.83308 17.2667 4.45975 16.84C3.66193 16.5901 2.97991 16.0629 2.53711 15.3538C2.0943 14.6446 1.91996 13.8004 2.04564 12.9739C2.17131 12.1473 2.58869 11.3931 3.22226 10.8476C3.85582 10.3021 4.66372 10.0015 5.49975 10H8.99975Z"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  return (
    <>
      <div className="bg-white rounded-lg w-full">
        {/* Header */}

        <div className="p-4 space-y-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300">
              <img
                src="/Ellipse 52.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold">Seam Rahman</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Price Badge */}
          <div className="text-center bg-[#FCF0D980] py-3 border-2 border-amber-50 rounded-lg">
            <div className="text-2xl font-normal text-[#035F75] font-bakso">
              $25
            </div>
            <div className="text-xs text-[#E26A15]">
              Total per day
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current text-gray-700" />
              <span className="">5.0 (55 reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
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
              <span className="">Repeat pet owners</span>
            </div>
            <div className="flex items-center bg-[#FCF0D994] gap-2 text-sm text-[#E26A15]">
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
              <span className="font-montserrat">Background check</span>
            </div>
          </div>

          <Badge className="bg-[#E7F4F6] text-[#035F75] mb-2 font-montserrat text-xs leading-relaxed whitespace-normal">
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
            Still available for 2 more pets today. (3 booked, 2 remaining)
          </Badge>

          {/* Looking For Section */}
          <div>
            <h3 className="font-semibold mb-2 font-montserrat">Looking For</h3>
            <Select
              value={lookingFor}
              onValueChange={setLookingFor}
              className="font-montserrat"
            >
              <SelectTrigger className="w-full flex items-center justify-between px-4 py-3 border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boarding" className={"font-montserrat"}>
                  <BoardingIcon className="inline-block mr-2" /> Boarding
                </SelectItem>
                <SelectItem value="daycare" className={"font-montserrat"}>
                  <DaycareIcon className="inline-block mr-2" />
                  Daycare
                </SelectItem>
                <SelectItem value="walking" className={"font-montserrat"}>
                  <WalkingIcon className="inline-block mr-2" />
                  Walking
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add your pet button */}
          <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 font-montserrat text-sm flex items-center justify-center  gap-4">
            <span className="text-xl">+</span> Add your pet
          </button>

          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="font-montserrat"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold font-montserrat text-sm">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="font-montserrat"
                onClick={goToNextMonth}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-600 py-1 font-montserrat"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((dayInfo, index) => {
                const isBooked =
                  dayInfo.isCurrentMonth && bookedDays.includes(dayInfo.day);
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
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded font-montserrat
                      ${
                        !dayInfo.isCurrentMonth
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                      ${isBooked ? "bg-[#FF4747] text-white font-semibold" : ""}
                      ${
                        isSelected && !isBooked
                          ? "bg-[#008364] text-white font-semibold"
                          : ""
                      }
                      ${
                        isToday && !isBooked && !isSelected
                          ? "border-2 border-[#008364]"
                          : ""
                      }
                      ${
                        dayInfo.isCurrentMonth && !isBooked
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

          <div>
            <span className="font-semibold text-black font-montserrat">
              Schedule
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-lg p-4 text-xs">
                Specific dates
                </div>
              <div className="border rounded-lg p-4 text-xs">
                Repeat Weekly
                </div>
            </div>
          </div>

          {/* Start/End Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-montserrat text-black mb-1 block">
                Start date
              </label>
              <input
                type="text"
                placeholder="Select"
                className="w-full px-3 py-2 border rounded-lg text-sm font-montserrat"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-montserrat text-black-700 mb-1 block">
                End date
              </label>
              <input
                type="text"
                placeholder="Select"
                className="w-full px-3 py-2 border rounded-lg text-sm font-montserrat"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-montserrat text-black-700 mb-1 block">
                Start time
              </label>
              <input
                type="time"
                defaultValue="10:00:00"
                className="w-full px-3 py-2 border rounded-lg text-sm font-montserrat"
              />
            </div>
            <div>
              <label className="text-sm font-montserrat text-gray-700 mb-1 block">
                End time
              </label>
              <input
                type="time"
                defaultValue="10:00:00"
                className="w-full px-3 py-2 border rounded-lg text-sm font-montserrat"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-2 rounded-lg p-4">
            <h3 className="font-semibold mb-2 font-montserrat">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm border-2 rounded-lg p-2 boarder-[#292D32] font-montserrat">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 9V18"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.5 13.5H16.5"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <span>Address</span>
              </div>
              <div className="flex items-center gap-2 text-sm border-2 rounded-lg p-2 font-montserrat">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.52762 10.6924C1.5796 9.03931 1.12185 7.68948 0.845837 6.32121C0.437622 4.29758 1.37181 2.32081 2.91938 1.05947C3.57345 0.526383 4.32323 0.708518 4.71 1.4024L5.58318 2.96891C6.27529 4.21057 6.62134 4.83139 6.5527 5.48959C6.48407 6.14779 6.01737 6.68386 5.08397 7.75601L2.52762 10.6924ZM2.52762 10.6924C4.44651 14.0383 7.45784 17.0513 10.8076 18.9724M10.8076 18.9724C12.4607 19.9204 13.8105 20.3782 15.1788 20.6542C17.2024 21.0624 19.1792 20.1282 20.4405 18.5806C20.9736 17.9266 20.7915 17.1768 20.0976 16.79L18.5311 15.9168C17.2894 15.2247 16.6686 14.8787 16.0104 14.9473C15.3522 15.0159 14.8161 15.4826 13.744 16.416L10.8076 18.9724Z"
                    stroke="black"
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
            <h3 className="font-semibold mb-2 font-montserrat">Service</h3>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm font-montserrat">
                    {service.name}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#035F75]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Note Section */}
          <div>
            <h3 className="font-semibold mb-2 text-[#035F75] font-montserrat">Note</h3>
            <textarea
              placeholder="Please make sure all windows are secure locked after cleaning. Kindly use eco-friendly cleaning products. Thank you!"
              className="w-full px-3 py-2 border rounded-lg border-[#035F75] text-sm font-montserrat resize-none"
              rows="4"
            />
          </div>

          {/* Pricing Section */}
          <div>
            <h3 className="font-semibold mb-2 font-montserrat">Pricing</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between font-montserrat">
                <span>Bathing/ Grooming</span>
                <span>$60.00</span>
              </div>
              <div className="flex justify-between font-montserrat">
                <span>Sitter Pick-Up and Drop-off</span>
                <span>$48.00</span>
              </div>
              <div className="flex justify-between font-montserrat">
                <span>Additional Pet Rate</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-semibold font-montserrat pt-2 border-t">
                <span>Total</span>
                <span>$170.00</span>
              </div>
            </div>
          </div>

          {/* Book Service Button */}
          <Button className="w-full bg-[#035F75] hover:bg-[#024a5c] text-white font-montserrat py-6">
            Book Service
          </Button>
        </div>
      </div>
    </>
  );
}
