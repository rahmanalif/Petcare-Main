"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { fetchProfile, updateProfileImage, updateProfileInfo } from "@/redux/userSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toISOString().split("T")[0];
};

const buildFormData = (data) => {
  if (!data) return {
    fullName: "", email: "", phone: "", street: "",
    state: "", zipCode: "", dob: "", profilePicture: "",
    about: "", petNumber: "", homeType: "Apartment",
    homeSize: "", outdoorSpace: "No outdoor space",
  };

  let profilePic = data.profilePicture || "";
  if (profilePic && !profilePic.startsWith("http")) {
    profilePic = `${API_BASE_URL}/${profilePic.replace(/\\/g, "/")}`;
  }

  return {
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone || data.phoneNumber || "",
    street: data.street || "",
    state: data.state || "",
    zipCode: data.zipCode || "",
    dob: formatDateForInput(data.dob) || "",
    profilePicture: profilePic,
    about: data.about || "",
    petNumber: data.petNumber || data.ownPetsCount || "",
    homeType: data.homeType || "Apartment",
    homeSize: data.homeSize || "",
    outdoorSpace: data.outdoorSpace || "No outdoor space",
  };
};

export default function AccountDetail() {
  const dispatch = useDispatch();
  const { data: user, loading, updating } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => buildFormData(user));
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) dispatch(fetchProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (user) setFormData(buildFormData(user));
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await dispatch(updateProfileImage(file)).unwrap();
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error || "Upload failed");
    }
  };

  const handleSave = async () => {
    if (!isEditing) { setIsEditing(true); return; }
    try {
      await dispatch(updateProfileInfo({
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.street,
        state: formData.state,
        zipCode: formData.zipCode,
        dob: formData.dob,
        about: formData.about,
        petNumber: formData.petNumber,
        homeType: formData.homeType,
        homeSize: formData.homeSize,
        outdoorSpace: formData.outdoorSpace,
      })).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "An error occurred while updating");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[#024B5E]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-[#024B5E]">Account</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={handleSave}
          disabled={updating}
          className={isEditing ? "bg-[#024B5E] hover:bg-[#023b4a]" : "border-[#024B5E] text-[#024B5E]"}
        >
          {updating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center sm:justify-start mb-6 sm:mb-8">
        <div
          className="relative cursor-pointer group w-20 h-20 sm:w-24 sm:h-24"
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-[#EBFBFE]">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
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

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-[#024B5E]">Full Name</Label>
          <Input id="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} placeholder="Name" className="mt-1 text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-[#024B5E]">E-mail address</Label>
          <Input id="email" value={formData.email} disabled className="mt-1 text-[#024B5E] bg-gray-50 cursor-not-allowed" placeholder="E-mail address or phone number" />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-[#024B5E]">Phone number</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="E-mail address or phone number" className="mt-1 text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
        </div>

        {/* Street */}
        <div>
          <Label htmlFor="street" className="text-sm font-medium text-[#024B5E]">Street</Label>
          <Input id="street" value={formData.street} onChange={handleChange} disabled={!isEditing} placeholder="Street Number and Name" className="mt-1 text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
        </div>

        {/* State + Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input id="state" value={formData.state} onChange={handleChange} disabled={!isEditing} placeholder="State" className="text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
          </div>
          <div>
            <Input id="zipCode" value={formData.zipCode} onChange={handleChange} disabled={!isEditing} placeholder="Zip Code" className="text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
          </div>
        </div>

        {/* About */}
        <div>
          <Label htmlFor="about" className="text-sm font-medium text-[#024B5E]">About</Label>
          <div className="relative mt-1">
            <textarea
              id="about"
              value={formData.about}
              onChange={handleChange}
              disabled={!isEditing}
              maxLength={500}
              rows={4}
              placeholder="Introduce yourself to potential clients..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200 text-[#024B5E] resize-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-400">
              {formData.about.length}/500
            </span>
          </div>
        </div>

        {/* Pet Number */}
        <div>
          <Label htmlFor="petNumber" className="text-sm font-medium text-[#024B5E]">Pet number</Label>
          <Input id="petNumber" value={formData.petNumber} onChange={handleChange} disabled={!isEditing} placeholder="0-3" className="mt-1 text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
        </div>

        {/* Home Type */}
        <div>
          <Label htmlFor="homeType" className="text-sm font-medium text-[#024B5E]">Home Type</Label>
          <select
            id="homeType"
            value={formData.homeType}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200 text-[#024B5E]"
          >
            <option>Apartment</option>
            <option>House</option>
            <option>Condo</option>
            <option>Townhouse</option>
            <option>Studio</option>
          </select>
        </div>

        {/* Home Size */}
        <div>
          <Label htmlFor="homeSize" className="text-sm font-medium text-[#024B5E]">Home Size (sq ft)</Label>
          <Input id="homeSize" value={formData.homeSize} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 800" className="mt-1 text-[#024B5E] disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200" />
        </div>

        {/* Outdoor Space */}
        <div>
          <Label htmlFor="outdoorSpace" className="text-sm font-medium text-[#024B5E]">Outdoor Space</Label>
          <select
            id="outdoorSpace"
            value={formData.outdoorSpace}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-transparent disabled:border-gray-200 text-[#024B5E]"
          >
            <option>No outdoor space</option>
            <option>Small yard</option>
            <option>Large yard</option>
            <option>Fenced yard</option>
            <option>Balcony</option>
          </select>
        </div>

      </div>
    </div>
  );
}