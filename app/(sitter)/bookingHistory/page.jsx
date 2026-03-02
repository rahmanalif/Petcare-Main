"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "@/redux/sitter/bookingSlice";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  CalendarDays 
} from "lucide-react";


const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Custom Paw Icon (Background Graphic) - As provided
const PawIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="282" height="235" viewBox="0 0 282 235" fill="none" className={className}>
    <g opacity="0.4">
      <mask id="path-1-inside-1_5491_3792" fill="white">
        <path d="M67.763 98.7991C87.4678 117.752 93.7047 142.653 80.4471 152.389C67.1894 162.125 40.2394 155.353 19.7044 135.258C-0.000659588 116.305 -6.23786 91.4025 7.01989 81.6667C20.2777 71.9312 47.0215 79.5859 67.763 98.7991ZM124.319 44.8813C133.666 70.5648 126.845 94.9856 108.401 98.7512C89.957 102.517 66.7288 84.5453 57.3819 58.8618C48.0352 33.1781 54.8569 8.7566 73.3009 4.99109C91.5383 2.10739 113.936 18.9374 124.319 44.8813ZM210.532 51.6314C209.724 78.4963 193.157 97.6675 173.88 95.6234C153.566 93.3186 139.246 70.1188 139.848 44.1351C140.45 18.1514 157.224 -1.90163 176.501 0.142685C196.815 2.44781 211.134 25.6479 210.532 51.6314ZM216.013 159.404C261.428 190.418 258.963 219.668 235.34 226.799C211.717 233.929 186.413 210.769 159.677 212.451C132.94 214.132 116.17 238.853 90.8794 234.364C64.5528 229.615 52.5098 201.388 87.0964 166.21C111.329 142.431 114.004 116.968 144.057 115.186C173.902 114.286 184.699 138.467 216.013 159.404ZM266.723 69.4657C283.311 78.3013 286.439 102.423 272.775 123.257C260.148 144.352 235.905 154.126 219.317 145.291C202.729 136.456 199.601 112.334 213.265 91.5C226.928 70.6658 251.171 60.8907 266.723 69.4657Z" />
      </mask>
      <path d="M67.763 98.7991C87.4678 117.752 93.7047 142.653 80.4471 152.389C67.1894 162.125 40.2394 155.353 19.7044 135.258C-0.000659588 116.305 -6.23786 91.4025 7.01989 81.6667C20.2777 71.9312 47.0215 79.5859 67.763 98.7991ZM124.319 44.8813C133.666 70.5648 126.845 94.9856 108.401 98.7512C89.957 102.517 66.7288 84.5453 57.3819 58.8618C48.0352 33.1781 54.8569 8.7566 73.3009 4.99109C91.5383 2.10739 113.936 18.9374 124.319 44.8813ZM210.532 51.6314C209.724 78.4963 193.157 97.6675 173.88 95.6234C153.566 93.3186 139.246 70.1188 139.848 44.1351C140.45 18.1514 157.224 -1.90163 176.501 0.142685C196.815 2.44781 211.134 25.6479 210.532 51.6314ZM216.013 159.404C261.428 190.418 258.963 219.668 235.34 226.799C211.717 233.929 186.413 210.769 159.677 212.451C132.94 214.132 116.17 238.853 90.8794 234.364C64.5528 229.615 52.5098 201.388 87.0964 166.21C111.329 142.431 114.004 116.968 144.057 115.186C173.902 114.286 184.699 138.467 216.013 159.404ZM266.723 69.4657C283.311 78.3013 286.439 102.423 272.775 123.257C260.148 144.352 235.905 154.126 219.317 145.291C202.729 136.456 199.601 112.334 213.265 91.5C226.928 70.6658 251.171 60.8907 266.723 69.4657Z" fill="#357F91" />
      <path d="M67.763 98.7991L76.1111 90.1197L76.0296 90.0413L75.9466 89.9645L67.763 98.7991ZM80.4471 152.389L87.5751 162.096L87.5751 162.095L80.4471 152.389ZM19.7044 135.258L28.127 126.651L28.0899 126.615L28.0525 126.579L19.7044 135.258ZM7.01989 81.6667L-0.107852 71.9601L-0.108015 71.9602L7.01989 81.6667ZM124.319 44.8813L135.636 40.7632L135.571 40.5839L135.5 40.4068L124.319 44.8813ZM108.401 98.7512L110.81 110.55L110.81 110.55L108.401 98.7512ZM57.3819 58.8618L46.0655 62.98L46.0655 62.9801L57.3819 58.8618ZM73.3009 4.99109L71.4201 -6.90366L71.155 -6.86174L70.892 -6.80805L73.3009 4.99109ZM210.532 51.6314L222.569 51.9937L222.57 51.952L222.571 51.9103L210.532 51.6314ZM173.88 95.6234L172.522 107.589L172.566 107.594L172.61 107.599L173.88 95.6234ZM139.848 44.1351L127.808 43.8561L127.808 43.8562L139.848 44.1351ZM176.501 0.142685L177.859 -11.823L177.815 -11.828L177.771 -11.8327L176.501 0.142685ZM216.013 159.404L222.804 149.459L222.755 149.426L222.706 149.393L216.013 159.404ZM235.34 226.799L238.82 238.328L238.82 238.327L235.34 226.799ZM159.677 212.451L158.921 200.432L158.921 200.432L159.677 212.451ZM90.8794 234.364L88.7415 246.216L88.7582 246.219L88.7749 246.222L90.8794 234.364ZM87.0964 166.21L78.6619 157.615L78.5849 157.69L78.5093 157.767L87.0964 166.21ZM144.057 115.186L143.694 103.149L143.519 103.154L143.344 103.165L144.057 115.186ZM266.723 69.4657L260.908 80.0114L260.984 80.0535L261.061 80.0945L266.723 69.4657ZM272.775 123.257L262.705 116.653L262.569 116.86L262.442 117.072L272.775 123.257ZM219.317 145.291L213.656 155.92L213.656 155.92L219.317 145.291ZM213.265 91.5L203.195 84.8957L203.195 84.8958L213.265 91.5ZM67.763 98.7991L59.4149 107.478C67.964 115.701 73.0359 124.726 74.7588 131.873C76.5348 139.24 74.4449 141.856 73.3191 142.683L80.4471 152.389L87.5751 162.095C99.7069 153.186 101.127 138.483 98.1731 126.228C95.1657 113.752 87.2667 100.85 76.1111 90.1197L67.763 98.7991ZM80.4471 152.389L73.3192 142.683C70.8763 144.477 65.1759 145.9 55.9717 143.391C47.172 140.993 37.0688 135.401 28.127 126.651L19.7044 135.258L11.2818 143.865C22.875 155.21 36.5143 163.051 49.6377 166.629C62.3568 170.096 76.7602 170.037 87.5751 162.096L80.4471 152.389ZM19.7044 135.258L28.0525 126.579C19.5033 118.356 14.4312 109.331 12.7083 102.184C10.9321 94.8155 13.0222 92.1997 14.1478 91.3731L7.01989 81.6667L-0.108015 71.9602C-12.2401 80.8694 -13.6603 95.5729 -10.7061 107.828C-7.6986 120.304 0.200476 133.207 11.3563 143.937L19.7044 135.258ZM7.01989 81.6667L14.1476 91.3732C16.4459 89.6856 21.9657 88.3183 31.3023 90.9636C40.1925 93.4824 50.4261 99.1549 59.5793 107.634L67.763 98.7991L75.9466 89.9645C64.3584 79.2301 50.8494 71.4687 37.8678 67.7907C25.3327 64.2392 10.8518 63.9122 -0.107852 71.9601L7.01989 81.6667ZM124.319 44.8813L113.003 48.9995C116.993 59.9645 117.204 69.8337 115.217 76.6765C113.283 83.336 109.755 86.1837 105.992 86.9521L108.401 98.7512L110.81 110.55C125.491 107.553 134.595 96.3076 138.346 83.3944C142.043 70.6645 140.992 55.4816 135.636 40.7632L124.319 44.8813ZM108.401 98.7512L105.992 86.952C101.43 87.8834 94.5369 86.3162 86.8824 80.3511C79.4347 74.5471 72.6199 65.519 68.6984 54.7434L57.3819 58.8618L46.0655 62.9801C51.4908 77.888 60.9635 90.6874 72.0776 99.3486C82.9849 107.849 96.9279 113.384 110.81 110.55L108.401 98.7512ZM57.3819 58.8618L68.6984 54.7435C64.708 43.7785 64.4968 33.9091 66.4844 27.0661C68.4188 20.4064 71.9465 17.5585 75.7098 16.7902L73.3009 4.99109L70.892 -6.80805C56.2112 -3.81084 47.1061 7.43475 43.3553 20.3481C39.6577 33.0781 40.7091 48.2614 46.0655 62.98L57.3819 58.8618ZM73.3009 4.99109L75.1817 16.8858C79.9814 16.1269 86.8665 17.8408 94.3929 23.6556C101.76 29.3471 108.693 38.2474 113.139 49.3559L124.319 44.8813L135.5 40.4068C129.562 25.5713 120.105 13.0846 109.118 4.59611C98.2902 -3.76919 84.8578 -9.02843 71.4201 -6.90366L73.3009 4.99109ZM210.532 51.6314L198.495 51.2691C198.16 62.409 194.572 71.1908 189.922 76.7088C185.343 82.1434 180.094 84.1723 175.15 83.648L173.88 95.6234L172.61 107.599C186.943 109.119 199.615 102.584 208.341 92.2278C216.997 81.9549 222.096 67.7187 222.569 51.9937L210.532 51.6314ZM173.88 95.6234L175.237 83.6577C169.523 83.0093 163.74 79.3365 159.129 72.2144C154.518 65.091 151.637 55.2173 151.887 44.4139L139.848 44.1351L127.808 43.8562C127.457 59.0366 131.435 73.7546 138.911 85.3033C146.388 96.8532 157.922 105.933 172.522 107.589L173.88 95.6234ZM139.848 44.1351L151.887 44.414C152.132 33.8446 155.668 25.0373 160.418 19.3427C165.142 13.6807 170.465 11.6126 175.231 12.1181L176.501 0.142685L177.771 -11.8327C163.261 -13.3715 150.558 -6.43529 141.924 3.91413C133.317 14.2309 128.166 28.4419 127.808 43.8561L139.848 44.1351ZM176.501 0.142685L175.144 12.1084C180.858 12.7568 186.64 16.4297 191.251 23.5518C195.862 30.6753 198.743 40.5491 198.493 51.3525L210.532 51.6314L222.571 51.9103C222.923 36.7302 218.945 22.0122 211.469 10.4635C203.993 -1.08658 192.459 -10.1663 177.859 -11.823L176.501 0.142685ZM216.013 159.404L209.221 169.349C230.919 184.166 238.425 196.808 239.702 204.127C240.284 207.461 239.598 209.535 238.679 210.902C237.684 212.382 235.664 214.122 231.86 215.27L235.34 226.799L238.82 238.327C246.827 235.91 253.974 231.319 258.666 224.34C263.434 217.249 264.955 208.735 263.429 199.988C260.491 183.146 246.522 165.656 222.804 149.459L216.013 159.404ZM235.34 226.799L231.86 215.27C224.476 217.499 216.01 215.261 202.869 210.379C191.2 206.045 175.425 199.394 158.921 200.432L159.677 212.451L160.432 224.469C170.664 223.826 180.909 227.915 194.482 232.957C206.583 237.452 222.58 243.229 238.82 238.328L235.34 226.799ZM159.677 212.451L158.921 200.432C142.306 201.477 128.829 209.776 118.973 215.147C108.221 221.007 101.088 223.946 92.9839 222.507L90.8794 234.364L88.7749 246.222C105.961 249.272 119.858 242.094 130.499 236.296C142.035 230.008 150.31 225.106 160.432 224.469L159.677 212.451ZM90.8794 234.364L93.0174 222.513C83.6576 220.825 78.9978 215.648 78.0289 209.747C76.9403 203.117 79.6712 190.939 95.6836 174.653L87.0964 166.21L78.5093 157.767C59.9351 176.659 51.3941 196.183 54.2621 213.649C57.2496 231.843 71.7747 243.155 88.7415 246.216L90.8794 234.364ZM87.0964 166.21L95.531 174.806C102.282 168.18 107.45 161.514 111.781 155.472C116.403 149.025 119.315 144.44 122.891 139.854C126.196 135.615 129.083 132.753 132.23 130.802C135.231 128.942 139.063 127.546 144.769 127.207L144.057 115.186L143.344 103.165C134.024 103.717 126.252 106.172 119.542 110.33C112.978 114.398 108.047 119.722 103.897 125.045C100.018 130.019 95.8401 136.37 92.2056 141.441C88.2803 146.917 84.0265 152.35 78.6619 157.615L87.0964 166.21ZM144.057 115.186L144.42 127.223C155.216 126.898 162.58 130.758 171.812 138.388C180.581 145.636 193.128 158.59 209.319 169.415L216.013 159.404L222.706 149.393C207.583 139.282 199.076 129.676 187.156 119.824C175.7 110.355 162.744 102.575 143.694 103.149L144.057 115.186ZM266.723 69.4657L261.061 80.0945C268.777 84.2041 274.324 98.936 262.705 116.653L272.775 123.257L282.845 129.861C298.554 105.909 297.845 72.3986 272.384 58.8369L266.723 69.4657ZM272.775 123.257L262.442 117.072C257.416 125.468 250.185 131.399 242.969 134.353C235.686 137.334 229.354 136.993 224.978 134.662L219.317 145.291L213.656 155.92C225.868 162.425 239.951 161.613 252.094 156.643C264.303 151.645 275.507 142.14 283.108 129.442L272.775 123.257ZM219.317 145.291L224.978 134.662C217.263 130.553 211.716 115.821 223.335 98.1042L213.265 91.5L203.195 84.8958C187.486 108.848 188.195 142.358 213.656 155.92L219.317 145.291ZM213.265 91.5L223.335 98.1043C228.899 89.6198 236.499 83.6078 243.848 80.5992C251.339 77.5325 257.272 78.0062 260.908 80.0114L266.723 69.4657L272.538 58.9201C260.622 52.3502 246.658 53.424 234.723 58.3096C222.647 63.2534 211.294 72.546 203.195 84.8957L213.265 91.5Z" fill="#E7F4F6" mask="url(#path-1-inside-1_5491_3792)" />
    </g>
  </svg>
);

