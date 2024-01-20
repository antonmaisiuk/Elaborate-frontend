import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum StatType {
  transactions = 'Transactions',
  investments = 'Investments',
}

export enum StatPeriod {
  today = 'Today',
  week = 'Week',
  month = 'Month',
  year = 'Year',
  all = 'All',
}

interface StatState {
  type: StatType,
  period: StatPeriod,
  buyerPeriod: string,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StatState = {
  type: StatType.transactions,
  period: StatPeriod.week,
  buyerPeriod: '2023-06',
  loading: 'idle',
  error: null,
};

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.type = StatType[action.payload as keyof typeof StatType];
    },
    setPeriod: (state, action: PayloadAction<string>) => {
      state.period = StatPeriod[action.payload as keyof typeof StatPeriod];
    },
    setBuyerPeriod: (state, action: PayloadAction<string>) => {
      state.buyerPeriod = action.payload;
    },
  }
});

export const {
  setType,
  setPeriod,
  setBuyerPeriod,
} = statSlice.actions;

export default statSlice.reducer;
