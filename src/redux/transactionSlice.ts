import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import {ITransaction, ITransactionCat} from "../components/Table/Table";
import moment from "moment/moment";
import _ from "lodash";


interface TransactionState {
  transactions: ITransaction[];
  transCategories: ITransactionCat[];
  selectedTransaction: ITransaction | null;
  transLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
  catsLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  transCategories: [],
  selectedTransaction: null,
  transLoading: "idle",
  catsLoading: "idle",
  error: null,
};



const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- Transactions ----------
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.transLoading = 'pending';
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.transLoading = 'succeeded';
        state.transactions = _.map(action.payload, (trans) => ({
          ...trans,
          categoryId: trans.categoryTransactionId
        }));
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.transLoading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })

      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        action.payload.category = state.transCategories.filter((cat) => cat.id === action.payload.categoryTransactionId)[0].name || 'No category';
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = {
            ...action.payload,
            date: moment(action.payload.date).format('DD.MM.YYYY'),
            category: state.transCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category',
          };
        }
        state.error = null;
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
        state.error = null;
      })
      // ---------- Transaction Categories ----------
      .addCase(fetchTransCatsAsync.pending, (state) => {
        state.catsLoading = 'pending';
      })
      .addCase(fetchTransCatsAsync.fulfilled, (state, action) => {
        state.catsLoading = 'succeeded';
        state.transCategories = action.payload;

        if (state.transactions.length){
          state.transactions.forEach((trans) => {
            trans.category = state.transCategories.filter((cat) => {
              return cat.id === trans.categoryId
            })[0].name || 'No category'
          });
        } else state.error = 'Error on handling transactions';

        state.error = null;
      })
      .addCase(fetchTransCatsAsync.rejected, (state, action) => {
        state.catsLoading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export const {} = transactionSlice.actions;

export default transactionSlice.reducer;

export const fetchTransactionsAsync = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/transaction`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      return _.forEach(response.data, (trans: ITransaction) => trans.date = moment(trans.date).format('DD.MM.YYYY'));
    } catch (error) {
      throw error;
    }
});

export const addTransactionAsync = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: ITransaction) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/transaction`,
      JSON.stringify({
        name: transaction.name,
        comment: transaction.comment,
        date: transaction.date,
        value: transaction.value,
        categoryTransactionId: transaction.categoryId,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      });
    response.data.date = moment(transaction.date).format('DD.MM.YYYY');
    delete response.data.userId;
    return response.data;
  }
);

export const updateTransactionAsync = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: ITransaction) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/transaction/${transaction.id}`,
      JSON.stringify({
        name: transaction.name,
        comment: transaction.comment,
        date: transaction.date,
        value: transaction.value,
        categoryTransactionId: transaction.categoryId
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return transaction;
  }
);

export const deleteTransactionAsync = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId: string) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/user/transaction/${transactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return transactionId;
  }
);

export const fetchTransCatsAsync = createAsyncThunk(
  'transactions/fetchTransCats',
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/transaction-category`,
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
