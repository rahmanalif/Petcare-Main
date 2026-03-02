import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  if (!token) console.warn("⚠️ Warning: No token found in localStorage!");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// 1. Fetch Sitter Profile
export const fetchSitterProfile = createAsyncThunk(
  'sitter/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch profile");
      return result.data; // { profile: {...}, earnings: {...} }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Update Sitter Profile Info
export const updateSitterProfile = createAsyncThunk(
  'sitter/updateProfile',
  async (sitterData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(sitterData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Update Sitter Profile Image
export const updateSitterImage = createAsyncThunk(
  'sitter/updateImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await fetch(`${API_URL}/api/sitter/profile-image`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Image upload failed");
      return result.profilePicture || result.data?.profilePicture || result.url;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Change Password
export const changeSitterPassword = createAsyncThunk(
  'sitter/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/change-password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Password change failed");
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Upload Portfolio Image
// ✅ Step 1: Generic upload → path পাও
// ✅ Step 2: existing portfolioImages + new path → PUT /api/sitter/profile
export const uploadPortfolioImage = createAsyncThunk(
  'sitter/uploadPortfolioImage',
  async (file, { rejectWithValue, getState }) => {
    try {
      // Step 1: Generic upload করো
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadResult.message || "Image upload failed");

      // Server যে path/URL return করে সেটা নাও
      const newImagePath = uploadResult.data?.url || uploadResult.url || uploadResult.secure_url || uploadResult.path;
      if (!newImagePath) throw new Error("Did not receive image path from server");

      // Step 2: existing portfolioImages নাও Redux state থেকে
      const currentProfile = getState().sitter.profile?.profile;
      const existingImages = currentProfile?.portfolioImages || [];

      // Step 3: PUT /api/sitter/profile with updated portfolioImages array
      const updateResponse = await fetch(`${API_URL}/api/sitter/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          portfolioImages: [...existingImages, newImagePath],
        }),
      });

      const updateResult = await updateResponse.json();
      if (!updateResponse.ok) throw new Error(updateResult.message || "Failed to update portfolio");

      return newImagePath; // ✅ নতুন image path return করো
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 6. Delete Portfolio Image
// ✅ existing array থেকে সেই path বাদ দিয়ে PUT করো
export const deletePortfolioImage = createAsyncThunk(
  'sitter/deletePortfolioImage',
  async (imagePath, { rejectWithValue, getState }) => {
    try {
      const currentProfile = getState().sitter.profile?.profile;
      const existingImages = currentProfile?.portfolioImages || [];

      // সেই path বাদ দাও
      const updatedImages = existingImages.filter((img) => img !== imagePath);

      const response = await fetch(`${API_URL}/api/sitter/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ portfolioImages: updatedImages }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Delete failed");

      return imagePath; // ✅ কোন path delete হলো সেটা return করো
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 7. Fetch Service Settings
export const fetchServiceSettings = createAsyncThunk(
  'sitter/fetchServiceSettings',
  async (serviceType, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/services/${serviceType}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch service");
      return { serviceType, data: result.data || result }; // ✅ এই line
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 8. Update Service Settings
export const updateServiceSettings = createAsyncThunk(
  'sitter/updateServiceSettings',
  async ({ serviceType, serviceData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/services/${serviceType}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update service");
      return { serviceType, data: result.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 9. Fetch Public Sitter Profile by ID
export const fetchPublicSitterProfile = createAsyncThunk(
  'sitter/fetchPublicProfile',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/sitter/public/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch public profile");
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sitterSlice = createSlice({
  name: 'sitter',
  initialState: {
    profile: null,
    publicProfile: null,
    services: {}, // { boarding: {...}, doggyDayCare: {...}, dogWalking: {...} }
    servicesLoading: false,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    clearSitterError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchSitterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSitterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // { profile: {...}, earnings: {...} }
      })
      .addCase(fetchSitterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile Info
      .addCase(updateSitterProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSitterProfile.fulfilled, (state, action) => {
        state.updating = false;
        if (state.profile?.profile) {
          state.profile.profile = { ...state.profile.profile, ...action.payload };
        }
      })
      .addCase(updateSitterProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Update Profile Image
      .addCase(updateSitterImage.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSitterImage.fulfilled, (state, action) => {
        state.updating = false;
        if (state.profile?.profile) {
          state.profile.profile.profilePicture = action.payload;
        }
      })
      .addCase(updateSitterImage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changeSitterPassword.pending, (state) => { state.updating = true; })
      .addCase(changeSitterPassword.fulfilled, (state) => { state.updating = false; })
      .addCase(changeSitterPassword.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Upload Portfolio Image
      .addCase(uploadPortfolioImage.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(uploadPortfolioImage.fulfilled, (state, action) => {
        state.updating = false;
        // ✅ portfolioImages array-এ নতুন path add করো
        if (state.profile?.profile) {
          if (!state.profile.profile.portfolioImages) {
            state.profile.profile.portfolioImages = [];
          }
          state.profile.profile.portfolioImages.push(action.payload);
        }
      })
      .addCase(uploadPortfolioImage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete Portfolio Image
      .addCase(deletePortfolioImage.pending, (state) => {
        state.updating = true;
      })
      .addCase(deletePortfolioImage.fulfilled, (state, action) => {
        state.updating = false;
        // ✅ সেই path বাদ দাও
        if (state.profile?.profile?.portfolioImages) {
          state.profile.profile.portfolioImages = state.profile.profile.portfolioImages.filter(
            (img) => img !== action.payload
          );
        }
      })
      .addCase(deletePortfolioImage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Fetch Service Settings
      .addCase(fetchServiceSettings.pending, (state) => { state.servicesLoading = true; })
      .addCase(fetchServiceSettings.fulfilled, (state, action) => {
        state.servicesLoading = false;
        state.services[action.payload.serviceType] = action.payload.data;
      })
      .addCase(fetchServiceSettings.rejected, (state, action) => {
        state.servicesLoading = false;
        state.error = action.payload;
      })

      // Update Service Settings
      .addCase(updateServiceSettings.pending, (state) => { state.updating = true; })
      .addCase(updateServiceSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.services[action.payload.serviceType] = action.payload.data;
      })
      .addCase(updateServiceSettings.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Fetch Public Profile
      .addCase(fetchPublicSitterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.publicProfile = null;
      })
      .addCase(fetchPublicSitterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.publicProfile = action.payload;
      })
      .addCase(fetchPublicSitterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSitterError } = sitterSlice.actions;
export default sitterSlice.reducer;