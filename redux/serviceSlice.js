import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/lib/auth";

// Async thunk for saving boarding service
export const saveBoardingService = createAsyncThunk(
  "service/saveBoardingService",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().service;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    const mapPetSizes = (sizes) => {
      const map = {
        "Small dog (0-15 lbs)": "small",
        "Medium dog (16-40 lbs)": "medium",
        "Large dog (41-100 lbs)": "large",
        "Giant dog (100+ lbs)": "giant",
      };
      return sizes.map((s) => map[s]).filter(Boolean);
    };

    const payload = {
      serviceType: "boarding",
      rates: { base: Number(state.baseRate) },
      availability: {
        isHomeFullTime: state.timeType === "Yes",
        availableDays: state.selectedDays,
        timeSlots: state.selectedTimeSlots,
      },
      serviceArea: {
        useHomeAddress: state.useHomeAddress,
        location: state.location,
        radius: Number(state.serviceArea),
        distanceType: state.distanceType,
        travelModes: state.travelModes,
      },
      petPreferences: {
        allowedSizes: mapPetSizes(state.petSizes),
        puppiesUnderOneYear: state.acceptPuppies === "yes",
      },
      cancellationPolicy: state.cancellationPolicies,
    };

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/sitter/services/boarding`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err);
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  baseRate: "45.00",
  updateRates: true,
  showAdditionalRates: false,
  selectedDays: [],
  selectedTimeSlots: [],
  useHomeAddress: true,
  location: "1000, BD",
  distanceType: "Miles",
  timeType: "Yes",
  serviceArea: "0",
  travelModes: ["Walking"],
  petSizes: ["small"],
  acceptPuppies: "yes",
  cancellationPolicies: ["One day"],
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    toggleArrayField: (state, action) => {
      const { field, value } = action.payload;
      if (state[field].includes(value)) {
        state[field] = state[field].filter((v) => v !== value);
      } else {
        state[field].push(value);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBoardingService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBoardingService.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveBoardingService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Server error";
      });
  },
});

export const { setField, toggleArrayField } = serviceSlice.actions;
export default serviceSlice.reducer;
