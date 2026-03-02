"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../redux/authSlice";
import Link from "next/link";

// Glassmorphism styles embedded
const glassStyles = `
  .glass-surface {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.26s ease-out;
  }

  .glass-surface__content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: inherit;
    position: relative;
    z-index: 1;
  }

  .glass-surface--fallback {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);
    -webkit-backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow:
      0 8px 32px 0 rgba(31, 38, 135, 0.15),
      0 2px 16px 0 rgba(31, 38, 135, 0.1),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
  }

  .glass-surface--fallback:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @supports not (backdrop-filter: blur(10px)) {
    .glass-surface--fallback {
      background: rgba(255, 255, 255, 0.3);
      box-shadow:
        inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
    }
  }
`;

// GlassSurface Component
const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  className = "",
  style = {},
}) => {
  const containerStyle = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div
      className={`glass-surface glass-surface--fallback ${className}`}
      style={containerStyle}
    >
      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

// Main Register Component
export default function WuffoosRegister() {
  const allowedReferralSources = [
    "Facebook",
    "Instagram",
    "LinkedIn",
    "Twitter",
    "YouTube",
    "TikTok",
    "Other",
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [userRole, setUserRole] = useState('pet_owner'); // Default to pet owner
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    referralSource: "",
  });


  // Check URL parameter for role
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'pet_sitter' || roleParam === 'sitter') {
      setUserRole('sitter');
    }
    if (roleParam === 'pet_owner' || roleParam === 'owner') {
      setUserRole('pet_owner');
    }
  }, [searchParams]);

 const handleSubmit = async () => {
  setErrorMessage("");

  if (!acceptTerms || !acceptPrivacy) {
    setErrorMessage("Please accept the Terms and Privacy Policy.");
    return;
  }

  if (!formData.password) {
    setErrorMessage("Password is required.");
    return;
  }

  if (!formData.referralSource) {
    setErrorMessage("Please select how you heard about us.");
    return;
  }

  dispatch(loginStart());

  try {
    if (!allowedReferralSources.includes(formData.referralSource)) {
      setErrorMessage("Please select a valid referral source.");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      language: selectedLanguage === "spanish" ? "Spanish" : "English",
      referralSource: formData.referralSource,
      role: userRole,
      acceptPrivacy,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 refresh token cookie
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    //  Save access token + user
    dispatch(
      loginSuccess({
        user: {
          id: data._id,
          name: data.fullName,
          email: data.email,
          role: data.role,
        },
        role: data.role,
      })
    );

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    // Redirect to email verification after registration
    const verifiedEmail = data.email || formData.email;
    const verifiedRole = data.role || userRole;
    router.push(
      `/verify-email?email=${encodeURIComponent(verifiedEmail)}&role=${encodeURIComponent(verifiedRole)}`
    );

  } catch (error) {
    const message = "Unable to create your account. Please try again.";
    dispatch(loginFailure(message));
    setErrorMessage(message);
  }
};


  return (
    <>
      <style>{glassStyles}</style>
      <div className="min-h-screen flex">
        {/* Left Panel - Register Form */}
        <div className="w-full lg:w-1/2 bg-[#0C6478] flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold mb-3">
                Create your account
              </h1>
              <p className="text-white/90 text-lg">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#FE6C5D] hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>

            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Enter Your Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errorMessage) setErrorMessage("");
                    }
                  }
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Enter your e-mail address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    {
                      setFormData({ ...formData, email: e.target.value });
                      if (errorMessage) setErrorMessage("");
                    }
                  }
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* phone number */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Enter your phone number
                </label>
                <input
                  type="text"
                  placeholder="+880..."
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    {
                      setFormData({ ...formData, phoneNumber: e.target.value });
                      if (errorMessage) setErrorMessage("");
                    }
                  }
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Select your role
                </label>
                <select
                  value={userRole}
                  onChange={(e) => {
                    setUserRole(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white focus:outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                  }}
                >
                  <option value="pet_owner" className="bg-[#0C6478] text-white">
                    Pet Owner
                  </option>
                  <option value="sitter" className="bg-[#0C6478] text-white">
                    Pet Sitter
                  </option>
                </select>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      {
                        setFormData({ ...formData, password: e.target.value });
                        if (errorMessage) setErrorMessage("");
                      }
                    }
                    className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Select your comfortable language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage('english')}
                    className={`border-2 rounded-lg px-4 py-3 cursor-pointer flex items-center justify-center font-montserrat font-medium text-white transition-all ${selectedLanguage === 'english'
                        ? 'bg-[#FE6C5D] border-[#e96456]'
                        : 'bg-white/10 border-white/30 hover:border-white/50'
                      }`}
                  >
                    <span className="m-2">
                      <img src="/flag/usa.png" alt="English" className="w-8 h-8" />
                    </span>
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage('spanish')}
                    className={`border-2 rounded-lg px-4 py-3 cursor-pointer flex items-center justify-center font-montserrat font-medium text-white transition-all ${selectedLanguage === 'spanish'
                        ? 'bg-[#FE6C5D] border-[#e96456]'
                        : 'bg-white/10 border-white/30 hover:border-white/50'
                      }`}
                  >
                    <span className="m-2">
                      <img src="/flag/Mexico.png" alt="Spanish" className="w-8 h-8" />
                    </span>
                    Spanish
                  </button>
                </div>
              </div>

              {/* How did you hear about us */}
              <div>
                <label className="block text-white text-sm mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => {
                    setFormData({ ...formData, referralSource: e.target.value });
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white focus:outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                  }}
                >
                  <option value="" className="bg-[#0C6478] text-white">Select an option</option>
                  <option value="Facebook" className="bg-[#0C6478] text-white">Facebook</option>
                  <option value="Instagram" className="bg-[#0C6478] text-white">Instagram</option>
                  <option value="Twitter" className="bg-[#0C6478] text-white">Twitter</option>
                  <option value="TikTok" className="bg-[#0C6478] text-white">TikTok</option>
                  <option value="YouTube" className="bg-[#0C6478] text-white">YouTube</option>
                  <option value="LinkedIn" className="bg-[#0C6478] text-white">LinkedIn</option>
                  <option value="Other" className="bg-[#0C6478] text-white">Other</option>
                </select>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-transparent accent-[#FE6C5D]"
                />
                <label htmlFor="terms" className="text-white/80 text-sm">
                  <Link href="/terms" className="text-white underline hover:text-white/90">
                    Terms & condition
                  </Link>
                </label>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={acceptPrivacy}
                  onChange={(e) => {
                    setAcceptPrivacy(e.target.checked);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-transparent accent-[#FE6C5D]"
                />
                <label htmlFor="privacy" className="text-white/80 text-sm">
                  <Link href="/privacy" className="text-white underline hover:text-white/90">
                    Privacy Policy
                  </Link>{" "}
                </label>
              </div>

              {errorMessage && (
                <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
                  {errorMessage}
                </p>
              )}

              {/* Register Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg bg-[#FE6C5D] hover:bg-[#ff7a6d] text-white font-semibold transition-colors shadow-lg"
              >
                Sign Up
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white/60 text-sm">Or continue with</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google Button */}
                <GlassSurface
                  width="100%"
                  height={56}
                  borderRadius={8}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <button
                    type="button"
                    className="w-full h-full flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <span><img src="/flag/g.png" alt="Google" className="w-6 h-6 " /></span>
                    Google
                  </button>
                </GlassSurface>

                {/* Apple Button */}
                <GlassSurface
                  width="100%"
                  height={56}
                  borderRadius={8}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <button
                    type="button"
                    className="w-full h-full flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <span><img src="/flag/a.png" alt="Google" className="w-6 h-6 " /></span>
                    Apple
                  </button>
                </GlassSurface>

                {/* Facebook Button */}
                <GlassSurface
                  width="100%"
                  height={56}
                  borderRadius={8}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <button
                    type="button"
                    className="w-full h-full flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <span><img src="/flag/f.png" alt="Google" className="w-6 h-6 " /></span>
                    Facebook
                  </button>
                </GlassSurface>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Logo */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
          <div className="max-w-lg">
            < img src="/wuffoosFinal.png" />
          </div>
        </div>
      </div>
    </>
  );
}

