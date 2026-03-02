"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Loader2, Info, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { updateServiceSettings, fetchServiceSettings } from "@/redux/sitter/sitterSlice";

// ─────────────────────────────────────────
// SHARED SERVICE FORM (Boarding / Daycare / Walking)
// ─────────────────────────────────────────
const SharedServiceForm = forwardRef(({ serviceType }, ref) => {
  const dispatch = useDispatch();
  const { updating } = useSelector((state) => state.sitter);

  // ── Rates ──
  const [isAway, setIsAway] = useState(false);
  const [baseRate, setBaseRate] = useState("28.00");
  const [updateRates, setUpdateRates] = useState(true);
  const [showAdditionalRates, setShowAdditionalRates] = useState(false);
  const [holidayRate, setHolidayRate] = useState("28.00");
  const [puppyRate, setPuppyRate] = useState("28.00");
  const [extendedStayRate, setExtendedStayRate] = useState("28.00");
  const [bathingRate, setBathingRate] = useState("28.00");
  const [bathingFree, setBathingFree] = useState(false);
  const [pickupRate, setPickupRate] = useState("28.00");

  // ── Availability ──
  const [isHomeFullTime, setIsHomeFullTime] = useState("Yes");
  const [selectedDays, setSelectedDays] = useState([]);
  const [pottyBreak, setPottyBreak] = useState("2-4 hours");

  // ── Pet Preferences ──
  const [maxPetsPerDay, setMaxPetsPerDay] = useState(1);
  const [petSizes, setPetSizes] = useState([]);

  // ── Walking specific ──
  const [maxWalksPerDay, setMaxWalksPerDay] = useState(4);
  const [timeSlots, setTimeSlots] = useState([]);

  // ── About Your Home ──
  const [homeTypes, setHomeTypes] = useState([]);
  const [yardTypes, setYardTypes] = useState([]);
  const [homeExpectations, setHomeExpectations] = useState([]);
  const [hostingCapabilities, setHostingCapabilities] = useState([]);

  // ── Cancellation ──
  const [cancellationPolicies, setCancellationPolicies] = useState([]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const pottyBreakOptions = ["0-2 hours", "2-4 hours", "4-8 hours", "8+ hours"];
  const timeSlotsOptions = ["6am - 11am", "11am - 3pm", "3pm - 10pm", "None"];
  const petSizeOptions = [
    { label: "Small dog (0-15 lbs)", value: "small" },
    { label: "Medium dog (16-40 lbs)", value: "medium" },
    { label: "Large dog (41-100 lbs)", value: "large" },
    { label: "Giant dog (100+ lbs)", value: "giant" },  // ← backend এর enum value
  ];
  const homeTypeOptions = ["House", "Apartment", "Farm"];
  const yardTypeOptions = ["Fenced yard", "Unfenced yard", "No yard"];
  const homeExpectationOptions = [
    "Smoking inside home", "Children age 0-5", "Children age 6-12",
    "Dogs are allowed on bed", "Cats in home", "Caged pets in home", "None of the above",
  ];
  const hostingCapabilityOptions = [
    "Pets from different families at the same time", "Puppies under 1 year old",
    "Dogs that are not crate trained", "Unneudtered male dog",
    "Unsprayed female dogs", "Female dogs in heat", "None of the above",
  ];
  const cancellationOptions = ["Same day", "One day", "Two day", "Three day"];

  const toggle = (arr, setArr, val) =>
    setArr((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const isWalking = serviceType === "walking";
  const isDaycare = serviceType === "daycare";
  const isBoarding = serviceType === "boarding";

  const handleSave = async () => {
    try {
      const payload = {
        isAway,
        rates: {
          base: parseFloat(baseRate) || 0,
          holiday: parseFloat(holidayRate) || 0,
          puppy: parseFloat(puppyRate) || 0,
          extendedStay: parseFloat(extendedStayRate) || 0,
          bathing: parseFloat(bathingRate) || 0,
          bathingFree,
          pickup: parseFloat(pickupRate) || 0,
        },
        availability: {
          isHomeFullTime: isHomeFullTime === "Yes",
          availableDays: selectedDays,
          pottyBreakFrequency: pottyBreak,
          ...(isWalking && { maxWalksPerDay }),
          ...(!isWalking && { timeSlots }),
        },
        petPreferences: {
          maxPetsPerDay,
          allowedSizes: petSizes,
        },
        homeDetails: {
          homeTypes,
          yardTypes,
          homeExpectations,
          hostingCapabilities,
        },
        cancellationPolicy: cancellationPolicies,
      };

      await dispatch(updateServiceSettings({ serviceType, serviceData: payload })).unwrap();
      toast.success("Service settings saved successfully!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to save settings");
    }
  };

  useImperativeHandle(ref, () => ({ handleSave }));

  const RateRow = ({ label, value, onChange, showKeep = true }) => (
    <div className="mb-6">
      <h4 className="text-base font-semibold text-[#024B5E] mb-3">{label}</h4>
      <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
        <span className="text-[#024B5E]">{isWalking ? "Per walk" : "Per day"}</span>
        <div className="flex items-center gap-1">
          <span className="text-[#024B5E] font-semibold">$</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none text-right"
          />
        </div>
      </div>
      {showKeep && (
        <p className="text-sm text-[#024B5E] mt-2">
          You keep: ${(parseFloat(value || 0) * 0.86).toFixed(2)}
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Set Yourself as Away */}
      <div className="flex items-center justify-between mb-6 p-4 border border-gray-200 rounded-lg">
        <span className="text-[#024B5E] font-medium">Set Yourself as Away</span>
        <button
          onClick={() => setIsAway(!isAway)}
          className={`relative w-12 h-6 rounded-full transition-colors ${isAway ? "bg-[#035F75]" : "bg-gray-300"}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isAway ? "translate-x-6" : ""}`} />
        </button>
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-3 bg-[#E3E6F0] rounded-lg mb-6">
        <Info className="w-5 h-5 text-[#024B5E] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#024B5E]">
          We have suggested some default settings based on what works well for new sitters and walkers. You can edit now, or at any time in the future.
        </p>
      </div>

      {/* Base Rate */}
      <div className="mb-6">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">Set your base rate</label>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-[#024B5E]">{isWalking ? "Per walk" : "Per day"}</span>
          <div className="flex items-center gap-1">
            <span className="text-[#024B5E] font-semibold">$</span>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none text-right"
            />
          </div>
        </div>
        <p className="text-sm text-[#024B5E] mt-2">
          What you will earn per service: ${(parseFloat(baseRate || 0) * 0.86).toFixed(2)}
        </p>
      </div>

      {/* Update Rates Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={updateRates}
            onChange={(e) => setUpdateRates(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#035F75]"
          />
          <div>
            <span className="text-[#024B5E] font-medium">Update my additional rates based on my base rate</span>
            <p className="text-sm text-[#024B5E] mt-1">Turn off to adjust your rate manually</p>
          </div>
        </label>
      </div>

      {/* Additional Rates */}
      <RateRow label="Holiday Rate" value={holidayRate} onChange={setHolidayRate} />
      <RateRow label="Puppy Rate" value={puppyRate} onChange={setPuppyRate} />
      {(isBoarding || isDaycare) && (
        <RateRow label="Extended Stay Rate" value={extendedStayRate} onChange={setExtendedStayRate} />
      )}

      {/* Bathing / Grooming */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-[#024B5E] mb-3">Bathing / Grooming</h4>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-[#024B5E]">{isWalking ? "Per walk" : "Per day"}</span>
          <div className="flex items-center gap-1">
            <span className="text-[#024B5E] font-semibold">$</span>
            <input type="number" value={bathingRate} onChange={(e) => setBathingRate(e.target.value)} className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none text-right" />
          </div>
        </div>
        <p className="text-sm text-[#024B5E] mt-2">You keep: ${(parseFloat(bathingRate || 0) * 0.86).toFixed(2)}</p>
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input type="checkbox" checked={bathingFree} onChange={(e) => setBathingFree(e.target.checked)} className="w-4 h-4 accent-[#035F75]" />
          <span className="text-[#024B5E] text-sm">Offer for free</span>
        </label>
      </div>

      {/* Daily Sitter Pick-Up/Drop-Off */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-[#024B5E] mb-3">Daily Sitter Pick-Up/Drop-Off</h4>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-[#024B5E]">{isWalking ? "Per walk" : "Per day"}</span>
          <div className="flex items-center gap-1">
            <span className="text-[#024B5E] font-semibold">$</span>
            <input type="number" value={pickupRate} onChange={(e) => setPickupRate(e.target.value)} className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none text-right" />
          </div>
        </div>
        <p className="text-sm text-[#024B5E] mt-2">You keep: 80%</p>
      </div>

      {/* Show/Hide Additional Rates Button */}
      <button
        onClick={() => setShowAdditionalRates(!showAdditionalRates)}
        className="w-full px-4 py-3 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024a5c] transition-colors flex items-center justify-center gap-2 mb-8"
      >
        {showAdditionalRates ? "Hide additional rates" : "Show additional rates"}
        <ChevronDown className={`w-5 h-5 transition-transform ${showAdditionalRates ? "rotate-180" : ""}`} />
      </button>

      {/* ── AVAILABILITY ── */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#024B5E] mb-4">Availability</h3>

        {/* Walking: walks per day */}
        {isWalking ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#024B5E] mb-3">How many walks can you do per day?</label>
            <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white">
              <span className="text-[#024B5E]">Per day</span>
              <input type="number" value={maxWalksPerDay} onChange={(e) => setMaxWalksPerDay(parseInt(e.target.value) || 1)} min="1" className="text-[#024B5E] font-semibold bg-transparent border-none outline-none text-right w-16" />
            </div>
          </div>
        ) : (
          <>
            <label className="block text-sm font-medium text-[#024B5E] mb-3">Are you home full-time during the week?</label>
            <div className="flex gap-4 mb-4">
              {["Yes", "No"].map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={`homeFullTime_${serviceType}`} value={val} checked={isHomeFullTime === val} onChange={() => setIsHomeFullTime(val)} className="w-4 h-4 accent-[#035F75]" />
                  <span className="text-[#024B5E]">{val}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-[#024B5E] mb-4">You can edit any date individually by going to your calendar.</p>
          </>
        )}

        {/* Days */}
        <div className="flex gap-1 sm:gap-2 mb-6">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggle(selectedDays, setSelectedDays, day)}
              className={`flex-1 py-2 border rounded-lg text-xs sm:text-sm font-medium transition-colors ${selectedDays.includes(day) ? "bg-[#035F75] text-white border-[#035F75]" : "bg-white text-[#024B5E] border-gray-300 hover:bg-gray-50"}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Walking: time slots */}
        {isWalking && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {timeSlotsOptions.map((slot) => (
              <label key={slot} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={timeSlots.includes(slot)} onChange={() => toggle(timeSlots, setTimeSlots, slot)} className="w-4 h-4 accent-[#035F75]" />
                <span className="text-[#024B5E] text-sm">{slot}</span>
              </label>
            ))}
          </div>
        )}

        {/* Potty break (boarding/daycare) */}
        {!isWalking && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#024B5E] mb-3">How frequently can you provide potty breaks?</label>
            <div className="grid grid-cols-2 gap-3">
              {pottyBreakOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={`potty_${serviceType}`} value={opt} checked={pottyBreak === opt} onChange={() => setPottyBreak(opt)} className="w-4 h-4 accent-[#035F75]" />
                  <span className="text-[#024B5E] text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PET PREFERENCES ── */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#024B5E] mb-4">Pet preferences</h3>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">
          How many pets per day can you host in your home?
        </label>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setMaxPetsPerDay((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            <Minus className="w-4 h-4 text-[#024B5E]" />
          </button>
          <span className="text-[#024B5E] font-semibold w-6 text-center">{maxPetsPerDay}</span>
          <button onClick={() => setMaxPetsPerDay((p) => p + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
            <Plus className="w-4 h-4 text-[#024B5E]" />
          </button>
        </div>

  <label className="block text-sm font-medium text-[#024B5E] mb-3">What type of pets can you host in your home?</label>
  <div className="space-y-3 mb-6">
    {petSizeOptions.map(({ label, value }) => (
      <label key={value} className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={petSizes.includes(value)} onChange={() => toggle(petSizes, setPetSizes, value)} className="w-4 h-4 accent-[#035F75]" />
        <span className="text-[#024B5E] text-sm">{label}</span>
      </label>
    ))}
  </div>
      </div>

      {/* ── ABOUT YOUR HOME ── */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#024B5E] mb-4">About your home</h3>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">What type of home do you live in?</label>
        <div className="space-y-3 mb-6">
          {homeTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={homeTypes.includes(type)} onChange={() => toggle(homeTypes, setHomeTypes, type)} className="w-4 h-4 accent-[#035F75]" />
              <span className="text-[#024B5E] text-sm">{type}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">What type of yard do you have?</label>
        <div className="space-y-3 mb-6">
          {yardTypeOptions.map((yard) => (
            <label key={yard} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={yardTypes.includes(yard)} onChange={() => toggle(yardTypes, setYardTypes, yard)} className="w-4 h-4 accent-[#035F75]" />
              <span className="text-[#024B5E] text-sm">{yard}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">What can pet owners expect when boarding at your home?</label>
        <div className="space-y-3 mb-6">
          {homeExpectationOptions.map((exp) => (
            <label key={exp} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={homeExpectations.includes(exp)} onChange={() => toggle(homeExpectations, setHomeExpectations, exp)} className="w-4 h-4 accent-[#035F75]" />
              <span className="text-[#024B5E] text-sm">{exp}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">Are you able to host any of the following?</label>
        <div className="space-y-3 mb-6">
          {hostingCapabilityOptions.map((cap) => (
            <label key={cap} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={hostingCapabilities.includes(cap)} onChange={() => toggle(hostingCapabilities, setHostingCapabilities, cap)} className="w-4 h-4 accent-[#035F75]" />
              <span className="text-[#024B5E] text-sm">{cap}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── CANCELLATION POLICY ── */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">
          What is your cancellation policy for{" "}
          {isBoarding ? "Boarding?" : isDaycare ? "Doggy Day Care?" : "Dog Walking?"}
        </label>
        <div className="space-y-3">
          {cancellationOptions.map((policy) => (
            <label key={policy} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={cancellationPolicies.includes(policy)} onChange={() => toggle(cancellationPolicies, setCancellationPolicies, policy)} className="w-4 h-4 accent-[#035F75]" />
              <span className="text-[#024B5E] text-sm">{policy}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});
SharedServiceForm.displayName = "SharedServiceForm";

// ─────────────────────────────────────────
// MAIN WRAPPER
// ─────────────────────────────────────────
export default function ServiceSetupForm() {
  const [serviceType, setServiceType] = useState("boarding");
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const { updating } = useSelector((state) => state.sitter);

  const handleCreateService = () => {
    if (formRef.current) formRef.current.handleSave();
  };

  const serviceOptions = [
    { value: "boarding", label: "Boarding" },
    { value: "daycare", label: "Doggy Day Care" },
    { value: "walking", label: "Dog Walking" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 w-full max-w-2xl">

        {/* Service Type Selector */}
        <div className="mb-8">
          <label className="block text-base font-semibold text-[#024B5E] mb-3">Service name</label>
          <div className="relative">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-[#024B5E] focus:outline-none focus:ring-2 focus:ring-[#035F75]"
            >
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#024B5E] pointer-events-none" />
          </div>
        </div>

        {/* ✅ Key prop দিয়ে service change হলে form reset হবে */}
        <SharedServiceForm key={serviceType} ref={formRef} serviceType={serviceType} />

        {/* Create Service Button */}
        <button
          onClick={handleCreateService}
          disabled={updating}
          className="w-full px-6 py-4 bg-[#035F75] text-white rounded-lg font-semibold text-lg hover:bg-[#024a5c] transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {updating && <Loader2 className="w-5 h-5 animate-spin" />}
          {updating ? "Saving..." : "Create Service"}
        </button>
      </div>
    </div>
  );
}