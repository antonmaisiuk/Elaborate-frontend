import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";

export interface IItem {
  id:	string,
  name:	string,
  index:	string,
  categoryInvestmentId:	string
}

interface ItemState {
  items: IItem[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  loading: "idle",
  error: null,
};

const apiPath = 'https://localhost:7247';

const transactionSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- Items ----------
      .addCase(fetchItemsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items = action.payload
        state.error = null;
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
  },
});

export const {} = transactionSlice.actions;

export default transactionSlice.reducer;

export const fetchItemsAsync = createAsyncThunk(
  'items/fetchItems',
  async () => {
    try {
      const response = await axios.get(
        `${apiPath}/api/item`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  });
