import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const toApiDate = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!mdy) return raw;

  const mm = mdy[1].padStart(2, "0");
  const dd = mdy[2].padStart(2, "0");
  const yyyy = mdy[3];
  return `${yyyy}-${mm}-${dd}`;
};

const toApiTime = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  const upper = raw.toUpperCase().replace(/\s+/g, "");

  const withMeridiem = (h, m, suffix) => `${h}:${m} ${suffix}`;

  // 11:00am / 11:00AM -> 11:00 AM
  const amPm = upper.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (amPm) {
    const h = String(Number(amPm[1]));
    const m = amPm[2];
    const suffix = amPm[3];
    return withMeridiem(h, m, suffix);
  }

  // 23:15 -> 11:15PM
  const twentyFour = upper.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    const hour = Number(twentyFour[1]);
    const minute = twentyFour[2];
    if (hour >= 0 && hour <= 23) {
      const suffix = hour >= 12 ? "PM" : "AM";
      const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
      return withMeridiem(String(twelveHour), minute, suffix);
    }
  }

  return upper;
};

export const searchBoardingSitters = createAsyncThunk(
  "boardingSearch/searchBoardingSitters",
  async (payload, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.set("serviceType", "boarding");

      const {
        startDate,
        endDate,
        startTime,
        endTime,
        lat,
        lng,
        lookingFor,
        filters = {},
      } = payload || {};

      const normalizedStart = toApiDate(startDate);
      const normalizedEnd = toApiDate(endDate);
      const normalizedStartTime = toApiTime(startTime);
      const normalizedEndTime = toApiTime(endTime);

      if (normalizedStart) params.set("startDate", normalizedStart);
      if (normalizedEnd) params.set("endDate", normalizedEnd);
      if (normalizedStartTime) params.set("startTime", normalizedStartTime);
      if (normalizedEndTime) params.set("endTime", normalizedEndTime);

      if (typeof lat === "number" && Number.isFinite(lat)) {
        params.set("lat", String(lat));
      }
      if (typeof lng === "number" && Number.isFinite(lng)) {
        params.set("lng", String(lng));
      }

      if (lookingFor) {
        params.set("lookingFor", lookingFor);
      }

      const booleanFilters = [
        "isHomeFullTime",
        "hasFencedGarden",
        "petsAllowedOnFurniture",
        "noSmokingHome",
        "doesntOwnDogs",
        "doesntOwnCats",
        "acceptsOnlyOneBooking",
        "doesNotOwnCagedPets",
        "noChildren",
        "noChildren0to5",
        "noChildren6to12",
        "acceptsNonSpayedFemale",
        "acceptsNonNeuteredMale",
        "canDoBathingGrooming",
        "certifiedFirstAid",
      ];

      booleanFilters.forEach((key) => {
        if (filters[key] === true) {
          params.set(key, "true");
        }
      });

      const response = await fetchWithAuth(
        `${API_BASE}/api/sitter/search?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result?.message || "Boarding search failed");
      }

      if (Array.isArray(result)) {
        return result;
      }
      if (Array.isArray(result?.data)) {
        return result.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error?.message || "Boarding search failed");
    }
  }
);

const boardingSearchSlice = createSlice({
  name: "boardingSearch",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchBoardingSitters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBoardingSitters.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchBoardingSitters.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload || "Boarding search failed";
      });
  },
});

export default boardingSearchSlice.reducer;
