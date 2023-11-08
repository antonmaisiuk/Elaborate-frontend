import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import basicInvestmentsReducer from './basicInvestSlice';
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    basicInvestments: basicInvestmentsReducer,
    modal: modalReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
