import { configureStore } from '@reduxjs/toolkit';
import { budgetSlice } from './budgetSlice';
import { CompletedItirenarySlice } from './completedTourSlice';
import { itinerarySlice } from './itineraryslice';
import { signUpSlice } from './userSlice';

export const store = configureStore({
  reducer: {
    user: signUpSlice.reducer,
    itinerary: itinerarySlice.reducer,
    summary: CompletedItirenarySlice.reducer,
    budget: budgetSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
