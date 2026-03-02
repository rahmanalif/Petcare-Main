"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function BookingStatusModal({
  open,
  type = "success",
  message = "",
  onClose,
  onPrimary,
}) {
  if (!open) return null;

  const isSuccess = type === "success";
  const title = isSuccess ? "Booking Confirmed" : "Booking Failed";
  const subtitle = message || (isSuccess ? "Your booking has been created." : "Please try again.");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#E7F4F6] p-6 shadow-2xl">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            isSuccess ? "bg-[#E7F4F6] text-[#024B5E]" : "bg-[#FDECEC] text-[#D64545]"
          }`}
        >
          {isSuccess ? "✓" : "!"}
        </div>
        <h3 className="text-center font-semibold text-lg text-[#024B5E] font-montserrat">{title}</h3>
        <p className="mt-2 text-center text-sm text-[#035F75] font-montserrat">{subtitle}</p>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#024B5E] text-[#024B5E] font-montserrat"
          >
            Close
          </Button>
          <Button
            onClick={onPrimary || onClose}
            className="flex-1 bg-[#024B5E] hover:bg-[#024a5c] text-white font-montserrat"
          >
            {isSuccess ? "Done" : "Try Again"}
          </Button>
        </div>
      </div>
    </div>
  );
}
