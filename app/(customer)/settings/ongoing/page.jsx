"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchBookingById, 
  clearCurrentBooking, 
  requestReschedule,
  clearMessages as clearBookingMessages
} from "@/redux/sitter/bookingSlice";
import { fetchMessagesByUser, sendMessage, clearChat } from "@/redux/chat/chatSlice";

// Server URL
const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/100";
  if (path.startsWith("http")) return path;
  return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// --- Helper Components ---
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-1">
    <span className="text-[#024B5E] font-bold text-sm min-w-[140px]">{label}:</span>
    <span className="text-gray-500 text-sm text-right flex-1">{value || "N/A"}</span>
  </div>
);

const SectionHeading = ({ title, icon }) => (
  <h4 className="flex items-center gap-2 text-[#024B5E] font-bold text-sm mb-3">
    {icon && icon}
    {title}
  </h4>
);

export default function OngoingDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();

  // Redux State
  const { currentBooking: booking, calendarEvents, loading, actionLoading, successMessage, error } = useSelector((state) => state.booking);
  const { messages } = useSelector((state) => state.chat);

  // Local State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPetDetails, setShowPetDetails] = useState(true);
  const [activeView, setActiveView] = useState("details");

  // Inputs
  const [rescheduleForm, setRescheduleForm] = useState({ reason: "", startDate: "", endDate: "" });
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef(null);

  // Fetch Booking & Calendar Data
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
    return () => {
      dispatch(clearCurrentBooking());
      dispatch(clearChat());
    };
  }, [id, dispatch]);

  // Handle Reschedule Success
  useEffect(() => {
    if (successMessage) {
      alert("Reschedule request sent successfully!");
      dispatch(clearBookingMessages());
      setRescheduleForm({ reason: "", startDate: "", endDate: "" });
      setActiveView("details");
    }
  }, [successMessage, dispatch]);

  // Handle Errors
  useEffect(() => {
    if (error && activeView === "reschedule") {
      alert(`Error: ${error}`);
      dispatch(clearBookingMessages());
    }
  }, [error, activeView, dispatch]);

  // Chat Fetching
  useEffect(() => {
    if (activeView === "chat" && booking?.owner?._id) {
      dispatch(fetchMessagesByUser(booking.owner._id));
    }
  }, [activeView, booking, dispatch]);

  // --- ✅ FIXED Calendar Logic ---
  const today = new Date();

  // Start থেকে End পর্যন্ত সব দিন booked
  const bookedDays = [];
  if (booking) {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const current = new Date(start);
    while (current <= end) {
      if (
        current.getMonth() === currentDate.getMonth() &&
        current.getFullYear() === currentDate.getFullYear()
      ) {
        bookedDays.push(current.getDate());
      }
      current.setDate(current.getDate() + 1);
    }
  }

  // API থেকে available days
  const safeCalendarEvents = Array.isArray(calendarEvents) ? calendarEvents : [];
  const availableDays = safeCalendarEvents
    .filter((event) => {
      const d = new Date(event.date);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear() &&
        event.status === "available"
      );
    })
    .map((event) => new Date(event.date).getDate());

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: "", isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, isCurrentMonth: true });
    return days;
  };

  const calendarDays = generateCalendarDays(currentDate);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // --- Handlers ---
  const handleRescheduleSubmit = async () => {
    if (!rescheduleForm.startDate || !rescheduleForm.endDate) {
      alert("Please select both Start Date and End Date.");
      return;
    }
    if (!rescheduleForm.reason.trim()) {
      alert("Please provide a reason for rescheduling.");
      return;
    }
    dispatch(requestReschedule({
      id: booking._id,
      reason: rescheduleForm.reason,
      startDate: rescheduleForm.startDate,
      endDate: rescheduleForm.endDate,
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    dispatch(sendMessage({ recipientId: booking.owner._id, content: messageText }));
    setMessageText("");
  };

  if (loading) return <div className="p-10 text-center text-[#024B5E]">Loading...</div>;
  if (!booking) return <div className="p-10 text-center text-red-500">Booking not found</div>;

  const pet = booking.pets?.[0];

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.back()} className="text-[#024B5E]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-bold text-[#024B5E]">On going details</h1>
        </div>

        {activeView === "details" ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ===== LEFT: CALENDAR ===== */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-[#024B5E] font-semibold mb-2">Pet sitter Availability</h2>

              {/* Legend */}
              <div className="flex gap-4 mb-6 text-xs text-[#024B5E]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#FF6B6B] rounded-sm"></span> Booked
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#10B981] rounded-sm"></span> Available
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#035F75] rounded-sm"></span> Today
                </div>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="font-bold text-[#024B5E] text-sm">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-4 text-center">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="text-xs font-semibold text-gray-400">{d}</div>
                ))}
                {calendarDays.map((d, i) => {
                  const isBooked = d.isCurrentMonth && bookedDays.includes(d.day);
                  const isAvailable = d.isCurrentMonth && availableDays.includes(d.day) && !isBooked;
                  const isToday =
                    d.isCurrentMonth &&
                    d.day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  return (
                    <div key={i} className="flex justify-center">
                      <div className={`
                        w-7 h-7 flex items-center justify-center text-xs rounded-md transition-all duration-200
                        ${!d.isCurrentMonth ? "text-transparent pointer-events-none" : "text-gray-600"}
                        ${isBooked ? "bg-[#FF6B6B] text-white shadow-md cursor-not-allowed" : ""}
                        ${isAvailable ? "bg-[#10B981] text-white shadow-sm" : ""}
                        ${isToday && !isBooked && !isAvailable ? "border-2 border-[#035F75] font-bold text-[#035F75]" : ""}
                        ${d.isCurrentMonth && !isBooked && !isAvailable ? "hover:bg-[#E0F2FE] cursor-pointer" : ""}
                      `}>
                        {d.day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===== RIGHT: DETAILS ===== */}
            <div className="w-full lg:w-2/3 space-y-4">

              {/* 1. Owner Info Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
                <div className="absolute top-6 right-6 bg-[#E0F2F1] text-[#00695C] text-xs font-bold px-2 py-1 rounded">
                  {new Date(booking.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <img src={getImageUrl(booking.owner?.profilePicture)} className="w-12 h-12 rounded-full object-cover" alt="User" />
                  <div>
                    <h3 className="text-[#024B5E] font-bold text-lg">{booking.owner?.fullName}</h3>
                    <div className="flex items-center text-yellow-400 text-xs">★ <span className="text-gray-500 ml-1">5.0 (1,200)</span></div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-[#024B5E] mb-4">
                  <span className="font-semibold">{booking.serviceType || "Dog walking"}</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Live location
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-[#024B5E]">Contact</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {booking.owner?.phoneNumber}
                  </div>
                  <div className="text-xs text-[#024B5E]"><span className="font-semibold">Pick-up time:</span> {booking.startTime}</div>
                  <div className="text-xs text-[#024B5E]"><span className="font-semibold">Drop-off time:</span> {booking.endTime}</div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-sm font-semibold text-[#024B5E] mb-2">Pricing</p>
                  <div className="flex justify-between text-xs text-[#024B5E]">
                    <span>Base Price</span><span>${booking.priceBreakdown?.basePrice || 0}</span>
                  </div>
                  {booking.priceBreakdown && Object.entries(booking.priceBreakdown).map(([key, value]) => {
                    if (key !== "basePrice" && key !== "platformFee" && value > 0) {
                      return (
                        <div key={key} className="flex justify-between text-xs text-[#024B5E]">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span>${value}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <div className="flex justify-between text-sm font-bold text-[#024B5E] pt-2 border-t border-gray-100 mt-2">
                    <span>Total</span><span>${booking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* 2. Pet Info Card */}
              {pet && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div onClick={() => setShowPetDetails(!showPetDetails)} className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(pet.image)} alt={pet.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-[#024B5E] text-lg">{pet.name}</h4>
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${showPetDetails ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showPetDetails && (
                    <div className="p-6 pt-0 space-y-6">
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <SectionHeading title="Pet Information" />
                        <InfoRow label="Pet Name" value={pet.name} />
                        <InfoRow label="Type" value={pet.type} />
                        <InfoRow label="Weight (lbs)" value={`${pet.weight} ${pet.weightUnit || ""}`} />
                        <InfoRow label="Age" value={`${pet.ageYears} Yrs ${pet.ageMonths} Mon`} />
                        <InfoRow label="Breed" value={pet.breed} />
                        <InfoRow label="Gender" value={pet.gender} />
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <SectionHeading title="Additional details" />
                        <InfoRow label="Microchipped?" value={pet.microchipped ? "Yes" : "No"} />
                        <InfoRow label="Spayed/Neutered?" value={pet.spayedNeutered ? "Yes" : "No"} />
                        <InfoRow label="House Trained?" value={pet.houseTrained ? "Yes" : "No"} />
                        <InfoRow label="Friendly with children?" value={pet.friendlyWithChildren ? "Yes" : "No"} />
                        <InfoRow label="Friendly with dogs?" value={pet.friendlyWithDogs ? "Yes" : "No"} />
                        <InfoRow label="Adoption Date" value={pet.adoptionDate ? new Date(pet.adoptionDate).toLocaleDateString() : "N/A"} />
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <SectionHeading title="Care info" icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        } />
                        <InfoRow label="Potty break" value={pet.careInfo?.pottyBreak} />
                        <InfoRow label="Energy level" value={pet.careInfo?.energyLevel} />
                        <InfoRow label="Feeding schedule" value={pet.careInfo?.feedingSchedule} />
                        <InfoRow label="Can be left alone" value={pet.careInfo?.canBeLeftAlone} />
                        <InfoRow label="Medications" value={pet.careInfo?.medications} />
                        <div className="mt-2">
                          <span className="text-[#024B5E] font-bold text-sm">Pill</span>
                          <p className="text-gray-500 text-sm mt-1">{pet.careInfo?.pill || "N/A"}</p>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <SectionHeading title="Veterinary info" icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                        } />
                        <div className="mb-2">
                          <div className="text-gray-500 text-sm mt-1 space-y-1">
                            <p>Vet's Name: {pet.vetInfo?.name}</p>
                            <p>Clinic: {pet.vetInfo?.clinicName}</p>
                            <p>Address: {pet.vetInfo?.address}</p>
                            <p>Number: {pet.vetInfo?.contactNumber}</p>
                          </div>
                        </div>
                        <InfoRow label="Pet insurance provider" value={pet.vetInfo?.insuranceProvider} />
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <span className="text-[#024B5E] font-bold text-sm block mb-1">Note</span>
                        <p className="text-gray-500 text-sm">{pet.note || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setActiveView("reschedule")} className="bg-[#FE6C5D] hover:bg-[#E65B4C] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm text-sm transition-colors">
                  Reschedule
                </button>
                <button onClick={() => setActiveView("chat")} className="bg-[#035F75] hover:bg-[#024B5E] text-white font-medium px-8 py-2.5 rounded-lg shadow-sm text-sm transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Chat
                </button>
              </div>
            </div>
          </div>

        ) : activeView === "reschedule" ? (
          /* Reschedule UI */
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-200">
            <h2 className="text-xl font-bold text-[#024B5E] mb-6 text-center">Request Reschedule</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#024B5E] mb-2">New Start Date</label>
              <input type="date" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#035F75]" value={rescheduleForm.startDate} onChange={(e) => setRescheduleForm({ ...rescheduleForm, startDate: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#024B5E] mb-2">New End Date</label>
              <input type="date" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#035F75]" value={rescheduleForm.endDate} onChange={(e) => setRescheduleForm({ ...rescheduleForm, endDate: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#024B5E] mb-2">Reason</label>
              <textarea className="w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:outline-none focus:border-[#035F75]" placeholder="Why do you want to reschedule?" value={rescheduleForm.reason} onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}></textarea>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveView("details")} className="flex-1 border-2 border-[#FE6C5D] text-[#FE6C5D] font-medium py-2.5 rounded-lg hover:bg-red-50 transition-colors">Cancel</button>
              <button onClick={handleRescheduleSubmit} disabled={actionLoading} className="flex-1 bg-[#035F75] text-white font-medium py-2.5 rounded-lg hover:bg-[#024B5E] transition-colors disabled:opacity-70 flex justify-center items-center">
                {actionLoading ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </div>

        ) : (
          /* Chat UI */
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow h-[600px] flex flex-col mt-4">
            <div className="p-4 border-b font-bold text-[#024B5E]">Chat with {booking.owner?.fullName}</div>
            <div className="flex-1 overflow-auto p-4 space-y-2 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded max-w-[80%] ${m.senderId === booking.owner._id ? "bg-gray-200 self-start" : "bg-[#035F75] text-white self-end ml-auto"}`}>
                  {m.content}
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <input className="flex-1 border p-2 rounded" placeholder="Message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
              <button className="bg-[#035F75] text-white px-4 py-2 rounded">Send</button>
              <button type="button" onClick={() => setActiveView("details")} className="text-gray-500 underline">Back</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
