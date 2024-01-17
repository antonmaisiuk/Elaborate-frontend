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
  itemsLoading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  basicCatLoading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  basicLoading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: BasicInvestState = {
  basicInvests: [],
  basicInvestsCategories: [],
  items: [],
  itemsLoading: 'idle',
  basicCatLoading: 'idle',
  basicLoading: 'idle',
  error: null,
};

const basicInvestSlice = createSlice({
  name: 'basicInvestments',
  initialState,
  reducers: {
    setInvest: (state, action: PayloadAction<IBasicInvestment>) => {
      const index = state.basicInvests.findIndex(
        (invest) => invest.id === action.payload.id
      );
      if (index !== -1){
        state.basicInvests[index] = {...action.payload};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== Basic Investments ==========
      .addCase(fetchBasicInvestsAsync.pending, (state) => {
        state.basicLoading = 'pending';
      })
      .addCase(fetchBasicInvestsAsync.fulfilled, (state, action) => {
        state.basicLoading = 'succeeded';

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
      .addCase(fetchBasicInvestsAsync.rejected, (state, action) => {
        state.basicLoading = 'failed';
        state.error = 'Oops...we have some problems. Please, reload page.';

        // throw Error(state.error);
      })

      .addCase(addBasicInvestsAsync.fulfilled, (state, action) => {
        // state.loading = 'succeeded';
        const newInvest = action.payload;

        const index = state.basicInvests.findIndex(
          (invest) => invest.itemId === newInvest.itemId
        );
        if (index !== -1){
          state.basicInvests[index] = {...newInvest};
        } else {
          state.basicInvests.push(newInvest);
        }

        state.error = null;
      })
      .addCase(updateBasicInvestAsync.fulfilled, (state, action) => {
        // state.loading = 'succeeded';
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
        // state.loading = 'succeeded';
        state.basicInvests = state.basicInvests.filter(
          (invest) => invest.id !== action.payload
        );
        state.error = null;
      })
      // ==============================

      // ========== Invest Categories ==========

      .addCase(fetchInvestCatsAsync.pending, (state) => {
        state.basicCatLoading = 'pending';
      })
      .addCase(fetchInvestCatsAsync.fulfilled, (state, action) => {
        state.basicCatLoading = 'succeeded';
        state.basicInvestsCategories = action.payload;

        if (state.basicInvests.length) {
          state.basicInvests.forEach((invest) => {
            invest.category = state.basicInvestsCategories.filter((cat) => cat.id === invest.categoryId)[0]?.name || 'No category';
          });
        } else {
          state.error = 'Error on handling basicInvestments';
        }
        state.error = null;
      })
      .addCase(fetchInvestCatsAsync.rejected, (state, action) => {
        state.basicCatLoading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
      // ==============================


      // ========== Items ==========
      .addCase(fetchItemsAsync.pending, (state) => {
        state.itemsLoading = 'pending';
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.itemsLoading = 'failed';
        state.error = action.error.message || 'An error occurred.';
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.itemsLoading = 'succeeded';
        state.items = action.payload;
      })
  },
});

export const { setInvest } = basicInvestSlice.actions;

export default basicInvestSlice.reducer;

export const fetchBasicInvestsAsync = createAsyncThunk(
  'basicInvestments/fetchBasicInvests',
  async (_,thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      const exchangeRate = state.user.exchangeRate;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/basicinvestment`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return Promise.all(response.data.map(async (invest: IBasicInvestment) =>({
        ...invest,
        value: invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId, exchangeRate),
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
    const items = state.basicInvestments.items as IItem[];
    const categories = state.basicInvestments.basicInvestsCategories as IBasicInvestmentCat[];
    const exchangeRate = state.exchangeRate;

    console.log('👉 new invest: ', invest);
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/basicinvestment`,
      JSON.stringify({
        dateOfCreated: moment().toISOString(),
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

      return {
        ...newInvest,
        date: moment().format('DD.MM.YYYY'),
        category: categories.filter((cat) => cat.id === newInvest.categoryId)[0]?.name || 'No category',
        item: items.filter((item) => item.id === newInvest.itemId)[0]?.name || 'No index',
        value: _.round(newInvest.amount * await getPrice(items.filter((item: IItem) => item.id === newInvest.itemId)[0].index, newInvest.categoryId, exchangeRate), 2)
      };
  }
);

export const updateBasicInvestAsync = createAsyncThunk(
  'basicInvestments/updateBasicInvest',
  async (invest: IBasicInvestment, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const exchangeRate = state.exchangeRate;

    console.log('👉 Updated item before req: ', invest);
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/basicinvestment/${invest.id}`,
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
      value: _.round(invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId, exchangeRate), 2),

    };
  }
);

export const deleteBasicInvestAsync = createAsyncThunk(
  'basicInvestments/deleteBasicInvest',
  async (investId: string) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/user/basicinvestment/${investId}`,
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
        `${process.env.REACT_APP_API_URL}/api/category-investment`,
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
        `${process.env.REACT_APP_API_URL}/api/item`,
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

export const getPrice = async (index: string, categoryId: string, rate: number) => {
    try {
      console.log('👉 GET PRICE RATE: ', rate);
      let response;
      switch (categoryId) {
        case process.env.REACT_APP_METALS_ID: // metals
          setTimeout(() => {}, _.random(1e2,5e2));

          response = await axios.get(
            `${process.env.REACT_APP_METAL_API}${index}&symbols=USD`,
            {
              headers: {},
            }
          );

          const { rates: { USD: metalsPrice }} = response.data;

          return _.round(metalsPrice * rate, 2) || 0;
        case process.env.REACT_APP_CRYPTO_ID: // crypto
          setTimeout(() => {}, _.random(1e2,5e2));

          response = await axios.get(
            `${process.env.REACT_APP_CRYPTO_API}${index}/ohlcv/latest`,
            {
              headers: {
                accept: 'application/json',
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
                'X-RapidAPI-Host': 'coinpaprika1.p.rapidapi.com'
              },
            }
          );
          const { open: cryptoPrice } = response.data[0];

          return _.round(cryptoPrice * rate, 2) || 0;
        case process.env.REACT_APP_STOCKS_ID: // stocks
          setTimeout(() => {}, _.random(1e2,5e2));

          response = await axios.get(
            `${process.env.REACT_APP_STOCKS_API}${index}`,
            {
              headers: {
                accept: 'application/json',
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
                'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
              },
            }
          );

          const {price: stockPrice} = response.data;

          return _.round(stockPrice * rate, 2) || 0;
        default:
          return 0;
      }

    } catch (error) {
      console.log('👉 Error: ', error);
      throw error;
    }
  };
