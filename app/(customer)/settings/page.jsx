"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { fetchPets } from "@/redux/petSlice"; // Import action
import { clearAuthStorage } from "@/lib/auth";

import AccountDetail from "@/component/settings/AccountDetail";
import BookingHistory from "@/component/settings/BookingHistory";
import Payments from "@/component/settings/Payments";
import SwitchProfile from "@/component/settings/SwitchProfile";
import ApplyPromo from "@/component/settings/ApplyPromo";
import InviteFriend from "@/component/settings/InviteFriend";
import { Loader2 } from "lucide-react";

export default function AccountSettings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("account");

  // Redux state
  const { list: pets, loading } = useSelector((state) => state.pets);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch pets if list is empty
  useEffect(() => {
    if (pets.length === 0) {
      dispatch(fetchPets());
    }
  }, [dispatch, pets.length]);

  const handleLogout = () => {
    clearAuthStorage();
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F4EF] p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Dynamic Pet Profiles Section */}
        <div className="flex flex-wrap gap-3 mb-4 sm:mb-6">
          {loading && pets.length === 0 ? (
            <div className="flex items-center p-4"><Loader2 className="animate-spin text-[#024B5E]" /></div>
          ) : (
            Array.isArray(pets) && pets.map((pet) => (
              <button
                key={pet._id}
                onClick={() => router.push(`/settings/pet-Information/${pet._id}`)}
                className="bg-[#E7F4F6] rounded-lg p-3 border-2 border-[#0993b6] flex items-center gap-3 min-w-[180px]"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white">
                  <img
                    src={pet.gallery && pet.gallery.length > 0
                      ? `${API_BASE}/${pet.gallery[pet.gallery.length - 1]}`
                      : "/Ellipse.png"}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-left text-[#024B5E] text-sm truncate">{pet.name}</div>
                  <div className="text-xs text-[#024B5E] truncate text-left">{pet.breed}</div>
                </div>
              </button>
            ))
          )}

          {/* Add another Pet Button */}
          <button
            onClick={() => router.push('/settings/pet-form')}
            className="text-[#024B5E] border-2 border-dashed border-[#024B5E] rounded-lg px-6 py-3 text-xs font-medium hover:bg-[#E7F4F6] transition-colors flex items-center justify-center gap-2 h-[68px]">
            <span className="text-lg font-bold">+</span>
            <span>Add another Pet</span>
          </button>
        </div>

        {/* Rest of the component remains EXACTLY same */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 rounded-2xl bg-[#FFF] p-3 sm:p-4 shadow-md">
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-0 lg:mt-4">
              <div className="px-3 sm:px-4 py-3 text-[#024B5E] text-xl sm:text-lg font-bakso">
                Account Information
              </div>
              {/* Tab Buttons */}
              {['account', 'booking', 'payments', 'switch'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-l-4 ${activeTab === tab
                    ? "border-[#024B5E] bg-[#E7F4F6] text-[#024B5E] font-medium"
                    : "border-transparent hover:bg-gray-50 capitalize"
                    }`}
                >
                  {tab === 'switch' ? 'Switch profile' : tab.charAt(0).toUpperCase() + tab.slice(1) + (tab === 'booking' ? ' History' : '')}
                </button>
              ))}
            </div>

            {/* Other Sidebar Sections (Same as original) */}
            <div className="pt-2 sm:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 sm:px-4 py-3 text-[#024B5E] text-lg sm:text-xl font-bakso">Policy Center</div>
                <Link href="/privacy" className="block w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#024B5E] hover:bg-gray-100">Privacy Policy</Link>
                <Link href="/terms" className="block w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#024B5E] hover:bg-gray-100">Terms & Condition</Link>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 sm:px-4 py-3 text-[#024B5E] text-lg sm:text-xl font-bakso">Referrals and promos</div>
                <button onClick={() => setActiveTab("friend")} className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#024B5E] hover:bg-gray-100">Invite a friend to Wuffoos</button>
                <button onClick={() => setActiveTab("promo")} className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#024B5E] hover:bg-gray-100">Apply promo codes</button>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 sm:px-4 py-3 text-[#024B5E] text-lg sm:text-xl font-bakso">Account Actions</div>
                <div onClick={handleLogout} className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#024B5E] hover:bg-gray-100 cursor-pointer">Logout</div>
                <div className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-[#FE6C5D] hover:bg-gray-100 cursor-pointer">Delete account</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 mt-4 lg:mt-0">
            {activeTab === "account" && <AccountDetail />}
            {activeTab === "booking" && <BookingHistory />}
            {activeTab === "payments" && <Payments />}
            {activeTab === "switch" && <SwitchProfile />}
            {activeTab === "promo" && <ApplyPromo />}
            {activeTab === "friend" && <InviteFriend />}
          </div>
        </div>
      </div>
    </div>
  );
}
