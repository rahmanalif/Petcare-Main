"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Camera, Loader2 } from "lucide-react";
import { 
  fetchSitterProfile, 
  uploadPortfolioImage, 
  deletePortfolioImage 
} from "@/redux/sitter/sitterSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// ✅ string path → full URL বানাও
const buildImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
};

export default function Portfolio() {
  const dispatch = useDispatch();

  const { profile: sitterData, loading, updating } = useSelector((state) => state.sitter);

  // ✅ sitterData = { profile: {...}, earnings: {...} }
  // portfolioImages is array of strings inside sitterData.profile
  const portfolioImages = sitterData?.profile?.portfolioImages || [];

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!sitterData) {
      dispatch(fetchSitterProfile());
    }
  }, [dispatch, sitterData]);

  const handleDelete = async (imagePath) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const filename = imagePath.split("/").pop();
      await dispatch(deletePortfolioImage(filename));
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const result = await dispatch(uploadPortfolioImage(files[0]));
      if (uploadPortfolioImage.fulfilled.match(result)) {
        setShowUploadModal(false);
      }
    }
  };

  const handlePublish = () => setIsPublished(!isPublished);

  // Loading state
  if (loading && !sitterData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#035F75]" />
      </div>
    );
  }

  // Empty state
  if (portfolioImages.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 max-w-3xl">
        <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
          <h2 className="text-lg md:text-2xl font-medium text-gray-800">Portfolio</h2>
          <button
            onClick={handlePublish}
            className="px-3 md:px-6 py-2 md:py-2.5 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024a5c] transition-colors text-xs md:text-sm"
          >
            {isPublished ? "Published" : "Publish"}
          </button>
        </div>

        <div
          onClick={() => setShowUploadModal(true)}
          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#035F75] rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Camera className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <p className="text-gray-500 text-center text-sm md:text-base">
            No portfolio images yet. Click to add.
          </p>
        </div>

        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={handleFileUpload}
            uploading={updating}
          />
        )}
      </div>
    );
  }

  // List state
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 max-w-3xl">
        <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200 gap-2">
          <h2 className="text-lg md:text-2xl font-medium text-gray-800">Portfolio</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 md:px-6 py-2 md:py-2.5 border-2 border-dashed border-[#035F75] text-[#035F75] rounded-lg font-medium hover:bg-[#E7F4F6] transition-colors text-xs md:text-sm whitespace-nowrap"
          >
            Add Portfolio
          </button>
        </div>

        {/* ✅ portfolioImages = string[] — প্রতিটা full URL বানিয়ে দেখাও */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {portfolioImages.map((imagePath, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[4/3]">
                <img
                  src={buildImageUrl(imagePath)}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleDelete(imagePath)}
                className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-red-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          uploading={updating}
        />
      )}
    </>
  );
}

function UploadModal({ onClose, onUpload, uploading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
          <h2 className="text-lg md:text-2xl font-medium text-gray-800">Upload to Portfolio</h2>
        </div>

        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] hover:border-[#035F75] hover:bg-gray-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? (
              <div className="flex flex-col items-center text-[#035F75]">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <p>Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#035F75] rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-gray-500 text-center text-sm md:text-base">Click to upload portfolio image</p>
              </>
            )}
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={uploading}
          className="hidden"
        />

        <div className="mt-3 md:mt-4 flex justify-end">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 md:px-6 py-2 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}