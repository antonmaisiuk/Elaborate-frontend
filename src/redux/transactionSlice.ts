import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import {ITransaction, ITransactionCat} from "../components/Table/Table";
import moment from "moment/moment";
import _ from "lodash";


interface TransactionState {
  transactions: ITransaction[];
  transCategories: ITransactionCat[];
  selectedTransaction: ITransaction | null;
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

const backendApi = 'https://localhost:7247';

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // addTransaction: (state, action: PayloadAction<ITransaction>) => {
    //   state.transactions.push(action.payload);
    // },
    // selectTransaction: (state, action: PayloadAction<string>) => {
    //   state.selectedTransaction = state.transactions.find(
    //     (transaction) => transaction.id === action.payload
    //   ) || null;
    // },
    // updateTransaction: (state, action: PayloadAction<ITransaction>) => {
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
        state.transactions = _.map(action.payload, (trans) => ({
          ...trans,
          categoryId: trans.categoryTransactionId
        }));
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })

      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        action.payload.category = state.transCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category';
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
            category: state.transCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category',
          };
        }
        state.error = null;
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
        state.error = null;
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
              return cat.id === trans.categoryId
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
        `${backendApi}/api/user/transaction`,
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
      `${backendApi}/api/user/transaction`,
      JSON.stringify(transaction),
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
    console.log('👉 Updated transaction: ', transaction);
    const response = await axios.put(
      `${backendApi}/api/user/transaction/${transaction.id}`,
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
      `${backendApi}/api/user/transaction/${transactionId}`,
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
        `${backendApi}/api/transaction-category`,
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
