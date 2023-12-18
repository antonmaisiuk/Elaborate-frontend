import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import basicInvestmentsReducer from './basicInvestSlice';
import otherInvestmentsReducer from './otherInvestSlice';
import modalReducer from "./modalSlice";
import statsSlice from "./statSlice";
import settingsSlice from "./settingsSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    basicInvestments: basicInvestmentsReducer,
    otherInvestments: otherInvestmentsReducer,
    modal: modalReducer,
    stats: statsSlice,
    settings: settingsSlice,
    user: userSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
