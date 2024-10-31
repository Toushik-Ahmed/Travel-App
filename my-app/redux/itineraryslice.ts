import {
  addItenerary,
  deleteItinerary,
  getItineraries,
  updateItinerary,
} from '@/apiServices/itinerary';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Itinerary {
  id?: string;
  tripName: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  activities: { [destination: string]: string[] }; // Object mapping destinations to activities
  category: string;
  description: string;
  userId?: string;
}

interface ItineraryState {
  itineraries: Itinerary[];
}

const initialState: ItineraryState = {
  itineraries: [],
};

export const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postItenerary.fulfilled,
      (state, action: PayloadAction<Itinerary>) => {
        state.itineraries.push(action.payload);
      }
    );
    builder.addCase(
      getAllIteneraries.fulfilled,
      (state, action: PayloadAction<Itinerary[]>) => {
        state.itineraries = action.payload;
      }
    );
    builder.addCase(
      updateItenerary.fulfilled,
      (state, action: PayloadAction<Itinerary>) => {
        const updatedItinerary = action.payload;
        const index = state.itineraries.findIndex(
          (itinerary) => itinerary.id === updatedItinerary.id
        );
        if (index !== -1) {
          state.itineraries[index] = updatedItinerary;
        }
      }
    );
    builder.addCase(
      deleteItineraryFunc.fulfilled,
      (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.itineraries = state.itineraries.filter(
          (itinerary) => itinerary.id !== id
        );
      }
    );
  },
});

export const postItenerary = createAsyncThunk(
  'itinerary/postItenerary',
  async (itinerary: Itinerary) => {
    const response = await addItenerary(itinerary);
    return response;
  }
);

export const getAllIteneraries = createAsyncThunk(
  'itinerary/getAllIteneraries',
  async (id: string) => {
    const response = await getItineraries(id);
    return response;
  }
);

export const updateItenerary = createAsyncThunk(
  'itinerary/updateItenerary',
  async (itinerary: Itinerary) => {
    const response = await updateItinerary(itinerary.id!, itinerary);
    return response;
  }
);

export const deleteItineraryFunc = createAsyncThunk(
  'itinerary/deleteItinerary',
  async (id: string) => {
    const response = await deleteItinerary(id);
    return id;
  }
);

export default itinerarySlice.reducer;