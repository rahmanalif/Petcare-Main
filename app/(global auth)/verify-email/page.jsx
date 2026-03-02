"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "owner";
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyEmail = async () => {
    if (!email) {
      setErrorMessage("Email not found. Please register again.");
      return;
    }

    if (!otp.trim()) {
      setErrorMessage("Please enter verification code");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to verify email");
      }

      if (role === "sitter" || role === "pet_sitter") {
        router.push("/verify-identity");
      } else {
        router.push("/");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to verify email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 bg-[#0C6478] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-3">Verify Email</h1>
            <p className="text-white/90 text-lg">
              Enter the verification code sent to your email
            </p>
            {email && <p className="text-white/70 text-sm mt-2">{email}</p>}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-2">Verification Code</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleVerifyEmail}
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#FE6C5D] hover:bg-[#ff7a6d] disabled:opacity-70 text-white font-semibold transition-colors shadow-lg"
            >
              {submitting ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center pt-1">
              <Link
                href="/signup"
                className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
        <div className="max-w-lg">
          <img src="/wuffoosFinal.png" alt="Wuffoos logo" />
        </div>
      </div>
    </div>
  );
}
