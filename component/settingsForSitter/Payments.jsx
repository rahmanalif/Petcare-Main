"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSitterProfile } from "@/redux/sitter/sitterSlice";
import { createConnectAccount, fetchOnboardingLink, fetchEarningsHistory } from "@/redux/sitter/paymentSlice";
import { Loader2, ExternalLink, CheckCircle, Trash2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Payments() {
  const dispatch = useDispatch();

  const { profile: sitterData, loading } = useSelector((state) => state.sitter);
  const { loading: paymentLoading, earningsLoading, earningsHistory, error } = useSelector((state) => state.payment);

  const [showModal, setShowModal] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    name: "", cardNumber: "", expiry: "", cvv: "",
    country: "Bangladesh", street: "", addressExtra: "", city: "", postcode: "",
  });

  useEffect(() => {
    if (!sitterData) dispatch(fetchSitterProfile());
    dispatch(fetchEarningsHistory());
  }, [dispatch]);

  // ✅ sitterData.profile থেকে isStripeOnboardingComplete নেওয়া
  const isStripeConnected = sitterData?.profile?.isStripeOnboardingComplete === true;

  const handleSetupPayouts = async () => {
    try {
      // ✅ প্রথমে onboarding-link চেষ্টা করো (account আগে থেকে থাকলে)
      const linkAction = await dispatch(fetchOnboardingLink());
      if (fetchOnboardingLink.fulfilled.match(linkAction)) {
        const url = linkAction.payload.url || linkAction.payload.data?.url;
        if (url) { window.location.href = url; return; }
      }

      // ✅ onboarding-link fail হলে নতুন account create করো
      const createAction = await dispatch(createConnectAccount());
      if (createConnectAccount.fulfilled.match(createAction)) {
        const url = createAction.payload.url || createAction.payload.data?.url;
        if (url) { window.location.href = url; return; }
      }
    } catch (err) {
      console.error("Failed to initiate stripe connect", err);
    }
  };

  const handleCardFormChange = (e) => {
    const { id, value } = e.target;
    if (id === "cardNumber") {
      const formatted = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
      setCardForm((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }
    if (id === "expiry") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
      setCardForm((prev) => ({ ...prev, expiry: formatted }));
      return;
    }
    if (id === "cvv") {
      setCardForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, "").slice(0, 3) }));
      return;
    }
    setCardForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveCard = () => {
    const digits = cardForm.cardNumber.replace(/\s/g, "");
    if (!cardForm.name || digits.length < 16 || !cardForm.expiry || !cardForm.cvv) return;
    setSavedCard({ name: cardForm.name, last4: digits.slice(-4), expiry: cardForm.expiry, brand: "Visa" });
    setShowModal(false);
    setCardForm({ name: "", cardNumber: "", expiry: "", cvv: "", country: "Bangladesh", street: "", addressExtra: "", city: "", postcode: "" });
  };

  // ✅ API থেকে আসা earnings — status দিয়ে group করা
  const pendingEarnings = earningsHistory?.filter((e) => e.status === "pending") || [];
  const completedEarnings = earningsHistory?.filter((e) => e.status === "completed") || [];

  if (loading && !sitterData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#035F75]" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Payments</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Column — Payment Methods + Stripe */}
          <div className="space-y-6">

            {/* Card Section */}
            {savedCard ? (
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full border-2 border-[#035F75] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#035F75]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{savedCard.brand} - {savedCard.last4}</p>
                      <p className="text-gray-600 text-sm">{savedCard.name}</p>
                      <p className="text-gray-600 text-sm">{savedCard.expiry}</p>
                      <span className="mt-1 inline-block text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5">DEFAULT</span>
                    </div>
                  </div>
                  <button onClick={() => setSavedCard(null)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => setShowModal(true)} className="w-full px-6 py-3 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024c5d] transition-colors text-sm">
                  Add Default Payment Method
                </button>
              </div>
            ) : (
              <button onClick={() => setShowModal(true)} className="w-full px-6 py-3 border-2 border-[#035F75] text-[#035F75] rounded-lg font-medium hover:bg-[#E7F4F6] transition-colors text-sm">
                Add or Modify a payment Method
              </button>
            )}

            {/* Stripe */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payout Configuration</h3>
              {isStripeConnected ? (
                <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Bank Account Connected</p>
                    <p className="text-xs text-green-600 mt-0.5">Your payouts are set up and ready.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-3">
                    To receive payments, please connect your bank account via Stripe.
                  </p>
                  <button
                    onClick={handleSetupPayouts}
                    disabled={paymentLoading}
                    className="w-full px-6 py-3 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024c5d] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <>Setup Payouts (Stripe Connect) <ExternalLink className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Payment History from API */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Payment History</h3>

            {earningsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6 text-[#035F75]" />
              </div>
            ) : earningsHistory?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No payment history yet.</p>
            ) : (
              <>
                {/* Pending */}
                {pendingEarnings.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[#035F75] font-medium text-sm mb-3">Pending</p>
                    <div className="space-y-4">
                      {pendingEarnings.map((item) => (
                        <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[#035F75] font-medium text-xs">{item.dateRange}</span>
                            <span className="text-base font-semibold text-gray-900">${item.amount?.toFixed(2)}</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-900 mb-1">{item.description}</p>
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">Pending</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedEarnings.length > 0 && (
                  <div>
                    <p className="text-[#035F75] font-medium text-sm mb-3">Completed</p>
                    <div className="space-y-4">
                      {completedEarnings.map((item) => (
                        <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[#035F75] font-medium text-xs">{item.dateRange}</span>
                            <span className="text-base font-semibold text-gray-900">${item.amount?.toFixed(2)}</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-900 mb-1">{item.description}</p>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Completed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-900 mb-5">
              Please enter payment information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm text-gray-700">Name on Card</Label>
                <Input id="name" placeholder="Name on card" value={cardForm.name} onChange={handleCardFormChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cardNumber" className="text-sm text-gray-700">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9101 1121" value={cardForm.cardNumber} onChange={handleCardFormChange} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry" className="text-sm text-gray-700">Expiration Date</Label>
                  <Input id="expiry" placeholder="MM/YY" value={cardForm.expiry} onChange={handleCardFormChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm text-gray-700">CVV</Label>
                  <Input id="cvv" placeholder="123" value={cardForm.cvv} onChange={handleCardFormChange} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="country" className="text-sm text-gray-700">Country</Label>
                <select
                  id="country"
                  value={cardForm.country}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, country: e.target.value }))}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option>Bangladesh</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>
              <div>
                <Label htmlFor="street" className="text-sm text-gray-700">Street Name And Number</Label>
                <Input id="street" placeholder="Street Name And Number" value={cardForm.street} onChange={handleCardFormChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="addressExtra" className="text-sm text-gray-700">Additional Address Details (optional)</Label>
                <Input id="addressExtra" placeholder="Additional Address Details (optional)" value={cardForm.addressExtra} onChange={handleCardFormChange} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city" className="text-sm text-gray-700">City/Town</Label>
                  <Input id="city" placeholder="City" value={cardForm.city} onChange={handleCardFormChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="postcode" className="text-sm text-gray-700">Postcode</Label>
                  <Input id="postcode" placeholder="10000" value={cardForm.postcode} onChange={handleCardFormChange} className="mt-1" />
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#E7F4F6] rounded-lg p-3">
                <ShieldCheck className="w-8 h-8 text-[#035F75] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Your information is secure</p>
                  <p className="text-xs text-gray-500 mt-0.5">We use bank-level encryption and Stripe to protect your payment information</p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveCard} className="flex-1 px-4 py-3 bg-[#035F75] text-white rounded-lg font-medium text-sm hover:bg-[#024c5d] transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}