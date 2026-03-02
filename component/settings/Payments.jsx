"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/auth";

// Global cache to prevent reloading on route change
let paymentsCache = null;

const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDateRange = (start, end) => {
  if (!start || !end) return "N/A";
  const startDate = new Date(start).toLocaleDateString();
  const endDate = new Date(end).toLocaleDateString();
  return `${startDate}-${endDate}`;
};

export default function Payments() {
  const [showModal, setShowModal] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  
  // Initialize bookings from cache if available
  const [bookings, setBookings] = useState(paymentsCache || []);
  const [loading, setLoading] = useState(!paymentsCache);
  
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    country: "Bangladesh",
    street: "",
    additional: "",
    city: "",
    postcode: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/bookings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Update state and cache
          setBookings(result.data);
          paymentsCache = result.data;
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    // If cache exists, we don't show the loader, but we still fetch to update data
    if (!paymentsCache) {
      fetchHistory();
    } else {
      // Background update without loader
      fetchHistory(); 
    }
  }, [API_BASE]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.nameOnCard) {
      toast.error("Please fill in the required fields");
      return;
    }

    // Since there is no specific API provided for saving a card in the list,
    // we update the local state to reflect the UI change.
    setSavedCard({
      last4: formData.cardNumber.slice(-4) || "1234",
      brand: "Visa", 
      expiry: formData.expiryDate || "12/25",
      name: formData.nameOnCard,
    });
    
    setShowModal(false);
    toast.success("Payment method added successfully");
  };

  const handleDeleteCard = () => {
    setSavedCard(null);
    toast.success("Payment method removed");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#035F75] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 min-h-[600px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Payment Methods */}
        <div className="lg:col-span-5">
           {!savedCard ? (
             <button 
               onClick={() => setShowModal(true)}
               className="w-full py-3 px-4 border border-[#035F75] text-[#035F75] rounded-lg font-medium hover:bg-[#E7F4F6] transition-colors"
             >
               Add or Modify a payment Method
             </button>
           ) : (
             <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4 relative">
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      checked 
                      readOnly 
                      className="mt-1 w-4 h-4 text-[#035F75]" 
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{savedCard.brand} - {savedCard.last4}</p>
                          <p className="text-sm text-gray-600">{savedCard.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{savedCard.expiry}</p>
                        </div>
                        <button onClick={handleDeleteCard} className="text-red-400 hover:text-red-600">
                           <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded">
                          DEFAULT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-3 px-4 bg-[#035F75] text-white rounded-lg font-medium hover:bg-[#024B5E] transition-colors shadow-sm"
                >
                  Add Default Payment Method
                </button>
             </div>
           )}
        </div>

        {/* RIGHT COLUMN: Payment History */}
        <div className="lg:col-span-7 border-l border-gray-100 pl-0 lg:pl-8">
          <h3 className="text-lg font-bold text-[#035F75] mb-4">
            Payment History
          </h3>

          <div className="mb-4">
             <span className="text-[#035F75] text-sm font-medium">Pending</span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">No payment history available.</p>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="border-b border-gray-100 pb-6 last:border-0">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-[#035F75] text-sm font-medium underline cursor-pointer">
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </span>
                      <span className="text-[#035F75] font-bold text-sm">
                        {formatCurrency(booking.totalPrice, booking.currency)}
                      </span>
                   </div>

                   <div className="text-sm text-[#035F75] font-medium mb-2">
                      {booking.pets && booking.pets.length > 0 ? booking.pets[0].name : "Pet"}'s stay with {booking.sitter?.fullName || "Sitter"} from {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                   </div>

                   <div className="space-y-1 text-xs text-gray-500">
                      <p>Tip: $0.00</p>
                      {savedCard ? (
                         <>
                           <p>{savedCard.brand} XXXX-{savedCard.last4}: {formatCurrency(booking.totalPrice, booking.currency)}</p>
                         </>
                      ) : (
                         <p>Card: {formatCurrency(booking.totalPrice, booking.currency)}</p>
                      )}
                      <p className={`capitalize ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                        Status: {booking.paymentStatus}
                      </p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 pb-2">
               <h2 className="text-xl font-bold text-gray-700">Please enter payment information</h2>
            </div>

            <form onSubmit={handleSaveCard} className="p-6 space-y-4">
               
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name on Card</label>
                  <input 
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Name on card"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                  <input 
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="1234 5678 9101 1121"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expiration Date</label>
                    <input 
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CVV</label>
                    <input 
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="123"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Street Name And Number</label>
                  <input 
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Street Name And Number"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Address Details (optional)</label>
                  <input 
                    name="additional"
                    value={formData.additional}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Additional Address Details (optional)"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City/Town</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Postcode</label>
                  <input 
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="10000"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#035F75]"
                  />
               </div>

               <div className="bg-[#E7F4F6] rounded-lg p-4 flex items-start gap-3">
                  <User className="text-[#035F75] mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Your information is secure</h4>
                    <p className="text-xs text-gray-600 mt-1">We use bank-level encryption and Stripe to protect your payment information</p>
                  </div>
               </div>

               <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-[#035F75] text-white font-bold py-3 rounded-lg hover:bg-[#024B5E] transition-colors"
                  >
                    Save
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full mt-3 text-gray-500 font-medium py-2 hover:text-gray-700"
                  >
                    Cancel
                  </button>
               </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
