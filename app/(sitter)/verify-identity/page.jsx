"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const steps = [
  {
    id: "fee",
    title: "Profile Review fee ($199 MXN)",
    description:
      "Save a payment card for a one-time fee that goes towards our quality assurance process and is non-refundable.",
  },
  {
    id: "background",
    title: "Authorize a background check",
    description:
      "A quick and essential step that all providers pass to be part of Wuffoos and build trust with clients. We will charge your card after completing this step.",
  },
  {
    id: "submit",
    title: "Submit your profile",
    description:
      "With these two steps completed you're ready to submit your profile. We'll review it within 5 business days.",
  },
];

export default function VerifyIdentityPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = async () => {
    const userId = user?.id || user?._id;

    if (!userId) {
      setErrorMessage("User not found. Please login again.");
      return;
    }

    try {
      setLoadingIntent(true);
      setErrorMessage("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/${userId}/create-review-fee-intent`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to initialize review fee payment");
      }

      sessionStorage.setItem("reviewFeeIntent", JSON.stringify(data));
      router.push("/verify-identity/review-fee");
    } catch (error) {
      setErrorMessage(error.message || "Failed to initialize review fee payment");
    } finally {
      setLoadingIntent(false);
    }
  };

  const renderEyeIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9998 20.27C15.5298 20.27 18.8198 18.19 21.1098 14.59C22.0098 13.18 22.0098 10.81 21.1098 9.39997C18.8198 5.79997 15.5298 3.71997 11.9998 3.71997C8.46984 3.71997 5.17984 5.79997 2.88984 9.39997C1.98984 10.81 1.98984 13.18 2.88984 14.59C5.17984 18.19 8.46984 20.27 11.9998 20.27Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex">
      <section className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-10 bg-[#03586A] text-white flex items-center">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-transparent text-white rounded-b-4xl px-5 py-6 flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Back to signup"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-3xl font-semibold">Verify identity</h1>
          </div>

          <div className="pt-6 space-y-7 text-white">
            {steps.map((step) => (
              <article key={step.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  {step.id === "submit" ? (
                    <FileText size={22} className="shrink-0" />
                  ) : (
                    renderEyeIcon()
                  )}
                  <h2
                    className={`font-medium leading-tight ${
                      step.id === "submit"
                        ? "text-[1.5rem] sm:text-[1.7rem]"
                        : "text-[1.3rem] sm:text-[1.6rem] whitespace-nowrap"
                    }`}
                  >
                    {step.title}
                  </h2>
                </div>
                <p className="pl-9 text-[1.25rem] leading-snug text-white/80">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          {errorMessage && (
            <p className="mt-6 rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={loadingIntent}
            className="mt-8 block w-full rounded-xl bg-[#FE6C5D] px-5 py-4 text-center text-3xl font-medium text-[#e2e2e2] hover:bg-[#f1695a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingIntent ? "Loading..." : "Continue"}
          </button>
        </div>
      </section>

      <section className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
        <div className="max-w-lg">
          <img src="/wuffoosFinal.png" alt="Wuffoos logo" />
        </div>
      </section>
    </div>
  );
}
