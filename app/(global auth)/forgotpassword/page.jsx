"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Main Recovery Component
export default function WuffoosRecovery() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      alert(data.message); // "Reset code sent to email"
      router.push(`/verifycode?email=${encodeURIComponent(email)}`);

    } catch (error) {
      alert(error.message || 'Failed to send recovery email');
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Recovery Form */}
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

          <div className="space-y-6">
            {/* Email Address Field */}
            <div>
              <label className="block text-white text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
            </div>

            {/* Send Recovery Email Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-[#FE6C5D] hover:bg-[#ff7a6d] text-white font-semibold transition-colors shadow-lg"
            >
              Send Recovery Email
            </button>

            {/* Back Link */}
            <div className="text-center pt-4">
              <Link href="/login" className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Login
              </Link>
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
  );
}
