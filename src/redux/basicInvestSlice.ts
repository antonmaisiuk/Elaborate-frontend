import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import moment from "moment/moment";
import _ from "lodash";
import {IBasicInvestment, IBasicInvestmentCat, IItem} from "../components/Investments/Overview/InvestOverview";
import {RootState} from "./store";

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
  loading: 'idle',
  error: null,
};
// https://rapidapi.com/lbraciszewski/api/coinpaprika1 - crypto
// https://rapidapi.com/amansharma2910/api/realstonks - stocks
const backendApi = 'https://localhost:7247';

const key = 'dce75a2233mshd18a7fa0853e340p159359jsn3d6895c9690f';
const metalKey = '407ce20e80bde2fd714142bc8b5047bb';

const stocksApi = 'https://realstonks.p.rapidapi.com/';
const cryptoApi = 'https://coinpaprika1.p.rapidapi.com/coins/';
const metalsApi = `https://api.currencybeacon.com/v1/latest?api_key=${metalKey}&base=`;


const basicInvestSlice = createSlice({
  name: 'basicInvestments',
  initialState,
  reducers: {},
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
            item: state.items ? state.items.filter((item) => item.id === invest.itemId)[0].name : 'No index',
            itemId: invest.itemId,
            category: '',
            categoryId: invest.categoryId,
            comment: invest.comment,
            date: moment(invest.dateOfCreated).format('DD.MM.YYYY'),
            amount: invest.amount,
            value: _.round(invest.value, 2),
          } as IBasicInvestment
        ));

        state.error = null;
      })

      .addCase(addBasicInvestsAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';

        state.basicInvests.push(action.payload);
        state.error = null;
      })
      .addCase(updateBasicInvestAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.basicInvests.findIndex(
          (invest) => invest.id === action.payload.id
        );
        console.log('👉 Updated item: ', action.payload);
        if (index !== -1) {
          state.basicInvests[index] = {
            ...action.payload,
            date: moment(action.payload.date).format('DD.MM.YYYY'),
            item: state.items ? state.items.filter((item) => item.id === action.payload.itemId)[0].name : 'No index',
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

export const {} = basicInvestSlice.actions;

export default basicInvestSlice.reducer;

export const fetchBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/fetchBasicInvests',
  async (_,thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      const response = await axios.get(
        `${backendApi}/api/user/basicinvestment`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return Promise.all(response.data.map(async (invest: IBasicInvestment) =>({
        ...invest,
        value: invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId),
      })));
      // return response.data;
    } catch (error) {
      throw error;
    }
});

export const addBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/addBasicInvests',
  async (invest: IBasicInvestment, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const invests = state.basicInvestments.basicInvests as IBasicInvestment[];
    const items = state.basicInvestments.items;
    const categories = state.basicInvestments.basicInvestsCategories as IBasicInvestmentCat[];

    console.log('👉 new invest: ', invest);
    const response = await axios.post(
      `${backendApi}/api/user/basicinvestment`,
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

    const newInvest = response.data as IBasicInvestment;
    const existedItem = invests.filter((invest) => invest.itemId === newInvest.itemId);

    if (existedItem.length){
      const newAmount = existedItem[0].amount + newInvest.amount;

      return {
        ...newInvest,
        date: moment(newInvest.date).format('DD.MM.YYYY'),
        comment: newInvest.comment,
        amount: newAmount,
        value: _.round(newAmount * await getPrice(items.filter((item: IItem) => item.id === newInvest.itemId)[0].index, newInvest.categoryId), 2)
      }
    } else {
      console.log('👉 categories: ', categories);
      return {
        ...newInvest,
        date: moment(newInvest.date).format('DD.MM.YYYY'),
        category: categories.filter((cat) => cat.id === newInvest.categoryId)[0].name || 'No category'
      }
    }
  }
);

export const updateBasicInvestAsync = createAsyncThunk(
  'basicInvestments/updateBasicInvest',
  async (invest: IBasicInvestment, thunkAPI: any) => {
    const state = thunkAPI.getState();

    await axios.put(
      `${backendApi}/api/user/basicinvestment/${invest.id}`,
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
    return {
      ...invest,
      value: _.round(invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId), 2),

    };
  }
);

export const deleteBasicInvestAsync = createAsyncThunk(
  'basicInvestments/deleteBasicInvest',
  async (investId: string) => {
    await axios.delete(
      `${backendApi}/api/user/basicinvestment/${investId}`,
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
        `${backendApi}/api/category-investment`,
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
        `${backendApi}/api/item`,
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

export const getPrice = async (index: string, categoryId: string) => {
    try {
      let response;
      switch (categoryId) {
        case '2530f9f3-5dc5-4d7c-9233-3df8705bd4e2': // metals
          response = await axios.get(
            `${metalsApi}${index}&symbols=USD`,
            {
              headers: {
                accept: 'application/json',
              },
            }
          );
          const { rates: { USD: metalsPrice }} = response.data;

          return _.round(metalsPrice, 2) || 0;
        case '029e8ff3-8aca-4b2e-a938-7a1e97fb9c8d': // crypto
          response = await axios.get(
            `${cryptoApi}${index}/ohlcv/latest`,
            {
              headers: {
                accept: 'application/json',
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'coinpaprika1.p.rapidapi.com'
              },
            }
          );
          const { open: cryptoPrice } = response.data[0];

          return _.round(cryptoPrice, 2) || 0;
        case '59631964-1cf5-41b3-9e33-303d39033590': // stocks
          response = await axios.get(
            `${stocksApi}${index}`,
            {
              headers: {
                accept: 'application/json',
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
              },
            }
          );

          const {price: stockPrice} = response.data;

          return _.round(stockPrice, 2) || 0;
        default:
          return 0;
      }

    } catch (error) {
      console.log('👉 Error: ', error);
      throw error;
    }
  };
