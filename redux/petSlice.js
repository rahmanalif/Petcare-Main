import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Fetch All Pets
export const fetchPets = createAsyncThunk('pets/fetchPets', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${API_BASE}/api/pets`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch pets");
    
    // Normalize data structure
    if (Array.isArray(data)) return data;
    if (data.pets && Array.isArray(data.pets)) return data.pets;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 2. Fetch Single Pet (Optional if we already have the list, but good for direct link access)
export const fetchPetById = createAsyncThunk('pets/fetchPetById', async (id, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${API_BASE}/api/pets/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch pet details");
    return data.data || data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 3. Update Pet Image
export const updatePetImage = createAsyncThunk('pets/updatePetImage', async ({ id, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("petImage", file);

    const response = await fetchWithAuth(`${API_BASE}/api/pets/${id}/image`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Image upload failed");
    
    // Determine new image URL
    let newImage = result.imageUrl || result.data?.imageUrl;
    if (!newImage && result.gallery && Array.isArray(result.gallery)) {
      newImage = result.gallery[result.gallery.length - 1];
    }
    return { id, newImage };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const petSlice = createSlice({
  name: 'pets',
  initialState: {
    list: [],        // All pets list
    selectedPet: null, // Specific pet details
    loading: false,
    error: null,
    uploading: false,
  },
  reducers: {
    // Optional: Clear selected pet when leaving page
    clearSelectedPet: (state) => {
      state.selectedPet = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Pets
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Pet
      .addCase(fetchPetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPet = action.payload;
        // Update list if this pet exists there too
        const index = state.list.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
            state.list[index] = action.payload;
        }
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Image
      .addCase(updatePetImage.pending, (state) => {
        state.uploading = true;
      })
      .addCase(updatePetImage.fulfilled, (state, action) => {
        state.uploading = false;
        const { id, newImage } = action.payload;
        
        // Update in list
        const petInList = state.list.find(p => p._id === id);
        if (petInList) {
          if (!petInList.gallery) petInList.gallery = [];
          petInList.gallery.push(newImage);
        }

        // Update in selectedPet if matches
        if (state.selectedPet && state.selectedPet._id === id) {
           if (!state.selectedPet.gallery) state.selectedPet.gallery = [];
           state.selectedPet.gallery.push(newImage);
        }
      })
      .addCase(updatePetImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedPet } = petSlice.actions;
export default petSlice.reducer;
