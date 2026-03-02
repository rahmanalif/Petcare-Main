"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

function ReviewFeeCheckoutForm({ intentData }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setSubmitting(true);
      setErrorMessage("");

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      }

      if (paymentIntent?.status === "succeeded") {
        router.push("/verify-identity/documents");
        return;
      }

      setErrorMessage("Payment is processing. Please try again in a moment.");
    } catch (error) {
      setErrorMessage(error.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="rounded-xl bg-white p-4">
        <PaymentElement />
      </div>

      {intentData?.breakdown && (
        <div className="rounded-xl border border-white/25 bg-white/10 p-4 text-sm text-white/90">
          <p>Total: {intentData.amount} {intentData.currency}</p>
          <p>Platform Fee: {intentData.breakdown.platformFee}</p>
          <p>Taxes: {intentData.breakdown.taxes}</p>
          <p className="text-white/75">{intentData.breakdown.description}</p>
        </div>
      )}

      {errorMessage && (
        <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full rounded-xl bg-[#FE6C5D] px-5 py-4 text-center text-2xl font-medium text-white hover:bg-[#f1695a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Processing..." : "Pay & Continue"}
      </button>
    </form>
  );
}

export default function ReviewFeePage() {
  const [intentData, setIntentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  useEffect(() => {
    const raw = sessionStorage.getItem("reviewFeeIntent");
    if (!raw) {
      setErrorMessage("Payment session not found. Please go back and try again.");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed?.clientSecret) {
        setErrorMessage("Invalid payment session. Please retry.");
        return;
      }
      setIntentData(parsed);
    } catch {
      setErrorMessage("Invalid payment session. Please retry.");
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      <section className="w-full lg:w-1/2 bg-[#03586A] text-white p-4 sm:p-6 lg:p-10 flex items-center">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/verify-identity"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-3xl font-semibold">Profile Review Fee</h1>
          </div>

          {!publishableKey && (
            <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in frontend env.
            </p>
          )}

          {errorMessage && (
            <p className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              {errorMessage}
            </p>
          )}

          {intentData?.clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret: intentData.clientSecret }}>
              <ReviewFeeCheckoutForm intentData={intentData} />
            </Elements>
          )}
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
