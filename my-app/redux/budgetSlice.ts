import { baseUrl } from '@/apiServices/completed';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Budget {
  id?: string;
  category: string;
  budget: string;
  expense: string;
  tripId?: string;
  userId?: string;
  title?: string;
}

interface BudgetState {
  budgets: Budget[];
}

const initialState: BudgetState = {
  budgets: [],
};

export const postBudget = createAsyncThunk(
  'budget/post',
  async (data: Budget) => {
    const response = await axios.post(`${baseUrl}/budgets`, data);
    return response.data;
  }
);
export const getBudget = createAsyncThunk('budget/get', async (id: string) => {
  const response = await axios.get(`${baseUrl}/budgets?tripId=${id}`);
  return response.data;
});

export const editBudget = createAsyncThunk(
  'budget/edit',
  async (data: Budget) => {
    const response = await axios.put(`${baseUrl}/budgets/${data.id}`, data);
    return response.data;
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id: string) => {
    const response = await axios.delete(`${baseUrl}/budgets/${id}`);
    return id;
  }
);

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getBudget.fulfilled,
      (state, action: PayloadAction<Budget[]>) => {
        state.budgets = action.payload;
      }
    );
    builder.addCase(
      postBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        state.budgets.push(action.payload);
      }
    );
    builder.addCase(
      deleteBudget.fulfilled,
      (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.budgets = state.budgets.filter((budget) => budget.id !== id);
      }
    );
    builder.addCase(
      editBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        const updatedBudget = action.payload;
        const index = state.budgets.findIndex(
          (budget) => budget.id === updatedBudget.id
        );

        if (index !== -1) {
          state.budgets[index] = {
            ...state.budgets[index],
            ...updatedBudget,
          };
        }
      }
    );
  },
});

export default budgetSlice.reducer;
