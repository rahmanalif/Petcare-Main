"use client";
import React, { forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setField,
  toggleArrayField,
  saveBoardingService,
} from "@/redux/serviceSlice";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BoardingForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const service = useSelector((state) => state.service);

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

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      try {
        const resultAction = await dispatch(saveBoardingService());
        if (saveBoardingService.fulfilled.match(resultAction)) {
          toast.success("Boarding service saved!");
        } else {
          toast.error("Save failed");
        }
      } catch {
        toast.error("Server error");
      }
    },
  }));

  return (
    <>
      {service.loading && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#024B5E] w-10 h-10" />
        </div>
      )}

      {/* Update Rates Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={service.updateRates}
            onChange={(e) =>
              dispatch(setField({ field: "updateRates", value: e.target.checked }))
            }
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

      {/* Base Rate */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">
          Set your base rate
        </label>
        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-[#024B5E]">Per night</span>
          <div className="flex items-center">
            <span className="text-[#024B5E] font-semibold mr-1">$</span>
            <input
              type="number"
              value={service.baseRate}
              onChange={(e) =>
                dispatch(setField({ field: "baseRate", value: e.target.value }))
              }
              className="w-20 bg-transparent text-[#024B5E] font-semibold focus:outline-none"
            />
          </div>
        </div>
        <p className="text-sm text-[#024B5E] mt-2">
          What you will earn per service: $
          {(parseFloat(service.baseRate || 0) * 0.86).toFixed(2)}
        </p>
      </div>

      {/* Additional Rates Toggle */}
      <button
        onClick={() =>
          dispatch(setField({ field: "showAdditionalRates", value: !service.showAdditionalRates }))
        }
        className="w-full px-4 py-3 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024a5c] transition-colors flex items-center justify-center gap-2 mb-8"
      >
        {service.showAdditionalRates ? "Hide additional rates" : "Show additional rates"}
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            service.showAdditionalRates ? "rotate-180" : ""
          }`}
        />
      </button>

      {service.showAdditionalRates && (
        <div className="mb-8 space-y-6">
          <div>
            <h4 className="text-base font-semibold text-[#024B5E] mb-3">60 minute rate</h4>
            <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-[#024B5E]">Per night</span>
              <span className="text-[#024B5E] font-semibold">$45.00</span>
            </div>
            <p className="text-sm text-[#024B5E] mt-2">You keep: $38.70</p>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#024B5E] mb-4">Availability</h3>

        <label className="block text-sm font-medium text-[#024B5E] mb-3">
          Are you home full-time during the week?
        </label>
        <div className="flex gap-4 mb-4">
          {["Yes", "No"].map((val) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="timeType"
                value={val}
                checked={service.timeType === val}
                onChange={(e) =>
                  dispatch(setField({ field: "timeType", value: e.target.value }))
                }
                className="w-4 h-4 text-[#035F75] focus:ring-[#035F75]"
              />
              <span className="text-[#024B5E]">{val}</span>
            </label>
          ))}
        </div>

        {/* Days */}
        <div className="flex gap-2 mb-6">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => dispatch(toggleArrayField({ field: "selectedDays", value: day }))}
              className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                service.selectedDays.includes(day)
                  ? "bg-[#035F75] text-white border-[#035F75]"
                  : "bg-white text-[#024B5E] border-gray-300 hover:bg-gray-50"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <label className="block text-sm font-medium text-[#024B5E] mb-3">
          What times are you available for boarding check-in/check-out?
        </label>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {timeSlots.map((slot) => (
            <label key={slot} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={service.selectedTimeSlots.includes(slot)}
                onChange={() =>
                  dispatch(toggleArrayField({ field: "selectedTimeSlots", value: slot }))
                }
                className="custom-checkbox"
              />
              <span className="text-[#024B5E]">{slot}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">
          What is your cancellation policy for boarding?
        </label>
        <div className="space-y-3">
          {cancellationOptions.map((policy) => (
            <label key={policy} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={service.cancellationPolicies.includes(policy)}
                onChange={() =>
                  dispatch(toggleArrayField({ field: "cancellationPolicies", value: policy }))
                }
                className="custom-checkbox"
              />
              <span className="text-[#024B5E]">{policy}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-base font-semibold text-[#024B5E]">Use my home address</label>
          <button
            onClick={() =>
              dispatch(setField({ field: "useHomeAddress", value: !service.useHomeAddress }))
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              service.useHomeAddress ? "bg-[#035F75]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                service.useHomeAddress ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-2">Location</label>
        <input
          type="text"
          value={service.location}
          onChange={(e) => dispatch(setField({ field: "location", value: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#035F75] focus:border-transparent mb-6"
        />

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">Distance type</label>
        <div className="flex gap-4 mb-4">
          {["Miles", "Minutes"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="distanceTypeBoarding"
                value={type}
                checked={service.distanceType === type}
                onChange={(e) =>
                  dispatch(setField({ field: "distanceType", value: e.target.value }))
                }
                className="w-4 h-4 text-[#035F75] focus:ring-[#035F75]"
              />
              <span className="text-[#024B5E]">{type}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-2">Service area (Radius)</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={service.serviceArea}
            onChange={(e) =>
              dispatch(setField({ field: "serviceArea", value: e.target.value }))
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#035F75] focus:border-transparent"
          />
          <span className="text-[#024B5E]">{service.distanceType}</span>
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">Travel mode</label>
        <div className="space-y-3 mb-8">
          {travelOptions.map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={service.travelModes.includes(mode)}
                onChange={() => dispatch(toggleArrayField({ field: "travelModes", value: mode }))}
                className="custom-checkbox"
              />
              <span className="text-[#024B5E]">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Types */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-[#024B5E] mb-3">
          What type of pets can you host?
        </label>
        <div className="space-y-3 mb-6">
          {petSizeOptions.map((size) => (
            <label key={size} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={service.petSizes.includes(size)}
                onChange={() => dispatch(toggleArrayField({ field: "petSizes", value: size }))}
                className="custom-checkbox"
              />
              <span className="text-[#024B5E]">{size}</span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-semibold text-[#024B5E] mb-3">
          Do you accept puppies under 1 year old?
        </label>
        <div className="flex gap-4 mb-8">
          {["yes", "no"].map((val) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="acceptPuppiesBoarding"
                value={val}
                checked={service.acceptPuppies === val}
                onChange={(e) =>
                  dispatch(setField({ field: "acceptPuppies", value: e.target.value }))
                }
                className="w-4 h-4 text-[#035F75] focus:ring-[#035F75]"
              />
              <span className="text-[#024B5E]">{val === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

BoardingForm.displayName = "BoardingForm";
export default BoardingForm;
