import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSitterProfile = createAsyncThunk(
  "sitterProfile/fetchSitterProfile",
  async ({ sitterId, tab }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (tab) {
        params.set("tab", tab);
      }
      const queryString = params.toString();
      const url = `${API_BASE}/api/sitter/public/${sitterId}${queryString ? `?${queryString}` : ""}`;

      const response = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        return { data: result.data, tab: tab || null };
      } else {
        return rejectWithValue(result.message || "Failed to fetch sitter profile");
      }
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch sitter profile");
    }
  }
);

const sitterProfileSlice = createSlice({
  name: "sitterProfile",
  initialState: {
    profile: null,
    services: [],
    reviews: [],
    portfolio: [],
    stats: {},
    bookedDates: [],
    loading: false,
    error: null,
    lastLoadedTab: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.services = [];
      state.reviews = [];
      state.portfolio = [];
      state.stats = {};
      state.bookedDates = [];
      state.loading = false;
      state.error = null;
      state.lastLoadedTab = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSitterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSitterProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { data = {}, tab = null } = action.payload || {};
        const hasOwn = (key) => Object.prototype.hasOwnProperty.call(data, key);
        const portfolioData =
          data.portfolio ??
          data.portfolioImages ??
          data.profile?.portfolioImages;

        if (hasOwn("profile")) {
          state.profile = data.profile || null;
        }
        if (hasOwn("services")) {
          state.services = Array.isArray(data.services) ? data.services : [];
        }
        if (hasOwn("reviews")) {
          state.reviews = Array.isArray(data.reviews) ? data.reviews : [];
        }
        if (portfolioData !== undefined) {
          state.portfolio = Array.isArray(portfolioData) ? portfolioData : [];
        }
        if (hasOwn("stats")) {
          state.stats = data.stats || {};
        }
        if (hasOwn("bookedDates")) {
          state.bookedDates = Array.isArray(data.bookedDates) ? data.bookedDates : [];
        }
        state.lastLoadedTab = tab;
      })
      .addCase(fetchSitterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sitter profile";
      });
  },
});

export const { clearProfile } = sitterProfileSlice.actions;
export default sitterProfileSlice.reducer;
