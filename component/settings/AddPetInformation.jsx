"use client";
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dog, Cat, Camera, Heart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/auth';

export default function PetDetailsForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // API States
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [petId, setPetId] = useState("6987bf7d4038a7d08c9285d6");
  const [gallery, setGallery] = useState([]); 
  const [saveModal, setSaveModal] = useState({
    open: false,
    type: "success",
    message: "",
  });
  // NEW: State for showing image immediately
  const [imagePreview, setImagePreview] = useState(null);

  // Original UI States
  const [selectedPetType, setSelectedPetType] = useState('dog');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [dob, setDob] = useState('');
  const [breed, setBreed] = useState('');
  const [microchipped, setMicrochipped] = useState('');
  const [spayedNeutered, setSpayedNeutered] = useState('');
  const [houseTrained, setHouseTrained] = useState('');
  const [friendlyChildren, setFriendlyChildren] = useState('');
  const [friendlyDogs, setFriendlyDogs] = useState('');
  const [gender, setGender] = useState('male');
  const [pottyBreak, setPottyBreak] = useState('every-hour');
  const [energyLevel, setEnergyLevel] = useState('high');
  const [feedingSchedule, setFeedingSchedule] = useState('morning');
  const [canBeLeftAlone, setCanBeLeftAlone] = useState('1-hour');
  const [medicationType, setMedicationType] = useState('pill');
  const [medicationName, setMedicationName] = useState('');
  const [about, setAbout] = useState('');
  const [vetInfo, setVetInfo] = useState('');
  const [insurance, setInsurance] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Image Upload API (Modified for Instant Feedback)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    if (!petId) {
        toast.error("Pet ID missing provided, only preview shown.");
        return;
    }

    const data = new FormData();
    data.append("petImage", file);

    try {
      setUploading(true);
      const res = await fetchWithAuth(`${API_BASE}/api/pets/${petId}/image`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok) {
        setGallery(result.gallery || []);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload to server, showing preview only.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 2. Save Pet Details API
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        type: selectedPetType === 'dog' ? 'Dog' : 'Cat',
        breed,
        gender: gender === 'male' ? 'Male' : 'Female',
        birthDate: dob,
        ageYears: Number(age),
        ageMonths: Number(ageMonths),
        weight: Number(weight),
        weightUnit: "kg",
        about,
        microchipped: microchipped === 'microchipped' ? 'Yes' : 'No',
        spayedNeutered: spayedNeutered === 'spayed' ? 'Yes' : 'No',
        houseTrained: houseTrained === 'trained' ? 'Yes' : 'No',
        friendlyWithChildren: friendlyChildren === 'friendly' ? 'Yes' : 'No',
        friendlyWithDogs: friendlyDogs === 'friendly' ? 'Yes' : 'No',
        pottyBreakSchedule: pottyBreak,
        energyLevel,
        feedingSchedule,
        canBeLeftAlone,
        medications: medicationName ? [{ type: medicationType, name: medicationName }] : [],
        vetInfo,
        insuranceProvider: insurance
      };

      const res = await fetchWithAuth(`${API_BASE}/api/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const result = await res.json();
      if (res.ok) {
        setPetId(result.pet._id);
        toast.success("Pet profile saved");
        setSaveModal({
          open: true,
          type: "success",
          message: "Your pet profile has been updated successfully.",
        });
      } else {
        toast.error(result.message || "Failed to save");
        setSaveModal({
          open: true,
          type: "error",
          message: result.message || "Failed to save pet profile.",
        });
      }
    } catch (error) {
      toast.error("An error occurred");
      setSaveModal({
        open: true,
        type: "error",
        message: "An error occurred while saving. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decide which image to show
  const getDisplayImage = () => {
    if (imagePreview) return imagePreview; 
    if (gallery && gallery.length > 0) return `${API_BASE}/${gallery[gallery.length - 1]}`;
    return "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=1200&h=400&fit=crop";
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white px-6 py-4 flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#024B5E] hover:text-teal-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-semibold text-[#024B5E]">Pet Profile Edit</h1>
      </div>

      <div className="relative mb-6 mx-6">
        <div className="rounded-2xl overflow-hidden shadow-lg h-96 bg-gray-200">
          <img
            src={getDisplayImage()}
            alt="Pet"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <button 
             onClick={() => fileInputRef.current.click()}
             className="absolute bottom-6 right-6 bg-gray-800/70 hover:bg-gray-800/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            Update Pet Photo
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      <div className="bg-white mx-6 rounded-2xl shadow-sm p-6">
        {/* ... Rest of your form inputs (No changes needed below) ... */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Dog className="w-5 h-5 text-[#024B5E]" />
            <h2 className="text-xl font-semibold text-[#024B5E]">Pet details</h2>
          </div>
          <p className="text-sm text-[#024B5E]">Provide your sitter with a description of your pet</p>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-[#024B5E] mb-3 block">What type of pet?</Label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setSelectedPetType('dog')} className={`p-6 border-2 rounded-lg transition-all ${selectedPetType === 'dog' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200 hover:border-gray-300 text-[#024B5E]'}`}><Dog className="w-12 h-12 mx-auto" /></button>
            <button onClick={() => setSelectedPetType('cat')} className={`p-6 border-2 rounded-lg transition-all ${selectedPetType === 'cat' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200 hover:border-gray-300 text-[#024B5E]'}`}><Cat className="w-12 h-12 mx-auto" /></button>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="name" className="text-sm font-medium text-[#024B5E] mb-2 block">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet Name" className="w-full text-[#024B5E]" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="weight" className="text-sm font-medium text-[#024B5E] mb-2 block">Weight (kg)</Label>
            <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="8kg" className="w-full text-[#024B5E]" />
          </div>
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-[#024B5E] mb-2 block">Age (Year)</Label>
            <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="3" className="w-full text-[#024B5E]" />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="ageMonths" className="text-sm font-medium text-[#024B5E] mb-2 block">Age (Month)</Label>
          <Input id="ageMonths" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} placeholder="4" className="w-full text-[#024B5E]" />
        </div>

        <div className="mb-6">
          <Label htmlFor="dob" className="text-sm font-medium text-[#024B5E] mb-2 block">Dates of birth</Label>
          <div className="relative">
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full pr-10 text-[#024B5E]" />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="breed" className="text-sm font-medium text-[#024B5E] mb-2 block">Breed</Label>
          <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Mix" className="w-full text-[#024B5E]" />
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-[#024B5E] mb-3 block">Gender</Label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setGender('male')} className={`py-3 border-2 rounded-lg font-medium transition-all ${gender === 'male' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200 text-[#024B5E]'}`}>Male</button>
            <button onClick={() => setGender('female')} className={`py-3 border-2 rounded-lg font-medium transition-all ${gender === 'female' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200 text-[#024B5E]'}`}>Female</button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#024B5E] mb-4">Additional details</h3>
          <div className="mb-4">
            <Label className="text-sm font-medium text-[#024B5E] mb-3 block">Microchipped?</Label>
            <div className="flex gap-3">
              <button onClick={() => setMicrochipped('microchipped')} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium ${microchipped === 'microchipped' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200'}`}>Microchipped</button>
              <button onClick={() => setMicrochipped('not-microchipped')} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium ${microchipped === 'not-microchipped' ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200'}`}>Not microchipped</button>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="about" className="text-sm font-medium text-[#024B5E] mb-2 block">About your pet</Label>
            <Textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Add a description" className="w-full min-h-[100px] resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white mx-6 rounded-2xl shadow-sm p-6 mt-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-[#024B5E]" />
            <h2 className="text-xl font-semibold text-[#024B5E]">Care Info</h2>
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-[#024B5E] mb-3 block">Potty break</Label>
          <div className="space-y-2">
            {['every-hour', 'every-2-hours', 'every-4-hours'].map((opt) => (
              <button key={opt} onClick={() => setPottyBreak(opt)} className={`w-full px-4 py-3 border-2 rounded-lg text-sm text-left font-medium ${pottyBreak === opt ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200'}`}>{opt.replace(/-/g, ' ')}</button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-[#024B5E] mb-3 block">Medications</Label>
          <div className="flex gap-3 mb-3">
            {['pill', 'topical', 'injection'].map(opt => (
              <button key={opt} onClick={() => setMedicationType(opt)} className={`px-4 py-3 border-2 rounded-lg text-sm ${medicationType === opt ? 'border-[#024B5E] bg-[#024B5E] text-white' : 'border-gray-200'}`}>{opt}</button>
            ))}
          </div>
          <Input value={medicationName} onChange={(e) => setMedicationName(e.target.value)} placeholder="Name of the pill..." className="w-full" />
        </div>
      </div>

      <div className="bg-white mx-6 rounded-2xl shadow-sm p-6 mt-6 mb-6">
        <h2 className="text-xl font-semibold text-[#024B5E] mb-4">Health info</h2>
        <Label className="text-sm font-medium mb-2 block">Veterinary info</Label>
        <Textarea value={vetInfo} onChange={(e) => setVetInfo(e.target.value)} placeholder="Vet details" className="w-full min-h-[120px] mb-4" />
        <Label className="text-sm font-medium mb-2 block">Insurance Provider</Label>
        <Input value={insurance} onChange={(e) => setInsurance(e.target.value)} placeholder="Insurance" className="w-full" />
      </div>

      <div className="mx-6 mb-8">
        <button onClick={handleSave} disabled={loading} className="w-full bg-[#024B5E] hover:bg-[#023b4a] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors">
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saveModal.open ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#D9E8EC] bg-white p-6 shadow-2xl">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                saveModal.type === "success"
                  ? "bg-[#E7F4F6] text-[#024B5E]"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {saveModal.type === "success" ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.75 12.5L10.58 15.33L16.25 9.66998"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8V12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              )}
            </div>
            <h3 className="text-center text-xl font-semibold text-[#024B5E]">
              {saveModal.type === "success" ? "Changes Saved" : "Save Failed"}
            </h3>
            <p className="mt-2 text-center text-sm text-[#3D6470]">
              {saveModal.message}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSaveModal((prev) => ({ ...prev, open: false }))}
                className="flex-1 rounded-xl border border-[#024B5E]/30 px-4 py-2 text-sm font-medium text-[#024B5E] hover:bg-[#F3FAFC]"
              >
                Stay Here
              </button>
              {saveModal.type === "success" ? (
                <button
                  type="button"
                  onClick={() => router.push('/settings')}
                  className="flex-1 rounded-xl bg-[#024B5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#023b4a]"
                >
                  Go to Settings
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-[#024B5E] px-4 py-2 text-sm font-medium text-white hover:bg-[#023b4a]"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
