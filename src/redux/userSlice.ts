import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {getActualToken} from "../App";
import i18next from "i18next";
import _ from "lodash";

export interface IUser {
  username: string,
  email: string,
  phoneNumber: string,
  lang: string,
  currency: string,
  isDarkScreen: boolean,
  avatar?: string,
  // role: string,
}

export interface ILang {
  id: string,
  name: string,
  index: string,
}
export interface ICurrency {
  id: string,
  name: string,
  index: string,
}

// export enum LangEnum {
//   eng = 'English',
//   pl = 'Polish',
//   ru = 'Russian',
// }
//
export enum ThemeEnum {
  dark = 'Dark',
  white = 'White',
}
//
// export enum CurrencyEnum {
//   usd = 'US $',
//   pln = 'zł',
// }

interface UserSlice {
  userInfo: IUser;
  languages: ILang[],
  currencies: ICurrency[],
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: UserSlice = {
  userInfo: {
    username: '',
    email: '',
    phoneNumber: '',
    lang: '',
    currency: '',
    isDarkScreen: false,
    avatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
    // role: 'User',
  },
  languages: [],
  currencies: [],
  loading: 'idle',
  error: null,
};

const backendApi = 'https://localhost:7247';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<string>) => {
      state.userInfo.lang = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.userInfo.currency = action.payload;
    },
    setIsDark: (state, action: PayloadAction<boolean>) => {
      state.userInfo.isDarkScreen = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeProfileAsync.fulfilled, (state, action) => {
        const currentLang = _.filter(state.languages, (lang) => state.userInfo.lang === lang.id)[0].index;
        i18next
          .changeLanguage(currentLang)
          .then((t) => {
            t('key'); // -> same as i18next.t
          });
        document.documentElement.lang = currentLang;
        state.error = null;
      })
      .addCase(changeProfileAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = 'Something was wrong. Please try again.';
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        const { user, userSettings, languagesList, currenciesList } = action.payload
        state.userInfo = {
          ...user,
          avatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
          role: 'User',
        };
        state.userInfo.lang = userSettings?.languagesId;
        state.userInfo.currency = userSettings?.currenciesId;
        state.userInfo.isDarkScreen = userSettings?.isDarkScreen;
        state.languages = languagesList;
        state.currencies = currenciesList;

        const currentLang = _.filter(state.languages, (lang) => state.userInfo.lang === lang.id)[0].index;
        i18next
          .changeLanguage(currentLang)
          .then((t) => {
            t('key'); // -> same as i18next.t
          });
        document.documentElement.lang = currentLang;

        state.error = null;
      })
  }
});

export const {
  setLang,
  setCurrency,
  setIsDark,
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
          userDto: {
            username: changedUser.username,
            email: changedUser.email,
            phoneNumber: changedUser.phoneNumber
          },
          settingsDto: {
            languagesId: changedUser.lang,
            currenciesId: changedUser.currency,
            isDarkScreen: changedUser.isDarkScreen,
          }
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
