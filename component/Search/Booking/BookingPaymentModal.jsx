"use client";

import { useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function BookingPaymentForm({ intentData, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
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
        throw new Error(error.message || "Payment failed. Please try again.");
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess?.("Booking confirmed and payment completed.");
        return;
      }

      throw new Error("Payment is processing. Please try again shortly.");
    } catch (error) {
      setErrorMessage(error?.message || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-[#D7EAF0] bg-white p-3">
        <PaymentElement />
      </div>

      <div className="rounded-xl border border-[#D7EAF0] bg-[#F7FCFD] p-4 text-sm text-[#024B5E]">
        <p className="font-semibold">
          Total: {intentData?.amount} {intentData?.currency}
        </p>
        {intentData?.breakdown?.platformFee !== undefined ? (
          <p>Platform Fee: {intentData.breakdown.platformFee}</p>
        ) : null}
        {intentData?.breakdown?.sitterShare !== undefined ? (
          <p>Sitter Share: {intentData.breakdown.sitterShare}</p>
        ) : null}
        {intentData?.breakdown?.note ? (
          <p className="mt-1 text-xs text-[#4A6B74]">{intentData.breakdown.note}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-[#024B5E]/30 px-4 py-3 text-sm font-medium text-[#024B5E] hover:bg-[#F2FAFC] sm:w-1/3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || submitting}
          className="w-full rounded-xl bg-[#FE6C5D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#f75f50] disabled:cursor-not-allowed disabled:opacity-70 sm:w-2/3"
        >
          {submitting ? "Processing..." : "Pay & Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

export default function BookingPaymentModal({
  open,
  intentData,
  onClose,
  onSuccess,
}) {
  if (!open) return null;

  const clientSecret = intentData?.clientSecret || "";
  const hasStripeConfig = Boolean(stripePromise);
  const canRenderPayment = hasStripeConfig && Boolean(clientSecret);

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]">
      <div className="w-full max-w-xl rounded-2xl border border-[#CFE6ED] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-[#024B5E]">Secure Payment</h3>
          <p className="text-sm text-[#4A6B74]">
            Complete payment to confirm your sitter booking.
          </p>
        </div>

        {!hasStripeConfig ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Stripe key is missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in `.env`.
          </p>
        ) : null}

        {hasStripeConfig && !clientSecret ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Payment session was not created. Please close and try booking again.
          </p>
        ) : null}

        {canRenderPayment ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#024B5E",
                  colorText: "#1F3C45",
                  borderRadius: "12px",
                },
              },
            }}
          >
            <BookingPaymentForm intentData={intentData} onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        ) : (
          <div className="mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-[#024B5E]/30 px-4 py-3 text-sm font-medium text-[#024B5E] hover:bg-[#F2FAFC]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
