"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { clearAuthStorage } from "@/lib/auth";
import { fetchSitterProfile } from "@/redux/sitter/sitterSlice";
import AccountDetail from "@/component/settingsForSitter/AccountDetail";
import BookingHistory from "@/component/settingsForSitter/ChangePassword";
import Payments from "@/component/settingsForSitter/Payments";
import SwitchProfile from "@/component/settingsForSitter/SwitchProfile";
import ApplyPromo from "@/component/settingsForSitter/ApplyPromo";
import InviteFriend from "@/component/settingsForSitter/InviteFriend";
import Services from "@/component/settingsForSitter/Services";
import Portfolio from "@/component/settingsForSitter/portfolio";

const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AccountSettings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("account");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { profile: sitterData, loading } = useSelector((state) => state.sitter);
  const earnings = sitterData?.earnings;

  useEffect(() => {
    if (!sitterData) {
      dispatch(fetchSitterProfile());
    }
  }, [dispatch, sitterData]);

  const handleLogout = () => {
    clearAuthStorage();
    dispatch(logout());
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await fetch(`${SERVER_URL}/api/users/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        clearAuthStorage();
        dispatch(logout());
        router.push('/');
      } else {
        alert(result.message || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNavigateToOngoing = () => {
    router.push('/settingForSitter/ongoing');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Earnings Summary */}
        <div className="border border-gray-300 rounded-lg m-1 md:m-2 p-4 md:p-6 bg-white shadow-sm">
          <div className="mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-[#024B5E] font-montserrat mb-1">
              Earnings Summary
            </h2>
          </div>

          <div className="flex items-end justify-between mb-4 md:mb-6">
            <div>
              <p className="text-xs md:text-sm text-[#024B5E] mb-1">Total Income</p>
              <p className="text-xl md:text-2xl font-bold text-[#024B5E] font-montserrat">
                {loading && !sitterData
                  ? "..."
                  : `$${earnings?.totalIncome?.toFixed(2) ?? "0.00"}`}
              </p>
            </div>
            <button onClick={() => setActiveTab("promo")} className="text-[#035F75] text-xs md:text-sm font-medium underline">
              Apply Promo Code
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6">
            <div onClick={handleNavigateToOngoing} className="cursor-pointer hover:bg-gray-50 p-2 md:p-3 rounded-lg transition-colors">
              <p className="text-xs md:text-sm text-[#024B5E] mb-1">This Month</p>
              <p className="text-sm md:text-lg font-bold text-[#024B5E] font-montserrat">
                {loading && !sitterData ? "..." : `$${earnings?.thisMonth?.toFixed(2) ?? "0.00"}`}
              </p>
            </div>
            <div onClick={handleNavigateToOngoing} className="cursor-pointer hover:bg-gray-50 p-2 md:p-3 rounded-lg transition-colors">
              <p className="text-xs md:text-sm text-[#024B5E] mb-1 flex items-center justify-center">Last Month</p>
              <p className="text-sm md:text-lg font-bold text-[#024B5E] font-montserrat flex items-center justify-center">
                {loading && !sitterData ? "..." : `$${earnings?.lastMonth?.toFixed(2) ?? "0.00"}`}
              </p>
            </div>
            <div onClick={handleNavigateToOngoing} className="cursor-pointer hover:bg-gray-50 p-2 md:p-3 rounded-lg transition-colors">
              <p className="text-xs md:text-sm text-[#024B5E] mb-1 text-right">Pending</p>
              <p className="text-sm md:text-lg font-bold text-[#024B5E] font-montserrat text-right">
                {loading && !sitterData ? "..." : `$${earnings?.pending?.toFixed(2) ?? "0.00"}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 boarder-2 rounded-2xl bg-[#FFF] p-3 md:p-4 shadow-md">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-2 md:mt-4">
              <div className="px-3 md:px-4 py-3 text-[#024B5E] text-lg md:text-xl font-bakso">
                Account Information
              </div>
              {[
                { key: "account", label: "Account" },
                { key: "booking", label: "Change password" },
                { key: "payments", label: "Payments" },
                { key: "services", label: "Services" },
                { key: "portfolio", label: "Portfolio" },
                { key: "switch", label: "Switch profile" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-3 md:px-4 py-2 md:py-3 border-l-4 text-sm md:text-base ${
                    activeTab === item.key
                      ? "border-[#035F75] bg-[#E7F4F6] text-[#035F75] font-medium"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2 md:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 md:px-4 py-3 text-[#024B5E] text-lg md:text-xl font-bakso">
                  Policy Center
                </div>
                <Link href="/privacy" className="block w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#024B5E] hover:bg-gray-100">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#024B5E] hover:bg-gray-100">
                  Terms & Condition
                </Link>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 md:px-4 py-3 text-[#024B5E] text-lg md:text-xl font-bakso">
                  Referrals and promos
                </div>
                <button onClick={() => setActiveTab("friend")} className="w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#024B5E] hover:bg-gray-100">
                  Invite a friend to Wuffoos
                </button>
                <button onClick={() => setActiveTab("promo")} className="w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#024B5E] hover:bg-gray-100">
                  Apply promo codes
                </button>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 md:px-4 py-3 text-[#024B5E] text-lg md:text-xl font-bakso">
                  Account Actions
                </div>
                <div onClick={handleLogout} className="w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#024B5E] hover:bg-gray-100 cursor-pointer">
                  Logout
                </div>
                <div
                  onClick={!deleteLoading ? handleDeleteAccount : undefined}
                  className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base text-[#FE6C5D] hover:bg-gray-100 cursor-pointer ${deleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {deleteLoading ? "Deleting..." : "Delete account"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            {activeTab === "account" && <AccountDetail />}
            {activeTab === "booking" && <BookingHistory />}
            {activeTab === "payments" && <Payments />}
            {activeTab === "services" && <Services />}
            {activeTab === "portfolio" && <Portfolio />}
            {activeTab === "switch" && <SwitchProfile />}
            {activeTab === "promo" && <ApplyPromo />}
            {activeTab === "friend" && <InviteFriend />}
          </div>
        </div>
      </div>
    </div>
  );
}