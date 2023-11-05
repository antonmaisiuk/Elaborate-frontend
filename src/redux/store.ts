import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import basicInvestmentsReducer from './basicInvestSlice';
import modalReducer from "./modalSlice";
import itemReducer from "./itemSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    basicInvestments: basicInvestmentsReducer,
    item: itemReducer,
    modal: modalReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
