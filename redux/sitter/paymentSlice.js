import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 1. Create Stripe Connect Account (নতুন account)
export const createConnectAccount = createAsyncThunk(
  'payment/createConnectAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/create-connect-account`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create connect account");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Get Onboarding Link (account আছে কিন্তু onboarding incomplete)
export const fetchOnboardingLink = createAsyncThunk(
  'payment/fetchOnboardingLink',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/onboarding-link`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to get onboarding link");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Sync Connect Status
export const syncConnectStatus = createAsyncThunk(
  'payment/syncConnectStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/sync-connect-status`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to sync status");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Reset Connect Account
export const resetConnectAccount = createAsyncThunk(
  'payment/resetConnectAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/reset-connect-account`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to reset account");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Create Booking Intent
export const createBookingIntent = createAsyncThunk(
  'payment/createBookingIntent',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/create-booking-intent`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create payment intent");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 6. Fetch Earnings History
export const fetchEarningsHistory = createAsyncThunk(
  'payment/fetchEarningsHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/earnings`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch earnings");
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    stripeConnected: false,
    stripeOnboardingUrl: null,
    earningsHistory: [],
    earningsLoading: false,
    loading: false,
    error: null,
    paymentHistory: [],
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Connect Account
      .addCase(createConnectAccount.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createConnectAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeOnboardingUrl = action.payload.url || action.payload.data?.url;
      })
      .addCase(createConnectAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Onboarding Link
      .addCase(fetchOnboardingLink.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOnboardingLink.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeOnboardingUrl = action.payload.url || action.payload.data?.url;
      })
      .addCase(fetchOnboardingLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sync Status
      .addCase(syncConnectStatus.pending, (state) => { state.loading = true; })
      .addCase(syncConnectStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeConnected = action.payload.isConnected || action.payload.data?.isConnected;
      })
      .addCase(syncConnectStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Earnings History
      .addCase(fetchEarningsHistory.pending, (state) => { state.earningsLoading = true; })
      .addCase(fetchEarningsHistory.fulfilled, (state, action) => {
        state.earningsLoading = false;
        state.earningsHistory = action.payload;
      })
      .addCase(fetchEarningsHistory.rejected, (state, action) => {
        state.earningsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;