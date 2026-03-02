"use client";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchProfile } from "@/redux/userSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const resolveAvatarUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/+$/, "");
  const clean = String(path).replace(/^\/+/, "");
  return base ? `${base}/${clean}` : path;
};

export default function SitterNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const profileData = useSelector((state) => state.user?.data);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchProfile());
  }, [dispatch, isAuthenticated]);

  const avatarSrc = useMemo(
    () =>
      resolveAvatarUrl(
        profileData?.profilePicture || user?.profilePicture || user?.avatar || ""
      ),
    [profileData?.profilePicture, user?.profilePicture, user?.avatar]
  );

  const displayName = profileData?.fullName || user?.fullName || user?.name || "User";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/sitterdashboard" className="relative w-24 h-10 md:w-32 md:h-12 cursor-pointer">
          {/* <Image
            src="/Logo.png"
            alt="Wuffoos Logo"
            fill
            className="object-contain"
            priority
          /> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="61" height="50" viewBox="0 0 61 50" fill="none">
            <path d="M49.1535 15.0802C49.2018 14.9948 49.2872 14.9391 49.3837 14.9317C50.0259 14.8686 50.6718 14.8315 51.314 14.7758C53.0105 14.6273 54.6996 14.4416 56.3515 14.0147C57.1793 13.7994 57.9292 13.4541 58.5232 12.8267C59.8039 11.4828 60.576 9.90867 60.5909 8.02272C60.5983 7.16513 60.2456 6.45233 59.4364 6.07737C59.0689 5.91031 58.6457 5.85091 58.2373 5.79151C56.6522 5.56876 55.0968 5.21607 53.5636 4.76314C53.3966 4.71488 53.3038 4.62949 53.2295 4.48842C52.8992 3.86472 52.5428 3.24473 52.0453 2.74354C50.3934 1.08034 48.3591 0.322988 46.1021 0C45.2186 0.037125 44.3313 0.0259874 43.4553 0.1188C41.9704 0.274725 40.5672 0.720226 39.3867 1.67434C38.8076 2.14211 38.1319 2.89575 37.5083 3.76819C37.5083 3.76819 36.5617 5.24577 36.1051 7.66632C35.6485 10.0869 30.585 30.1641 30.585 30.1641C30.5256 30.2792 30.5256 30.6282 30.2954 30.6838C29.8314 30.3349 26.6018 18.5551 25.9076 16.3536C25.3285 14.6161 23.1308 13.9813 21.4529 13.9813C18.3866 13.9813 17.2284 15.8338 16.1296 18.3806C13.8132 23.9382 12.7923 25.0594 10.6504 30.6727C10.591 30.7878 10.5353 31.1368 10.3014 31.1925C9.66662 30.6133 9.43275 16.606 9.43275 14.6978C9.43275 11.3417 8.67917 9.25898 4.80361 9.25898C1.2139 9.25898 0 10.8813 0 14.2931C0 15.8561 0.230158 17.4748 0.230158 19.0377C0.345237 26.563 0.579107 34.7231 2.42779 42.0144C3.29645 45.4856 4.28019 50 8.73486 50C13.1895 50 14.2327 45.6601 15.621 42.4748C17.5885 37.901 19.1513 33.2715 20.9444 28.642C21.0037 28.4675 21.1188 28.1779 21.349 28.1222C21.5235 28.2373 21.6385 28.4712 21.6979 28.7014C22.162 30.2049 22.5072 31.8273 22.9118 33.3903C23.5466 35.8776 24.3002 38.4244 25.0538 40.9155C25.9781 43.982 26.5572 49.0756 30.3771 49.8849C30.8411 50 31.3014 50 31.7655 50C36.1162 50 38.4735 45.5784 38.6182 45.3705C43.1286 38.9516 49.1498 15.0765 49.1498 15.0765L49.1535 15.0802Z" fill="#024B5E" />
          </svg>
        </Link>

        {/* Right Side - Navigation Links + User Section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/sitterdashboard"
              className="text-[#024B5E] hover:text-teal-600 transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/create-services"
              className="text-[#024B5E] hover:text-teal-600 transition font-medium"
            >
              Create service
            </Link>
            <Link
              href="/bookingHistory"
              className="text-[#024B5E] hover:text-teal-600 transition font-medium"
            >
              Bookings
            </Link>
          </div>

          {/* User Section */}
          {isAuthenticated ? (
            <div
              onClick={() => router.push('/settingForSitter')}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow"
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-base md:text-lg">
                  {displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg">
                Sign Up
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link
              href="/sitterdashboard"
              className="text-gray-700 hover:text-teal-600 transition font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/createOrder"
              className="text-gray-700 hover:text-teal-600 transition font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create service
            </Link>
            <Link
              href="/bookingHistory"
              className="text-gray-700 hover:text-teal-600 transition font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bookings
            </Link>
            {!isAuthenticated && (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-red-400 hover:bg-red-500 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
