"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeSitterPassword } from "@/redux/sitter/sitterSlice"; 
import { toast } from "sonner"; 

export default function AccountDetail() {
  const dispatch = useDispatch();
  

  const { updating } = useSelector((state) => state.sitter);

  // Toggle Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    // 1. Basic Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // 2. Prepare Payload (Backend usually expects current & new password)
    const payload = {
      currentPassword: currentPassword, // Ensure this key matches your Backend API expectation
      newPassword: newPassword,
    };

    // 3. Dispatch Action
    try {
      const result = await dispatch(changeSitterPassword(payload)).unwrap();
      
      // Success
      toast.success(result.message || "Password changed successfully!");
      
      // Reset Form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Error
      toast.error(error || "Failed to change password");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 md:mb-8 pb-2 border-b-2 border-grey-600">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Change Password
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {/* Current Password */}
        <div>
          <Label
            htmlFor="currentPassword"
            className="text-xs md:text-sm font-medium text-gray-700"
          >
            Current Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <Label
            htmlFor="newPassword"
            className="text-xs md:text-sm font-medium text-gray-700"
          >
            New Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-xs md:text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={updating}
            className="w-full md:w-auto"
          >
            {updating ? "Updating..." : "Save Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}