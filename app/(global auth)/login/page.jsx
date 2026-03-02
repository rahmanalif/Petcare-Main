"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../../redux/authSlice';
import Link from 'next/link';
import Image from 'next/image';

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
  className = '',
  style = {}
}) => {
  const containerStyle = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
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

// Main Login Component
export default function WuffoosLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !role) return;

    if (role === 'sitter' || role === 'pet_sitter') {
      router.push('/sitterdashboard');
      return;
    }

    router.push('/');
  }, [isAuthenticated, role, router]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!formData.username || !formData.password) {
      const message = "Please enter both username/email and password.";
      dispatch(loginFailure(message));
      setErrorMessage(message);
      return;
    }

    dispatch(loginStart());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailOrPhone: formData.username,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(
        loginSuccess({
          user: {
            id: data._id,
            name: data.fullName,
            email: data.email,
            isBiometricEnabled: data.isBiometricEnabled,
          },
          role: data.role,
        })
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    } catch (error) {
      const message = "Unable to log in. Please check your credentials and try again.";
      dispatch(loginFailure(message));
      setErrorMessage(message);
    }
  };


  return (
    <>
      <style>{glassStyles}</style>
      <div className="min-h-screen flex">
        {/* Left Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-[#0C6478] flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold mb-3">
                Login to your account
              </h1>
              <p className="text-white/90 text-lg">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#FE6C5D] hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>

            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-left">
                <Link href="/forgotpassword" className="text-white/80 hover:text-white text-sm">
                  Forgot Password?
                </Link>
              </div>

              {errorMessage && (
                <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
                  {errorMessage}
                </p>
              )}

              {/* Login Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg bg-[#FE6C5D] hover:bg-[#ff7a6d] text-white font-semibold transition-colors shadow-lg"
              >
                Login
              </button>


              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white/60 text-sm">Or continue with</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Google Button with Glassmorphism */}
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
