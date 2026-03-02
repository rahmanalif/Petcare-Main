"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Main Reset Password Component
export default function WuffoosResetPassword() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    recoveryCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Demo - replace with actual API call
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Password changed successfully!');
      router.push('/login');
    } catch (error) {
      alert('Failed to change password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Reset Password Form */}
      <div className="w-full lg:w-1/2 bg-[#0C6478] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-3">
              Recover Account
            </h1>
            <p className="text-white/90 text-lg">
              Enter your email and we will send you a recovery code
            </p>
          </div>

          <div className="space-y-5">
            {/* Recovery Code Field */}
            <div>
              <label className="block text-white text-sm mb-2">
                Recovery Code
              </label>
              <input
                type="text"
                placeholder="Recovery Code"
                value={formData.recoveryCode}
                onChange={(e) => setFormData({...formData, recoveryCode: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-white text-sm mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Set New Password Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-[#FE6C5D] hover:bg-[#ff7a6d] text-white font-semibold transition-colors shadow-lg"
            >
              Set New Password
            </button>

            {/* Back To Login Link */}
            <div className="text-center pt-4">
              <Link href="/login" className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back To Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
        <div className="max-w-lg">
          < img src = "/wuffoosFinal.png" />
        </div>
      </div>
    </div>
  );
}