export default function BookingHistory() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeStatus, setActiveStatus] = useState("on-going");
  
  // Redux 
  const { bookings, loading } = useSelector((state) => state.booking);


  const statusTypeMap = {
    "on-going": "ongoing",
    "completed": "completed",
    "cancelled": "cancelled",
    "upcoming": "upcoming",
  };

  useEffect(() => {
    const type = statusTypeMap[activeStatus];
    dispatch(fetchAllBookings(type));
  }, [dispatch, activeStatus]);

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/100";
    if (path.startsWith("http") || path.startsWith("https")) {
      return path;
    }
    return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const filteredBookings = Array.isArray(bookings) ? bookings : [];

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "ongoing") return "text-green-700";
    if (s === "completed") return "text-[#024B5E]";
    if (s === "cancelled" || s === "rejected") return "text-red-700";
    if (s === "upcoming" || s === "confirmed") return "text-blue-700";
    return "text-[#024B5E]";
  };

  const statuses = ["On going", "Completed", "Cancelled", "Upcoming"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 w-full max-w-6xl">
        <div className="pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#024B5E] hover:underline mb-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        
        {/* Header with Title and Status Tabs */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-[#024B5E]">Order history</h2>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => {
              const statusKey = status.toLowerCase().replace(" ", "-");
              const isActive = activeStatus === statusKey;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(statusKey)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${isActive
                      ? "bg-[#035F75] text-white"
                      : "bg-gray-100 text-[#024B5E] hover:bg-gray-200"
                    }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && <p className="text-center text-[#024B5E] py-10">Loading orders...</p>}

        {/* Bookings List */}
        <div className="space-y-3 sm:space-y-4">
          {!loading && filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => router.push(`/settingForSitter/ongoing?id=${booking._id}`)}
                className="relative border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow bg-white cursor-pointer overflow-hidden"
              >
                {/* MOBILE LAYOUT (< 768px) */}
                <div className="md:hidden flex flex-col gap-4">
                  {/* Top Row: Profile & Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-start">
                      <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-gray-200">
                        <img
                          src={getImageUrl(booking.owner?.profilePicture)}
                          alt={booking.owner?.fullName || "Owner"}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/100" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#024B5E] text-sm">
                          {booking.owner?.fullName || "Client Name"}
                        </h3>
                        <p className="text-xs text-[#024B5E] flex items-center gap-1">
                          <MapPin size={10} />
                          {booking.owner?.address || "Location N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <div className="text-xs font-medium text-[#035F75]">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Service Name */}
                  <div className="text-sm font-semibold text-[#024B5E] capitalize">
                    {booking.serviceType}
                  </div>

                  {/* Price & Times */}
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-bold text-[#024B5E]">
                      {booking.currency} {booking.totalPrice}
                    </div>
                    <div className="text-xs text-[#024B5E] text-right">
                      <div>Pick-up: <span className="font-semibold">{booking.startTime}</span></div>
                      <div>Drop-off: <span className="font-semibold">{booking.endTime}</span></div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#024B5E] mb-1">Contact</h4>
                    <div className="flex items-center gap-2 text-xs text-[#024B5E]">
                      <Phone size={12} />
                      <span>{booking.owner?.phoneNumber || "N/A"}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-[#FE6C5D] hover:bg-[#ee6758] text-white text-xs font-medium rounded-md transition-colors">
                      Reschedule
                    </button>
                    <button className="flex-1 px-4 py-2 bg-[#035F75] hover:bg-[#024d61] text-white text-xs font-medium rounded-md transition-colors">
                      View Details
                    </button>
                  </div>
                </div>

                {/* TABLET/DESKTOP LAYOUT (≥ 768px) */}
                <div className="hidden md:flex justify-around items-center relative">
                  {/* LEFT COLUMN - Profile Info */}
                  <div className="flex flex-col gap-3 flex-1">
                    {/* Profile */}
                    <div className="flex gap-3 items-start">
                      <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-gray-200">
                        <img
                          src={getImageUrl(booking.owner?.profilePicture)}
                          alt={booking.owner?.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/100" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#024B5E] text-base">
                          {booking.owner?.fullName || "Client Name"}
                        </h3>
                        <p className="text-sm text-[#024B5E] flex items-center gap-1">
                          <MapPin size={12} />
                          {booking.owner?.address || "Location N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Service Name */}
                    <div className="text-base font-semibold text-[#024B5E] capitalize">
                      {booking.serviceType}
                    </div>

                    {/* Contact Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#024B5E] mb-2">Contact</h4>
                      <div className="flex items-center gap-2 text-sm text-[#024B5E]">
                        <Phone size={16} />
                        <span>{booking.owner?.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#024B5E] mt-1">
                        <Calendar size={16} />
                        <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Reschedule Button */}
                    <button className="px-6 py-2 bg-[#FE6C5D] hover:bg-[#ee6758] text-white text-sm font-medium rounded-md transition-colors w-fit">
                      Reschedule
                    </button>
                  </div>

                  {/* MIDDLE COLUMN - Huge Paw Logo */}
                  <div className="flex items-center justify-center px-2 md:px-4 lg:px-6 xl:px-8">
                    <div className="relative w-24 h-20 md:w-28 md:h-24 lg:w-36 lg:h-32 xl:w-48 xl:h-40 2xl:w-56 2xl:h-48 opacity-50 md:opacity-60">
                      <PawIcon className="w-full h-full"/>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Booking Details */}
                  <div className="flex flex-col gap-4 items-end flex-1">
                    {/* Date */}
                    <div className="text-base font-medium text-[#035F75] flex items-center gap-2">
                      <CalendarDays size={16} />
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>

                    {/* Status */}
                    <span className={`text-base font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>

                    {/* Price */}
                    <div className="text-xl font-bold text-[#024B5E] text-right">
                      {booking.currency} {booking.totalPrice}
                    </div>

                    {/* Times */}
                    <div className="text-sm text-[#024B5E] text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock size={14} />
                        Pick-up: <span className="font-semibold text-[#024B5E]">{booking.startTime}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <Clock size={14} />
                        Drop-off: <span className="font-semibold text-[#024B5E]">{booking.endTime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="px-6 py-2 bg-[#035F75] hover:bg-[#024d61] text-white text-sm font-medium rounded-md transition-colors w-fit">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-12">
                <p className="text-[#024B5E]">No {activeStatus.replace("-", " ")} bookings found.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
