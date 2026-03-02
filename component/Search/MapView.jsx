import React from "react";

const MapView = () => {
  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map placeholder - You can integrate with Google Maps, Mapbox, or Leaflet */}
      <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 relative">
        {/* Street lines overlay to simulate map */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal streets */}
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="white" strokeWidth="3" />
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="white" strokeWidth="2" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="3" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="white" strokeWidth="2" />

          {/* Vertical streets */}
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="2" />
          <line x1="40%" y1="0" x2="40%" y2="100%" stroke="white" strokeWidth="3" />
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="white" strokeWidth="2" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="white" strokeWidth="3" />
        </svg>

        {/* Location markers - Sitter locations */}
        <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-[#035F75] rounded-full border-4 border-white shadow-lg animate-pulse" />
        </div>

        <div className="absolute top-[30%] left-[35%]">
          <div className="w-6 h-6 bg-[#035F75] rounded-full border-3 border-white shadow-md" />
        </div>

        <div className="absolute top-[55%] left-[60%]">
          <div className="w-6 h-6 bg-[#035F75] rounded-full border-3 border-white shadow-md" />
        </div>

        <div className="absolute top-[25%] left-[65%]">
          <div className="w-6 h-6 bg-[#035F75] rounded-full border-3 border-white shadow-md" />
        </div>

        <div className="absolute top-[70%] left-[40%]">
          <div className="w-6 h-6 bg-[#035F75] rounded-full border-3 border-white shadow-md" />
        </div>

        <div className="absolute top-[65%] left-[52%]">
          <div className="w-6 h-6 bg-[#035F75] rounded-full border-3 border-white shadow-md" />
        </div>

        {/* Map labels */}
        <div className="absolute top-4 left-4 text-xs text-gray-600 font-semibold bg-white/80 px-2 py-1 rounded">
          Boe III
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-gray-600 font-semibold bg-white/80 px-2 py-1 rounded">
          Vern Coffee
        </div>
        <div className="absolute top-1/2 right-4 text-xs text-gray-600 font-semibold bg-white/80 px-2 py-1 rounded transform -rotate-90">
          Jalan Flat Copy
        </div>
        <div className="absolute bottom-8 right-8 text-xs text-gray-600 font-semibold bg-white/80 px-2 py-1 rounded">
          Starbucks
        </div>

        {/* Featured sitter info card on map */}
        <div className="absolute top-[52%] left-[50%] transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-2 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              SR
            </div>
            <div>
              <div className="text-xs font-semibold">Seam Rahman</div>
              <div className="text-xs text-gray-500">$25/day</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50">
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50">
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>
      </div>
    </div>
  );
};

export default MapView;
