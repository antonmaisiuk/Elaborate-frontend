import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import {TransactionInter, TransCategoryInter} from "../components/Table/Table";
import moment from "moment/moment";
import _ from "lodash";


interface TransactionState {
  transactions: TransactionInter[];
  transCategories: TransCategoryInter[];
  selectedTransaction: TransactionInter | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: TransactionState = {
  transactions: [],
  transCategories: [],
  selectedTransaction: null,
  loading: "idle",
  error: null,
};

const apiPath = 'https://localhost:7247';

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // addTransaction: (state, action: PayloadAction<TransactionInter>) => {
    //   state.transactions.push(action.payload);
    // },
    // selectTransaction: (state, action: PayloadAction<string>) => {
    //   state.selectedTransaction = state.transactions.find(
    //     (transaction) => transaction.id === action.payload
    //   ) || null;
    // },
    // updateTransaction: (state, action: PayloadAction<TransactionInter>) => {
    //   const index = state.transactions.findIndex(
    //     (transaction) => transaction.id === action.payload.id
    //   );
    //   if (index !== -1) {
    //     state.transactions[index] = action.payload;
    //   }
    // },
    // deleteTransaction: (state, action: PayloadAction<string>) => {
    //   state.transactions = state.transactions.filter(
    //     (transaction) => transaction.id !== action.payload
    //   );
    //   state.selectedTransaction = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      // ---------- Transactions ----------
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        action.payload.category = state.transCategories.filter((cat) => cat.id === action.payload.categoryTransactionId)[0].name || 'No category';
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = {
            ...action.payload,
            date: moment(action.payload.date).format('DD.MM.YYYY'),
            category: state.transCategories.filter((cat) => cat.id === action.payload.categoryTransactionId)[0].name || 'No category',
          };
        }
        state.error = null;
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        console.log('👉 Delete id: ', action.payload);
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
      // ---------- Transaction Categories ----------
      .addCase(fetchTransCatsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTransCatsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.transCategories = action.payload;

        if (state.transactions.length){
          state.transactions.forEach((trans) => {
            trans.category = state.transCategories.filter((cat) => {
              return cat.id === trans.categoryTransactionId
            })[0].name || 'No category'
          });
        } else state.error = 'Error on handling transactions';

        state.error = null;
      })
      .addCase(fetchTransCatsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export const {
  // addTransaction,
  // selectTransaction,
  // updateTransaction,
  // deleteTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;

export const fetchTransactionsAsync = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    try {
      const response = await axios.get(
        `${apiPath}/api/user/transaction`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      return _.forEach(response.data, (trans: TransactionInter) => trans.date = moment(trans.date).format('DD.MM.YYYY'));
    } catch (error) {
      throw error;
    }
});

export const addTransactionAsync = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: TransactionInter) => {
    const response = await axios.post(
      `${apiPath}/api/user/transaction`,
      JSON.stringify(transaction),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      });
    response.data.date = moment(transaction.date).format('DD.MM.YYYY');
    return response.data;
  }
);

export const updateTransactionAsync = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: TransactionInter) => {
    console.log('👉 Updated transaction: ', transaction);
    const response = await axios.put(
      `${apiPath}/api/user/transaction/${transaction.id}`,
      JSON.stringify(transaction),
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
      `${apiPath}/api/user/transaction/${transactionId}`,
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
        `${apiPath}/api/transaction-category`,
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
