"use client";
import React, { useState } from "react";

export default function SwitchProfile() {
  const [isProvider, setIsProvider] = useState(false);
  const referralLink = "Wuffoos.com/ambas-refer-a-friend";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Switch profile
      </h2>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <span className="text-sm sm:text-base font-medium text-[#024B5E]">
          Switch as a Sitter
        </span>
        <button
          onClick={() => setIsProvider(!isProvider)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isProvider ? "bg-[#024B5E]" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isProvider ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Invite Friends Section - Shows when toggle is ON */}
      
    </div>
  );
}