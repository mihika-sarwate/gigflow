import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Submit a bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/bids`, bidData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
    }
  }
);

// Fetch bids for a gig (owner only)
export const fetchGigBids = createAsyncThunk(
  'bids/fetchGigBids',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bids/${gigId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

// Fetch my bids
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bids/my-bids/list`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
    }
  }
);

// Hire a freelancer
export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/api/bids/${bidId}/hire`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBids: (state) => {
      state.bids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Bid
      .addCase(submitBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids.unshift(action.payload.bid);
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Gig Bids
      .addCase(fetchGigBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload.bids;
      })
      .addCase(fetchGigBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Bids
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload.bids;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Hire Bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update bid status
        state.bids = state.bids.map(bid =>
          bid._id === action.payload.bid._id
            ? { ...bid, status: 'hired' }
            : { ...bid, status: 'rejected' }
        );
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearBids } = bidSlice.actions;
export default bidSlice.reducer;
