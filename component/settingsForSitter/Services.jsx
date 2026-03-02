"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchServiceSettings, updateServiceSettings } from "@/redux/sitter/sitterSlice";

// ✅ service name → API serviceType mapping
const SERVICE_TYPES = [
  {
    id: "boarding",
    name: "Boarding",
    location: "In the sitter's home",
    priceUnit: "Per day",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 3V21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "doggyDayCare",
    name: "Doggy Day Care",
    location: "In the sitter's home",
    priceUnit: "Per visit",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dogWalking",
    name: "Dog Walking",
    location: "In your neighbourhood",
    priceUnit: "Per walk",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 16C14 17.77 13.23 19 12 19C10.77 19 10 17.77 10 16C10 14.23 10.77 13 12 13C13.23 13 14 14.23 14 16Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9C7 10.1 6.55 11 6 11C5.45 11 5 10.1 5 9C5 7.9 5.45 7 6 7C6.55 7 7 7.9 7 9Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 9C19 10.1 18.55 11 18 11C17.45 11 17 10.1 17 9C17 7.9 17.45 7 18 7C18.55 7 19 7.9 19 9Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 13V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Services() {
  const dispatch = useDispatch();
  const { services, servicesLoading, updating } = useSelector((state) => state.sitter);

  const [expandedService, setExpandedService] = useState(null);
  // ✅ প্রতিটা service এর edit form data আলাদা রাখা
  const [editForms, setEditForms] = useState({});

  // ✅ সব service এর data fetch করো
  useEffect(() => {
    SERVICE_TYPES.forEach((s) => {
      if (!services[s.id]) {
        dispatch(fetchServiceSettings(s.id));
      }
    });
  }, [dispatch]);

  const handleServiceClick = (serviceId) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceId);
      // Edit form populate করো Redux data থেকে
     // ✅ 2. form populate fix — handleServiceClick এ
const serviceData = services[serviceId];
if (serviceData) {
  setEditForms((prev) => ({
    ...prev,
    [serviceId]: {
      price: serviceData?.rates?.base || "",
      duration: serviceData?.duration || "",
      maxPets: serviceData?.petPreferences?.maxPetsPerDay || "",
      description: serviceData?.description || "",
      isActive: serviceData?.isActive ?? true,
    },
  }));
}
    }
  };

  const handleFormChange = (serviceId, field, value) => {
    setEditForms((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [field]: value },
    }));
  };

  const handleSave = async (serviceId) => {
    try {
      await dispatch(updateServiceSettings({
        serviceType: serviceId,
        serviceData: editForms[serviceId],
      })).unwrap();
      toast.success("Service updated successfully");
      setExpandedService(null);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update service");
    }
  };

const getServicePrice = (serviceId) => {
  const data = services[serviceId];
  const price = data?.rates?.base;
  if (!price && price !== 0) return "—";
  return `$${price}`;
};

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 max-w-3xl">
      <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
        <h2 className="text-lg md:text-2xl font-medium text-gray-800">Services</h2>
      </div>

      {servicesLoading && Object.keys(services).length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8 text-[#035F75]" />
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {SERVICE_TYPES.map((service) => {
            const isExpanded = expandedService === service.id;
            const serviceData = services[service.id];
            const form = editForms[service.id] || {};

            return (
              <div key={service.id} className={`rounded-lg border-2 transition-all ${isExpanded ? "border-[#035F75]" : "border-gray-200 hover:border-gray-300"}`}>

                {/* ✅ Service Row — click করলে expand */}
                <div
                  onClick={() => handleServiceClick(service.id)}
                  className={`flex items-center justify-between p-3 md:p-5 cursor-pointer ${isExpanded ? "bg-[#E7F4F6]" : "bg-white"} rounded-lg`}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className={isExpanded ? "text-[#035F75]" : "text-gray-500"}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-medium text-gray-900">{service.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-0.5">{service.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm md:text-base font-semibold text-gray-900">{getServicePrice(service.id)}</div>
                      <div className="text-xs md:text-sm text-gray-600 mt-0.5">{service.priceUnit}</div>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-[#035F75]" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* ✅ Expanded Edit Form */}
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-[#035F75]/20 bg-[#E7F4F6] rounded-b-lg">
                    <div className="pt-4 space-y-3">

                      {/* Active Toggle */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-[#024B5E]">Service Active</Label>
                        <button
                          onClick={() => handleFormChange(service.id, "isActive", !form.isActive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? "bg-[#035F75]" : "bg-gray-300"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>

                      {/* Price */}
                      <div>
                        <Label className="text-sm font-medium text-[#024B5E]">Price ($)</Label>
                        <Input
                          type="number"
                          value={form.price || ""}
                          onChange={(e) => handleFormChange(service.id, "price", e.target.value)}
                          placeholder="e.g. 99"
                          className="mt-1 bg-white text-[#024B5E]"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <Label className="text-sm font-medium text-[#024B5E]">Duration</Label>
                        <Input
                          value={form.duration || ""}
                          onChange={(e) => handleFormChange(service.id, "duration", e.target.value)}
                          placeholder="e.g. 1 hour"
                          className="mt-1 bg-white text-[#024B5E]"
                        />
                      </div>

                      {/* Max Pets */}
                      <div>
                        <Label className="text-sm font-medium text-[#024B5E]">Max Pets</Label>
                        <Input
                          type="number"
                          value={form.maxPets || ""}
                          onChange={(e) => handleFormChange(service.id, "maxPets", e.target.value)}
                          placeholder="e.g. 3"
                          className="mt-1 bg-white text-[#024B5E]"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label className="text-sm font-medium text-[#024B5E]">Description</Label>
                        <textarea
                          value={form.description || ""}
                          onChange={(e) => handleFormChange(service.id, "description", e.target.value)}
                          rows={3}
                          placeholder="Describe this service..."
                          className="mt-1 flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-[#024B5E] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => setExpandedService(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(service.id)}
                          disabled={updating}
                          className="flex-1 px-4 py-2 bg-[#035F75] text-white rounded-lg text-sm font-medium hover:bg-[#024c5d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}