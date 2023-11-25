import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {getActualToken} from "../App";

export interface IUser {
  username: string,
  email: string,
  phoneNumber: string,
  avatar: string,
  role: string,
}

export enum LangEnum {
  eng = 'English',
  pl = 'Polish',
  ru = 'Russian',
}

export enum CurrencyEnum {
  usd = 'US $',
  pln = 'zł',
}

interface UserSlice {
  userInfo: IUser;
  lang: LangEnum,
  currency: CurrencyEnum,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: UserSlice = {
  userInfo: {
    username: 'Anonymous',
    email: 'anonymous@ann.com',
    phoneNumber: '+111111111',
    avatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
    role: 'User',
  },
  lang: LangEnum.eng,
  currency: CurrencyEnum.usd,
  loading: 'idle',
  error: null,
};

const backendApi = 'https://localhost:7247';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<string>) => {
      state.lang = LangEnum[action.payload as keyof typeof LangEnum];
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = CurrencyEnum[action.payload as keyof typeof CurrencyEnum];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeProfileAsync.fulfilled, (state, action) => {
        state.userInfo = action.payload;

        state.error = null;
      })
  }
});

export const {
  setLang,
  setCurrency
} = userSlice.actions;

export default userSlice.reducer;

export const changeProfileAsync = createAsyncThunk(
  'user/changeProfile',
  async (changedUser: IUser) => {
    try {
      const response = await axios.post(
        `${backendApi}/api/users`,
        JSON.stringify({
          username: changedUser.username,
          email: changedUser.email,
          phoneNumber: changedUser.phoneNumber,
          role: changedUser.role,
        }),
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      // return Promise.all(response.data.map(async (invest: IBasicInvestment) =>({
      //   ...invest,
      //   value: invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId),
      // })));
      return response.data;
    } catch (error) {
      throw error;
    }
  });
