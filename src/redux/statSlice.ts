import {createSlice, PayloadAction} from "@reduxjs/toolkit";


// export const StatPeriods = [
//   { value: 0, name: 'Today' },
//   { value: 1, name: 'Week' },
//   { value: 2, name: 'Month' },
//   { value: 3, name: 'Year' },
// ]

export enum StatType {
  transactions = 'Transactions',
  investments = 'Investments',
}
// export const StatTypes =  [
//   { value: StatType.transactions, name: 'Transactions' },
//   { value: StatType.investments, name: 'Investments' },
// ]

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
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: StatState = {
  type: StatType.transactions,
  period: StatPeriod.today,
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
      // const index = Object.values(StatPeriod).indexOf(action.payload as StatPeriod);
      // console.log('👉 index: ', index);
      state.period = StatPeriod[action.payload as keyof typeof StatPeriod];
    },
  }
});

export const {
  setType,
  setPeriod,
} = statSlice.actions;

export default statSlice.reducer;
