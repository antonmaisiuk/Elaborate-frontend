import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import moment from "moment/moment";
import _ from "lodash";
import {IBasicInvestment, IBasicInvestmentCat, IItem} from "../components/Investments/Overview/InvestOverview";

interface BasicInvestState {
  basicInvests: IBasicInvestment[];
  basicInvestsCategories: IBasicInvestmentCat[];
  items: IItem[],
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: BasicInvestState = {
  basicInvests: [],
  basicInvestsCategories: [],
  items: [],
  loading: "idle",
  error: null,
};

const apiPath = 'https://localhost:7247';

const basicInvestSlice = createSlice({
  name: 'basicInvestments',
  initialState,
  reducers: {
    setBasicInvests: (state, action: PayloadAction<IBasicInvestment[]>) => {
      state.basicInvests = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      // ========== Basic Investments ==========
      .addCase(fetchBasicInvestsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchBasicInvestsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';

        state.basicInvests = _.map(action.payload, (invest) => ({
            id: invest.id,
            item: state.items.filter((item) => item.id === invest.itemId)[0].name || 'No index',
            itemId: invest.itemId,
            category: '',
            categoryId: invest.categoryId,
            comment: invest.comment,
            date: moment(invest.dateOfCreated).format('DD.MM.YYYY'),
            amount: invest.amount,
            value: 0,
          }
        ));
        state.error = null;
      })
      .addCase(addBasicInvestsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        action.payload.category = state.basicInvestsCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category';
        state.basicInvests = action.payload;
        state.error = null;
      })
      .addCase(updateBasicInvestAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.basicInvests.findIndex(
          (invest) => invest.id === action.payload.id
        );
        if (index !== -1) {
          state.basicInvests[index] = {
            ...action.payload,
            date: moment(action.payload.date).format('DD.MM.YYYY'),
            category: state.basicInvestsCategories.filter((cat) => cat.id === action.payload.categoryId)[0].name || 'No category',
          };
        }
        state.error = null;
      })
      .addCase(deleteBasicInvestAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.basicInvests = state.basicInvests.filter(
          (invest) => invest.id !== action.payload
        );
        state.error = null;
      })
      // ==============================

      // ========== Invest Categories ==========

      .addCase(fetchInvestCatsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchInvestCatsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.basicInvestsCategories = action.payload;

        if (state.basicInvests.length) {
          state.basicInvests.forEach((invest) => {
            invest.category = state.basicInvestsCategories.filter((cat) => cat.id === invest.categoryId)[0].name || 'No category';
          });
        } else {
          state.error = 'Error on handling basicInvestments';
        }
        state.error = null;
      })
      .addCase(fetchInvestCatsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
      // ==============================


      // ========== Items ==========
      .addCase(fetchItemsAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
  },
});

export const {
  setBasicInvests
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
      // return _.forEach(response.data, (invest: IBasicInvestment) => invest.date = moment(invest.date).format('DD.MM.YYYY'));
      return response.data;
    } catch (error) {
      throw error;
    }
});

export const addBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/addBasicInvests',
  async (invest: IBasicInvestment) => {
    const response = await axios.post(
      `${apiPath}/api/user/basicinvestment`,
      JSON.stringify({
        dateOfCreated: invest.date,
        comment: invest.comment,
        categoryId: invest.categoryId,
        itemId: invest.itemId,
        amount: invest.amount,
      }),
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

export const updateBasicInvestAsync = createAsyncThunk(
  'basicInvestments/updateBasicInvest',
  async (invest: IBasicInvestment) => {
    console.log('👉 Updated transaction: ', invest);
    await axios.put(
      `${apiPath}/api/user/basicinvestment/${invest.id}`,
      JSON.stringify({
        comment: invest.comment,
        categoryId: invest.categoryId,
        itemId: invest.itemId,
        amount: invest.amount
      }),
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return invest;
  }
);

export const deleteBasicInvestAsync = createAsyncThunk(
  'basicInvestments/deleteBasicInvest',
  async (investId: string) => {
    await axios.delete(
      `${apiPath}/api/user/basicinvestment/${investId}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      }
    );
    return investId;
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
