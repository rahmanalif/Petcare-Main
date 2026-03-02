import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Terms and Conditions
export const fetchTermsAndConditions = createAsyncThunk(
  'setting/fetchTermsAndConditions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/content/terms-and-conditions`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch terms');
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Privacy Policy
export const fetchPrivacyPolicy = createAsyncThunk(
  'setting/fetchPrivacyPolicy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/content/privacy-policy`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch privacy policy');
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    termsAndConditions: null,
    privacyPolicy: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSettingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Terms and Conditions
      .addCase(fetchTermsAndConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermsAndConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.termsAndConditions = action.payload;
      })
      .addCase(fetchTermsAndConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Privacy Policy
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload;
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingError } = settingSlice.actions;
export default settingSlice.reducer;