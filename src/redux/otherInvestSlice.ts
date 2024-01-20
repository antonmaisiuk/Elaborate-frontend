import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {getActualToken} from "../App";
import moment from "moment/moment";
import {
  IOtherInvestment
} from "../components/Investments/Overview/InvestOverview";
import {getCustomExchangeRate} from "./userSlice";

interface OtherInvestsState {
  otherInvests: IOtherInvestment[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OtherInvestsState = {
  otherInvests: [],
  loading: 'idle',
  error: null,
};

const otherInvestSlice = createSlice({
  name: 'otherInvestments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherInvestAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchOtherInvestAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';

        state.otherInvests = action.payload;

        state.error = null;
        state.loading = 'succeeded';
      })

      .addCase(addOtherInvestAsync.fulfilled, (state, action) => {
        state.otherInvests.push(action.payload);
        state.error = null;
      })
      .addCase(updateOtherInvestAsync.fulfilled, (state, action) => {
        const index = state.otherInvests.findIndex(
          (invest) => invest.id === action.payload.id
        );
        if (index !== -1) {
          state.otherInvests[index] = {
            ...action.payload,
            date: moment(action.payload.date).format('DD.MM.YYYY'),
          };
        }
        state.error = null;
      })
      .addCase(deleteOtherInvestAsync.fulfilled, (state, action) => {
        state.otherInvests = state.otherInvests.filter(
          (invest) => invest.id !== action.payload
        );
        state.error = null;
      })
  },
});

export const {} = otherInvestSlice.actions;

export default otherInvestSlice.reducer;

export const fetchOtherInvestAsync = createAsyncThunk(
  'otherInvestments/fetchOtherInvests',
  async (_,thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/otherinvestment`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return await Promise.all(response.data.map(async (invest: any) => ({
          id: invest.id,
          title: invest.title,
          comment: invest.comment,
          date: moment(invest.dateOfCreated).format('DD.MM.YYYY'),
          currencyIndex: invest.currencyIndex,
          originalValue: invest.value,
          value: invest.value * (await getCustomExchangeRate(invest.currencyIndex, state.user.userInfo.currSlug)),
        } as IOtherInvestment
      )));
    } catch (error) {
      throw error;
    }
});

export const addOtherInvestAsync = createAsyncThunk(
  'otherInvestments/addOtherInvests',
  async (invest: IOtherInvestment, thunkAPI: any) => {

    const state = thunkAPI.getState();
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/otherinvestment`,
      JSON.stringify({
        dateOfCreated: moment().toISOString(),
        comment: invest.comment,
        title: invest.title,
        value: invest.originalValue,
        currencyIndex: invest.currencyIndex,
      }),
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getActualToken()}`
        },
      });

    const newInvest = response.data as IOtherInvestment;

    return {
      ...newInvest,
      originalValue: newInvest.value,
      value: newInvest.value * ( await getCustomExchangeRate(newInvest.currencyIndex, state.user.userInfo.currSlug)),
      date: moment().format('DD.MM.YYYY'),
    };
  }
);

export const updateOtherInvestAsync = createAsyncThunk(
  'otherInvestments/updateOtherInvest',
  async (invest: IOtherInvestment, thunkAPI: any) => {
    const state = thunkAPI.getState();

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/otherinvestment/${invest.id}`,
      JSON.stringify({
        comment: invest.comment,
        title: invest.title,
        value: invest.value,
        currencyIndex: invest.currencyIndex,
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
      value: invest.originalValue * ( await getCustomExchangeRate(invest.currencyIndex, state.user.userInfo.currSlug)),
    };
  }
);

export const deleteOtherInvestAsync = createAsyncThunk(
  'otherInvestments/deleteOtherInvest',
  async (investId: string) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/user/otherinvestment/${investId}`,
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
