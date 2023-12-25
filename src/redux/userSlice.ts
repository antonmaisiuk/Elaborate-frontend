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
  avatar: string,
  avatarFile?: File,
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
  route: string,
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
    avatar: '',
  },
  languages: [],
  currencies: [],
  route: '',
  loading: 'idle',
  error: null,
};



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
    setRoute: (state, action: PayloadAction<string>) => {
      state.route = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeProfileAsync.fulfilled, (state, action) => {
        state.userInfo.avatar = action.payload.url;

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
          avatar: action.payload.photoFileName || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
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
  setUser,
  setRoute,
} = userSlice.actions;

export default userSlice.reducer;

export const changeProfileAsync = createAsyncThunk(
  'user/changeProfile',
  async (changedUser: IUser, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append('userDto.Username', changedUser.username);
      data.append('UserDto.Email', changedUser.email);
      data.append('userDto.PhoneNumber', changedUser.phoneNumber);
      data.append('SettingsDto.LanguagesId', changedUser.lang);
      data.append('SettingsDto.CurrenciesId', changedUser.currency);
      data.append('SettingsDto.IsDarkScreen', `${changedUser.isDarkScreen}`);
      data.append('ContentType', 'multipart/form-data');
      data.append('photo', changedUser.avatarFile as Blob || null);
      data.append('FileName', changedUser.avatarFile?.name as string || 'null');

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users`,
        data,
        {
          headers: {
            accept: 'multipart/form-data',
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
        `${process.env.REACT_APP_API_URL}/api/users/change-password`,
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
        `${process.env.REACT_APP_API_URL}/api/users`,
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
