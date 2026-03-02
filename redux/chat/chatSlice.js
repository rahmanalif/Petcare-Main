import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Fetch Messages
export const fetchMessagesByUser = createAsyncThunk(
  'chat/fetchMessagesByUser',
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/chat/messages/${otherUserId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch messages');
      return result.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔥 Update: Send Message (Fixing the Key Name)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ recipientId, content }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/chat/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
            receiverId: recipientId, // 🔥 CHANGE: সার্ভার 'receiverId' নাম চাচ্ছে
            content: content         // 'content' ঠিক আছে
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      // মেসেজ পাঠানোর পর লিস্ট রিফ্রেশ করা
      dispatch(fetchMessagesByUser(recipientId));
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    sending: false,
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessagesByUser.pending, (state) => { state.loading = true; })
      .addCase(fetchMessagesByUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.messages = action.payload; 
      })
      .addCase(fetchMessagesByUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => { state.sending = true; })
      .addCase(sendMessage.fulfilled, (state) => { state.sending = false; })
      .addCase(sendMessage.rejected, (state, action) => { 
        state.sending = false; 
        state.error = action.payload; 
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;