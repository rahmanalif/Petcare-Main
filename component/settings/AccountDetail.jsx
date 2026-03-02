"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { fetchProfile, updateProfileImage, updateProfileInfo, changePassword } from "@/redux/userSlice";

export default function AccountDetail() {
  const dispatch = useDispatch();
  

  const { data: user, loading, updating } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    street: "",
    state: "",
    zipCode: "",
    dob: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      let profilePic = user.profilePicture || "";
      if (profilePic && !profilePic.startsWith("http")) {
        profilePic = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profilePic.replace(/\\/g, '/')}`;
      }

      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        street: user.street || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        dob: formatDateForInput(user.dob) || "",
        profilePicture: profilePic,
      }));
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // unwrap() ব্যবহার করা হয়েছে যাতে error catch করা যায়
      await dispatch(updateProfileImage(file)).unwrap();
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error || "Upload failed");
    }
  };

  // সেভ হ্যান্ডলার
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // পাসওয়ার্ড ভ্যালিডেশন
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        toast.error("Please enter your current password");
        return;
      }
      if (!formData.newPassword) {
        toast.error("Please enter a new password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
    }

    try {
      // ১. প্রোফাইল ইনফো আপডেট
      await dispatch(updateProfileInfo({
        fullName: formData.fullName,
        street: formData.street,
        state: formData.state,
        zipCode: formData.zipCode,
        dob: formData.dob,
      })).unwrap();

      // ২. পাসওয়ার্ড পরিবর্তন (যদি থাকে)
      if (formData.newPassword && formData.currentPassword) {
        await dispatch(changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })).unwrap();
        
        toast.success("Password changed successfully");
        // পাসওয়ার্ড ফিল্ড ক্লিয়ার করা
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);

    } catch (error) {
      console.error(error);
      toast.error(typeof error === 'string' ? error : "An error occurred while updating");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ইনিশিয়াল লোডিং
  if (loading && !user) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#024B5E]" /></div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-[#024B5E]">Account</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={handleSave}
          disabled={updating} // Redux updating state
        >
          {updating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      {/* Avatar Section */}
      <div className="flex justify-center sm:justify-start mb-6 sm:mb-8">
        <div
          className="relative cursor-pointer group w-20 h-20 sm:w-24 sm:h-24"
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <div className="w-full h-full bg-teal-500 rounded-full flex items-center justify-center overflow-hidden">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              // SVG Placeholder (Same as before)
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="140" rx="70" fill="#EBFBFE" />
                <path fillRule="evenodd" clipRule="evenodd" d="M47.5002 50C47.5002 37.5736 57.5738 27.5 70.0002 27.5C82.4266 27.5 92.5002 37.5736 92.5002 50C92.5002 62.4264 82.4266 72.5 70.0002 72.5C57.5738 72.5 47.5002 62.4264 47.5002 50Z" fill="#0B87AC" />
                <path fillRule="evenodd" clipRule="evenodd" d="M28.7564 120.527C29.1431 98.0779 47.4601 80 70.0002 80C92.5408 80 110.858 98.0787 111.244 120.528C111.27 122.017 110.412 123.38 109.058 124.001C97.1638 129.459 83.9328 132.5 70.0018 132.5C56.0695 132.5 42.8374 129.458 30.9418 123.999C29.5884 123.378 28.7308 122.015 28.7564 120.527Z" fill="#0B87AC" />
              </svg>
            )}
          </div>
          {isEditing && (
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-6 h-6" />
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      {/* Form Fields (Same as before, simplified slightly) */}
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-[#024B5E]">Full Name</Label>
          <Input id="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} className="mt-1 text-[#024B5E]" />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-[#024B5E]">E-mail address or phone number</Label>
          <Input id="email" value={formData.email} disabled={true} className="mt-1 text-[#024B5E] bg-gray-50" />
        </div>

        <div>
          <Label htmlFor="street" className="text-sm font-medium text-[#024B5E]">Street</Label>
          <Input id="street" value={formData.street} onChange={handleChange} disabled={!isEditing} className="mt-1 text-[#024B5E]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-[#024B5E]">State</Label>
            <Input id="state" value={formData.state} onChange={handleChange} disabled={!isEditing} className="mt-1 text-[#024B5E]" />
          </div>
          <div>
            <Label htmlFor="zipCode" className="text-sm font-medium text-[#024B5E]">Zip Code</Label>
            <Input id="zipCode" value={formData.zipCode} onChange={handleChange} disabled={!isEditing} className="mt-1 text-[#024B5E]" />
          </div>
        </div>

        <div>
          <Label htmlFor="dob" className="text-sm font-medium text-[#024B5E]">Date of birth</Label>
          <div className="relative mt-1">
            <Input id="dob" type="date" value={formData.dob} onChange={handleChange} disabled={!isEditing} className="text-[#024B5E] block w-full" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <h3 className="text-md font-semibold text-[#024B5E] mb-4">Change Password</h3>
            <div className="space-y-4">
                {/* Password Fields - Same as original */}
                <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-[#024B5E]">Current Password</Label>
                <div className="relative mt-1">
                    <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={formData.currentPassword} onChange={handleChange} disabled={!isEditing} placeholder="••••••••" className="pr-10 text-[#024B5E]" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024B5E]">
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                </div>

                <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-[#024B5E]">New Password</Label>
                <div className="relative mt-1">
                    <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={formData.newPassword} onChange={handleChange} disabled={!isEditing} placeholder="••••••••" className="pr-10 text-[#024B5E]" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024B5E]">
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                </div>

                <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#024B5E]">Confirm Password</Label>
                <div className="relative mt-1">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} disabled={!isEditing} placeholder="••••••••" className="pr-10 text-[#024B5E]" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024B5E]">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}