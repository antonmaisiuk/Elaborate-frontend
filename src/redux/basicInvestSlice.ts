import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from "./store";
import axios from "axios";
import {getActualToken} from "../App";
import {ITransactionCat} from "../components/Table/Table";
import moment from "moment/moment";
import _ from "lodash";
import {IBasicInvestment, IBasicInvestmentCat} from "../components/Investments/Overview/InvestOverview";

interface BasicInvestState {
  basicInvests: IBasicInvestment[];
  basicInvestsCategories: IBasicInvestmentCat[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: BasicInvestState = {
  basicInvests: [],
  basicInvestsCategories: [],
  loading: "idle",
  error: null,
};

const apiPath = 'https://localhost:7247';

const basicInvestSlice = createSlice({
  name: 'basicInvestments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- Basic Investments ----------
      .addCase(fetchBasicInvestsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchBasicInvestsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.basicInvests = action.payload;
        state.error = null;
      })
      .addCase(addBasicInvestsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        action.payload.category = state.basicInvestsCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category';
        state.basicInvests.push(action.payload);
        state.error = null;
      })
      // .addCase(updateTransactionAsync.fulfilled, (state, action) => {
      //   state.loading = 'succeeded';
      //   const index = state.basicInvestments.findIndex(
      //     (transaction) => transaction.id === action.payload.id
      //   );
      //   if (index !== -1) {
      //     state.basicInvestments[index] = {
      //       ...action.payload,
      //       date: moment(action.payload.date).format('DD.MM.YYYY'),
      //       category: state.transCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category',
      //     };
      //   }
      //   state.error = null;
      // })
      // .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
      //   state.loading = 'succeeded';
      //   console.log('👉 Delete id: ', action.payload);
      //   state.basicInvestments = state.basicInvestments.filter(
      //     (transaction) => transaction.id !== action.payload
      //   );
      //   state.error = null;
      // })
      // .addCase(fetchTransactionsAsync.rejected, (state, action) => {
      //   state.loading = 'failed';
      //   state.error = action.error.message || 'An error occurred.';
      // })
      // // ---------- Transaction Categories ----------
      .addCase(fetchInvestCatsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchInvestCatsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.basicInvestsCategories = action.payload;

        if (state.basicInvestsCategories.length){
          state.basicInvests.forEach((invest) => {
            invest.category = state.basicInvestsCategories.filter((cat) => {
              return cat.id === invest.categoryId
            })[0].name || 'No category'
          });
        } else state.error = 'Error on handling basicInvestments';

        state.error = null;
      })
      .addCase(fetchInvestCatsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export const {
} = basicInvestSlice.actions;

export default basicInvestSlice.reducer;

export const fetchBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/fetchBasicInvests',
  async () => {
    try {
      const response = await axios.get(
        `${apiPath}/api/user/basicinvestment`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      return _.forEach(response.data, (invest: IBasicInvestment) => invest.date = moment(invest.date).format('DD.MM.YYYY'));
    } catch (error) {
      throw error;
    }
});

export const addBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/addBasicInvests',
  async (invest: IBasicInvestment) => {
    const response = await axios.post(
      `${apiPath}/api/user/basicinvestment`,
      JSON.stringify(invest),
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      });
    response.data.date = moment(invest.date).format('DD.MM.YYYY');
    return response.data;
  }
);

export const updateTransactionAsync = createAsyncThunk(
  'basicInvestments/updateTransaction',
  async (transaction: IBasicInvestment) => {
    console.log('👉 Updated transaction: ', transaction);
    const response = await axios.put(
      `${apiPath}/api/user/transaction/${transaction.id}`,
      JSON.stringify(transaction),
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return transaction;
  }
);

export const deleteTransactionAsync = createAsyncThunk(
  'basicInvestments/deleteTransaction',
  async (transactionId: string) => {
    await axios.delete(
      `${apiPath}/api/user/transaction/${transactionId}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return transactionId;
  }
);

export const fetchInvestCatsAsync = createAsyncThunk(
  'basicInvestments/fetchInvestCats',
  async () => {
    try {
      const response = await axios.get(
        `${apiPath}/api/category-investment`,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  });
