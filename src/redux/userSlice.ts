import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {getActualToken} from "../App";

export interface IUser {
  username: string,
  email: string,
  phoneNumber: string,
  avatar?: string,
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
    username: '',
    email: '',
    phoneNumber: '',
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
    setUser: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeProfileAsync.fulfilled, (state, action) => {

        state.error = null;
      })
      .addCase(changeProfileAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = 'Something was wrong. Please try again.';
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.userInfo = {
          ...action.payload,
          avatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
          role: 'User',
        };

        state.error = null;
      })
  }
});

export const {
  setLang,
  setCurrency,
  setUser
} = userSlice.actions;

export default userSlice.reducer;

export const changeProfileAsync = createAsyncThunk(
  'user/changeProfile',
  async (changedUser: IUser, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backendApi}/api/users`,
        {
          username: changedUser.username.replaceAll(' ', '-'),
          email: changedUser.email,
          phoneNumber: changedUser.phoneNumber,
        },
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'Something was wrong. Please try again.'})
    }
  });

export const changePasswordAsync = createAsyncThunk(
  'user/changePassword',
  async (changePass: { pass: string, confirmPass: string, email: string }, thunkAPI: any) => {

    try {
      const response = await axios.post(
        `${backendApi}/api/users/change-password`,
        {
          password: changePass.pass,
          confirmPassword: changePass.confirmPass ,
          email: changePass.email,
          token: getActualToken(),
        },
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      console.log('👉 ',);

      return response.data;
    } catch (error) {
      throw error;
    }
  });

export const getUserAsync = createAsyncThunk(
  'user/getUser',
  async () => {
    try {
      const response = await axios.get(
        `${backendApi}/api/users`,
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
