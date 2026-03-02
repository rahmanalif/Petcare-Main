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

  const amPm = upper.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (amPm) {
    const h = String(Number(amPm[1]));
    const m = amPm[2];
    const suffix = amPm[3];
    return withMeridiem(h, m, suffix);
  }

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

const toWeekdays = (selectedDays = {}) => {
  const map = {
    M: "Mon",
    T: "Tue",
    W: "Wed",
    T2: "Thu",
    F: "Fri",
    S: "Sat",
  };

  return Object.entries(selectedDays)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => map[key])
    .filter(Boolean);
};

export const searchDaycareSitters = createAsyncThunk(
  "daycareSearch/searchDaycareSitters",
  async (payload, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.set("serviceType", "daycare");

      const {
        schedule,
        selectedDays,
        startDate,
        endDate,
        startTime,
        endTime,
        lat,
        lng,
        radius,
        lookingFor,
        filters = {},
      } = payload || {};

      // Day care type
      if (filters.atSittersFacility) {
        params.set("dayCareType", "local_facility");
      } else {
        params.set("dayCareType", "in_sitter_home");
      }

      const isRepeat = schedule === "repeatWeekly";
      params.set("scheduleType", isRepeat ? "repeat_weekly" : "one_time");

      const normalizedStart = toApiDate(startDate);
      const normalizedEnd = toApiDate(endDate);
      const normalizedStartTime = toApiTime(startTime);
      const normalizedEndTime = toApiTime(endTime);

      if (normalizedStart) params.set("startDate", normalizedStart);
      if (normalizedEnd) params.set("endDate", normalizedEnd);

      if (isRepeat) {
        const days = toWeekdays(selectedDays);
        if (days.length > 0) {
          params.set("daysOfWeek", days.join(","));
        }
      } else {
        if (normalizedStartTime) params.set("startTime", normalizedStartTime);
        if (normalizedEndTime) params.set("endTime", normalizedEndTime);
      }

      if (typeof lat === "number" && Number.isFinite(lat)) {
        params.set("lat", String(lat));
      }
      if (typeof lng === "number" && Number.isFinite(lng)) {
        params.set("lng", String(lng));
      }
      if (typeof radius === "number" && Number.isFinite(radius)) {
        params.set("radius", String(radius));
      }
      if (lookingFor) {
        params.set("lookingFor", lookingFor);
      }

      const booleanFilters = {
        isHomeFullTime: Boolean(filters.sitterHomeFullTime || filters.otherAtHomeFullTime),
        hasFencedGarden: filters.hasFencedGarden === true,
        petsAllowedOnFurniture: filters.petsAllowedOnFurniture === true,
        noSmokingHome: filters.noSmokingHome === true,
        doesntOwnDogs: filters.doesntOwnDogs === true,
        doesntOwnCats: filters.doesntOwnCats === true,
        acceptsOnlyOneBooking: filters.onlyOneBooking === true,
        doesNotOwnCagedPets: filters.doesntOwnCagedPets === true,
        noChildren: filters.hasNoChildren === true,
        noChildren0to5: filters.hasNoChildren0to3 === true,
        noChildren6to12: filters.hasNoChildren6to12 === true,
        acceptsNonSpayedFemale: filters.acceptsNonSpayed === true,
        acceptsNonNeuteredMale: filters.acceptsNonNeutered === true,
        canDoBathingGrooming: filters.bathingGrooming === true,
        certifiedFirstAid: filters.dogFirstAid === true,
      };

      Object.entries(booleanFilters).forEach(([key, enabled]) => {
        if (enabled) {
          params.set(key, "true");
        }
      });

      // Property type filters
      if (!filters.allTypes) {
        if (filters.home) params.set("isHouse", "true");
        if (filters.flats) params.set("isApartment", "true");
      }

      const response = await fetchWithAuth(
        `${API_BASE}/api/sitter/search?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result?.message || "Day care search failed");
      }

      if (Array.isArray(result)) return result;
      if (Array.isArray(result?.data)) return result.data;
      return [];
    } catch (error) {
      return rejectWithValue(error?.message || "Day care search failed");
    }
  }
);

const daycareSearchSlice = createSlice({
  name: "daycareSearch",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchDaycareSitters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDaycareSitters.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchDaycareSitters.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload || "Day care search failed";
      });
  },
});

export default daycareSearchSlice.reducer;
