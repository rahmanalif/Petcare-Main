"use client";
import React, { useState } from "react";
import { ChevronDown, MapPin, Loader2 } from "lucide-react";
import { Map, MapTileLayer, MapMarker, MapZoomControl, MapCircle } from "@/components/ui/map";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/auth";

export default function DogWalkingForm() {
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [baseRate, setBaseRate] = useState("28.00");
  const [updateRates, setUpdateRates] = useState(true);
  const [showAdditionalRates, setShowAdditionalRates] = useState(false);
  const [walksPerDay, setWalksPerDay] = useState("4");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [useHomeAddress, setUseHomeAddress] = useState(true);
  const [location, setLocation] = useState("1000, BD");
  const [distanceType, setDistanceType] = useState("miles");
  const [serviceArea, setServiceArea] = useState("0");
  const [travelModes, setTravelModes] = useState(["Walking"]);
  const [petSizes, setPetSizes] = useState(["Small dog (0-15 lbs)"]);
  const [acceptPuppies, setAcceptPuppies] = useState("yes");
  const [cancellationPolicies, setCancellationPolicies] = useState(["One day"]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = ["6am - 11am", "11am - 3am", "3am - 10am", "None"];
  const travelOptions = ["Walking", "Cycling", "Driving"];
  const petSizeOptions = [
    "Small dog (0-15 lbs)",
    "Medium dog (16-40 lbs)",
    "Large dog (41-100 lbs)",
    "Giant dog (100+ lbs)",
  ];
  const cancellationOptions = ["Same day", "One day", "Two day", "Three day"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const toggleTravelMode = (mode) => {
    setTravelModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const togglePetSize = (size) => {
    setPetSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleCancellationPolicy = (policy) => {
    setCancellationPolicies((prev) =>
        prev.includes(policy) ? prev.filter((p) => p !== policy) : [...prev, policy]
    );
  };

  // --- API INTEGRATION ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        message: "Service settings updated",
        settings: {
          serviceType: "walking",
          rates: {
            base: parseFloat(baseRate) || 0,
            walking60MinRate: 25, // default
            holiday: 32, 
            puppy: 22,
            additionalRate: 15
          },
          availability: {
             isHomeFullTime: false, 
             availableDays: selectedDays,
             timeSlots: selectedTimeSlots,
             maxWalksPerDay: parseInt(walksPerDay) || 1,
             pottyBreakFrequency: "2-4 hours"
          },
          serviceArea: {
            useHomeAddress,
            location,
            radius: parseInt(serviceArea) || 0,
            distanceType,
            travelModes
          },
          petPreferences: {
            allowedSizes: petSizes.map(s => s.split(" ")[0].toLowerCase()),
            puppiesUnderOneYear: acceptPuppies === "yes",
            maxPetsPerDay: 3
          },
          cancellationPolicy: cancellationPolicies,
          homeDetails: {
             homeType: ["Apartment"], 
             yardType: ["No yard"],
             homeAttributes: []
          }
        }
      };

      const response = await fetchWithAuth(`${API_BASE}/api/sitter/services/walking`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Walking settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Update Rates Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={updateRates}
            onChange={(e) => setUpdateRates(e.target.checked)}
            className="custom-checkbox mt-0.5"
          />
          <div>
            <span className="text-[#024B5E] font-medium">
              Update my additional rates based on my base rate
            </span>
            <p className="text-sm text-[#024B5E] mt-1">
              Turn off to adjust your rate manually
            </p>
          </div>
        </label>
      </div>

      {/* Base Rate Section */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">
          Set your base rate
        </label>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-[#024B5E]">Per walk</span>
          <div className="flex items-center">
             <span className="text-[#024B5E] font-semibold mr-1">$</span>
             <input 
               type="number" 
               value={baseRate} 
               onChange={(e) => setBaseRate(e.target.value)}
               className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none"
             />
          </div>
        </div>
        <p className="text-sm text-[#024B5E] mt-2">
          What you will earn per service: ${(parseFloat(baseRate || 0) * 0.86).toFixed(2)}
        </p>
      </div>

      {/* Show Additional Rates Button */}
      <button
        onClick={() => setShowAdditionalRates(!showAdditionalRates)}
        className="w-full px-4 py-3 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024a5c] transition-colors flex items-center justify-center gap-2 mb-8"
      >
        {showAdditionalRates ? "Hide additional rates" : "Show additional rates"}
        <ChevronDown className={`w-5 h-5 transition-transform ${showAdditionalRates ? "rotate-180" : ""}`} />
      </button>

      {/* Additional Rates Section */}
      {showAdditionalRates && (
        <div className="mb-8 space-y-6">
           <div>
            <h4 className="text-base font-semibold text-[#024B5E] mb-3">60 minute rate</h4>
            <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-[#024B5E]">Per day</span>
              <span className="text-[#024B5E] font-semibold">$28.00</span>
            </div>
            <p className="text-sm text-[#024B5E] mt-2">You keep: $24.00</p>
          </div>
          {/* ... other rates ... */}
        </div>
      )}

      {/* Availability Section */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#024B5E] mb-4">Availability</h3>

        <label className="block text-base font-semibold text-[#024B5E] mb-4">
          How many walks can you do per day?
        </label>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white mb-4">
          <span className="text-[#024B5E]">Per day</span>
          <input
            type="number"
            value={walksPerDay}
            onChange={(e) => setWalksPerDay(e.target.value)}
            className="text-[#024B5E] font-semibold bg-transparent border-none outline-none text-right w-16"
            min="1"
          />
        </div>

        {/* Days of Week */}
        <div className="flex gap-2 mb-6">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`flex-1 px-3 py-2 border-2 border-[#9ABFC8] rounded-lg text-sm font-medium transition-colors ${selectedDays.includes(day)
                  ? "bg-[#035F75] text-white border-[#9ABFC8]"
                  : "bg-white text-[#024B5E] border-gray-300 hover:bg-gray-50"
                }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {timeSlots.map((slot) => (
            <label key={slot} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTimeSlots.includes(slot)}
                onChange={() => toggleTimeSlot(slot)}
                className="custom-checkbox"
              />
              <span className="text-[#024B5E]">{slot}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-base font-semibold text-[#024B5E]">Use my home address</label>
          <button onClick={() => setUseHomeAddress(!useHomeAddress)} className={`relative w-12 h-6 rounded-full transition-colors ${useHomeAddress ? "bg-[#035F75]" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${useHomeAddress ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-2">Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#035F75] mb-6" />

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-[#024B5E] mb-2">Location</div>
          <div className="text-sm text-[#024B5E] mb-3">{location || "New York, NY"}</div>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <Map center={[40.7128, -74.0060]} zoom={13}>
              <MapTileLayer />
              <MapZoomControl />
              <MapMarker position={[40.7128, -74.0060]} />
              <MapCircle
                center={[40.7128, -74.0060]}
                radius={parseInt(serviceArea || 0) * 1609.34}
                className="fill-teal-500/20 stroke-teal-600 stroke-2"
              />
            </Map>
          </div>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">Distance type</label>
        <div className="flex gap-4 mb-4">
           <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="distanceType" value="miles" checked={distanceType === "miles"} onChange={(e) => setDistanceType(e.target.value)} className="w-4 h-4 text-[#035F75]" />
            <span className="text-[#024B5E]">Miles</span>
           </label>
           <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="distanceType" value="minutes" checked={distanceType === "minutes"} onChange={(e) => setDistanceType(e.target.value)} className="w-4 h-4 text-[#035F75]" />
            <span className="text-[#024B5E]">Minutes</span>
           </label>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-2">Service area</label>
        <div className="flex items-center gap-2 mb-4">
          <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#035F75]" />
          <span className="text-[#024B5E] capitalize">{distanceType}</span>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">Travel mode</label>
        <div className="space-y-3 mb-8">
          {travelOptions.map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={travelModes.includes(mode)} onChange={() => toggleTravelMode(mode)} className="custom-checkbox" />
              <span className="text-[#024B5E]">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Types Section */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">Pet preferences</label>
        <div className="space-y-3 mb-6">
          {petSizeOptions.map((size) => (
            <label key={size} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={petSizes.includes(size)} onChange={() => togglePetSize(size)} className="custom-checkbox" />
              <span className="text-[#024B5E]">{size}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">Accept puppies?</label>
        <div className="flex gap-4 mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" name="acceptPuppies" value="yes" checked={acceptPuppies === "yes"} onChange={(e) => setAcceptPuppies(e.target.value)} className="w-4 h-4 text-[#035F75]" />
             <span className="text-[#024B5E]">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" name="acceptPuppies" value="no" checked={acceptPuppies === "no"} onChange={(e) => setAcceptPuppies(e.target.value)} className="w-4 h-4 text-[#035F75]" />
             <span className="text-[#024B5E]">No</span>
          </label>
        </div>

        <label className="block text-base font-semibold text-[#024B5E] mb-3">Cancellation policy</label>
        <div className="space-y-3 mb-6">
          {cancellationOptions.map((policy) => (
            <label key={policy} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={cancellationPolicies.includes(policy)} onChange={() => toggleCancellationPolicy(policy)} className="custom-checkbox" />
              <span className="text-[#024B5E]">{policy}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 border-t pt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full px-6 py-4 bg-[#035F75] text-white text-lg font-bold rounded-lg hover:bg-[#024a5c] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Walking Settings"}
        </button>
      </div>
    </>
  );
}
