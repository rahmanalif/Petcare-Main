import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Fetch Profile
export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/users/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch profile");
    return result.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 2. Update Profile Image
export const updateProfileImage = createAsyncThunk('user/updateProfileImage', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetchWithAuth(`${API_URL}/api/users/profile-image`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Image upload failed");
    
    // Return the new image URL
    return result.profilePicture || result.imageUrl || result.data?.profilePicture;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 3. Update Profile Info (Text data)
export const updateProfileInfo = createAsyncThunk('user/updateProfileInfo', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Update failed");
    return userData; // Return the data we just sent to update state immediately
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 4. Change Password
export const changePassword = createAsyncThunk('user/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/sitter/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Password change failed");
    return result;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,      // User info here
    loading: false,  // Initial fetch loading
    updating: false, // Save button loading
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile Logic
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Image Upload Logic
      .addCase(updateProfileImage.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.updating = false;
        if (state.data) {
          state.data.profilePicture = action.payload;
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Update Info Logic
      .addCase(updateProfileInfo.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfileInfo.fulfilled, (state, action) => {
        state.updating = false;
        // Merge updated fields
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateProfileInfo.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Change Password Logic
      .addCase(changePassword.pending, (state) => {
        state.updating = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
