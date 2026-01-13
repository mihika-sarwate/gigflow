import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch all gigs
export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (searchQuery = '', { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/gigs?search=${searchQuery}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

// Fetch my gigs
export const fetchMyGigs = createAsyncThunk(
  'gigs/fetchMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/gigs/my-gigs`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
    }
  }
);

// Create gig
export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/gigs`, gigData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

// Delete gig
export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/gigs/${gigId}`, {
        withCredentials: true
      });
      return gigId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Gigs
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload.gigs;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload.gigs;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs.unshift(action.payload.gig);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Gig
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.myGigs = state.myGigs.filter(gig => gig._id !== action.payload);
      });
  },
});

export const { clearError } = gigSlice.actions;
export default gigSlice.reducer;
