"use client";
import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Loader2, Camera, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fetchPetById, updatePetImage, clearSelectedPet } from "@/redux/petSlice"; // Import actions

const formatText = (text) => {
  if (!text) return "N/A";
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function PetDetailIds() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const petFromList = useSelector((state) => state.pets.list.find(p => p._id === id));
  const selectedPet = useSelector((state) => state.pets.selectedPet);
  const { loading, uploading } = useSelector((state) => state.pets);

  const pet = petFromList || selectedPet;

  useEffect(() => {
    if (id && !petFromList) {
      dispatch(fetchPetById(id));
    }

    return () => {
      dispatch(clearSelectedPet());
    };
  }, [dispatch, id, petFromList]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !pet?._id) return;

    try {
      await dispatch(updatePetImage({ id: pet._id, file })).unwrap();
      toast.success("Pet image updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(typeof error === "string" ? error : "Upload error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading && !pet) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F4EF]">
        <Loader2 className="animate-spin text-[#024B5E] w-10 h-10" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F4EF]">
        <p className="text-[#024B5E] mb-4">Pet not found.</p>
        <button onClick={() => router.back()} className="text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  const displayImageRaw =
    (pet.gallery && pet.gallery.length > 0) ? pet.gallery[pet.gallery.length - 1] :
      (pet.coverPhoto ? pet.coverPhoto : "/Ellipse.png");

  const isExternal = displayImageRaw.startsWith('http') || displayImageRaw === "/Ellipse.png";

  const finalImageSrc = isExternal
    ? displayImageRaw
    : `${API_BASE}/${displayImageRaw.replace(/\\/g, '/')}`;

  return (
    <div className="min-h-screen bg-[#F8F4EF] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="text-[#024B5E] w-5 h-5" />
            <span className="text-[#024B5E] font-medium text-lg">Back to Settings</span>
          </button>
        </div>

        {/* Header Image Section */}
        <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-96 bg-gray-200">
          <img
            src={finalImageSrc}
            alt={pet.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#024B5E] px-4 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 transition-all"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            <span>Update Photo</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>

        {/* Rest of the UI is same as original */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-none shadow-md">
            <CardHeader><CardTitle className="text-xl text-[#024B5E]">Pet Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Name</span>
                <span className="text-[#024B5E] font-bold">{pet.name}</span>
              </div>
              {/* ... other fields ... */}
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Type</span>
                <span className="text-[#024B5E] font-medium">{pet.type}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Breed</span>
                <span className="text-[#024B5E] font-medium">{pet.breed}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Gender</span>
                <span className="text-[#024B5E] font-medium capitalize">{pet.gender}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Weight</span>
                <span className="text-[#024B5E] font-medium">{pet.weight} {pet.weightUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Birthdate</span>
                <span className="text-[#024B5E] font-medium">
                  {pet.birthDate ? new Date(pet.birthDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader><CardTitle className="text-xl text-[#024B5E]">Behaviors & Traits</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* ... Behaviors grid ... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">Microchipped</span><strong className="text-[#024B5E]">{pet.microchipped || "N/A"}</strong></div>
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">Spayed/Neutered</span><strong className="text-[#024B5E]">{pet.spayedNeutered || "N/A"}</strong></div>
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">House Trained</span><strong className="text-[#024B5E]">{pet.houseTrained || "N/A"}</strong></div>
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">Friendly with Kids</span><strong className="text-[#024B5E]">{pet.friendlyWithChildren || "N/A"}</strong></div>
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">Friendly with Dogs</span><strong className="text-[#024B5E]">{pet.friendlyWithDogs || "N/A"}</strong></div>
                  <div className="bg-[#E7F4F6] p-3 rounded-lg"><span className="text-gray-500 block">Friendly with Cats</span><strong className="text-[#024B5E]">{pet.friendlyWithCats || "N/A"}</strong></div>
                </div>
                <div className="mt-4">
                  <span className="text-[#024B5E] font-medium block mb-1">About {pet.name}:</span>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{pet.about || "No additional description provided."}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Care & Health Cards (Same content) */}
              <Card className="border-none shadow-md">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2 text-[#024B5E]"><Heart size={18} /> Care info</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div><span className="text-gray-500 block text-xs">Potty Break Schedule</span><span className="text-[#024B5E] font-medium">{formatText(pet.pottyBreakSchedule)}</span></div>
                  <div><span className="text-gray-500 block text-xs">Energy Level</span><span className="text-[#024B5E] font-medium">{formatText(pet.energyLevel)}</span></div>
                  <div><span className="text-gray-500 block text-xs">Feeding Schedule</span><span className="text-[#024B5E] font-medium">{formatText(pet.feedingSchedule)}</span></div>
                  <div><span className="text-gray-500 block text-xs">Can be left alone</span><span className="text-[#024B5E] font-medium">{formatText(pet.canBeLeftAlone)}</span></div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2 text-[#024B5E]"><Activity size={18} /> Health info</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <span className="text-gray-500 block text-xs">Vet Info</span>
                    <span className="text-[#024B5E] font-medium">
                      {typeof pet.vetInfo === 'object' && pet.vetInfo !== null
                        ? (pet.vetInfo.name || pet.vetInfo.clinic)
                        : (pet.vetInfo || "Not provided")}
                    </span>
                  </div>
{/* update */}
                  <div><span className="text-gray-500 block text-xs">Insurance Provider</span><span className="text-[#024B5E] font-medium">{pet.insuranceProvider || "Not provided"}</span></div>
                  <div><span className="text-gray-500 block text-xs">Medication</span><span className="text-[#024B5E] font-medium">{pet.medications && pet.medications.length > 0 ? pet.medications.map(m => m.name).join(", ") : "None"}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}