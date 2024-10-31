import { addSummary, deleteSummary, getSummary, updateSummary } from '@/apiServices/completed';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CompleteItinerary {
  id?: string;
  tripName: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  activities: { [destination: string]: string[] }
  category: string;
  description: string;
  summary: string;
  cost: string;
  travelledDistance: string;
  userId?: string;
}
interface CompletedItineraryState {
  completedItineraries: CompleteItinerary[];
}
const initialState: CompletedItineraryState = {
  completedItineraries: [],
};

export const CompletedItirenarySlice=createSlice(
 { name: 'completedItinerary',
  initialState,
  reducers: {},
  extraReducers:(builder)=>{
    builder.addCase(
      getCompletedItinerary.fulfilled,
      (state, action: PayloadAction<CompleteItinerary[]>) => {
        state.completedItineraries = action.payload;
      }
    );
    builder.addCase(
      postSummary.fulfilled,
      (state, action: PayloadAction<CompleteItinerary>) => {
        state.completedItineraries.push(action.payload);
      }
    );
    builder.addCase(
      deleteCompletedItinerary.fulfilled,
      (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.completedItineraries = state.completedItineraries.filter(
          (itinerary) => itinerary.id !== id
        );
  }
);
builder.addCase (
  updateCompletedItinerary.fulfilled,
  (state, action: PayloadAction<CompleteItinerary>) => {
    const updatedItinerary = action.payload;
    const index = state.completedItineraries.findIndex(
      (itinerary) => itinerary.id === updatedItinerary.id
    );
    if (index !== -1) {
      state.completedItineraries[index] = updatedItinerary;
    }
  }
);
}
});

export const postSummary = createAsyncThunk(
  'completedItinerary/postSummary',
  async (summary: CompleteItinerary) => {
    const response = await addSummary(summary);
    return response;
  }
);

export const getCompletedItinerary = createAsyncThunk(
  'completedItinerary/getCompletedItinerary',
  async (id: string) => {
    const response = await getSummary(id);
    return response;
  }
);
export const deleteCompletedItinerary = createAsyncThunk(
  'completedItinerary/deleteCompletedItinerary',
  async (id: string) => {
    const response = await deleteSummary(id);
    return response;
  }
);
export const updateCompletedItinerary = createAsyncThunk(
  'completedItinerary/updateCompletedItinerary',
  async (summary: CompleteItinerary) => {
    const response = await updateSummary(summary.id!, summary);
    return response;
  }
);

export default CompletedItirenarySlice.reducer;