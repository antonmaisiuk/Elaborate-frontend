import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {getActualToken} from "../App";
import i18next from "i18next";
import _ from "lodash";
import {fetchOtherInvestAsync} from "./otherInvestSlice";
import moment from "moment";

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

interface UserSlice {
  userInfo: IUser;
  languages: ILang[],
  currencies: ICurrency[],
  inflation: { value: any, date: string}[],
  history: { value: any, date: string}[],
  route: string,
  userLoading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  historyLoading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
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
  inflation: [],
  history: [],
  route: '',
  userLoading: 'idle',
  historyLoading: 'idle',
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
      .addCase(changeProfileAsync.pending, (state) => {
        // state.loading = 'pending';
      })
      .addCase(changeProfileAsync.fulfilled, (state, action) => {
        // state.userInfo.avatar = action.payload.url;

        const currentLang = _.filter(state.languages, (lang) => state.userInfo.lang === lang.id)[0].index;
        i18next
          .changeLanguage(currentLang)
          .then((t) => {
            t('key'); // -> same as i18next.t
          });
        document.documentElement.lang = currentLang;

        state.error = null;
      })
      .addCase(changeAvatarAsync.fulfilled, (state, action) => {
        state.userInfo.avatar = action.payload.url;

        state.error = null;
      })
      .addCase(deleteAvatarAsync.fulfilled, (state, action) => {
        state.userInfo.avatar = process.env.REACT_APP_DEFAULT_AVATAR || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg';

        state.error = null;
      })
      .addCase(changeProfileAsync.rejected, (state, action) => {
        // state.loading = 'failed';
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
        state.userLoading = 'succeeded';
      })
      .addCase(getUserAsync.pending, (state) => {
        state.userLoading = 'pending';
      })
      .addCase(getUserHistoryAsync.fulfilled, (state, action) => {
        const [ history, inflation ] = action.payload

        state.history = _.map(history, (item) => ({ value: item.value, date: moment(item.dateOfSave).format('DD.MM.YYYY')}));
        state.inflation = _.map(inflation, (item) => ({ value: item.value, date: moment(item.date).format('DD.MM.YYYY')}));
        // console.log('👉 state.history: ', state.history);

        state.error = null;
        state.historyLoading = 'succeeded';
      })
      .addCase(getUserHistoryAsync.pending, (state) => {
        state.historyLoading = 'pending';
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

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users`,
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

export const changeAvatarAsync = createAsyncThunk(
  'user/changeAvatar',
  async (changedUser: IUser, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append('photo', changedUser.avatarFile as Blob || null);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/photos/upload`,
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

export const deleteAvatarAsync = createAsyncThunk(
  'user/deleteAvatar',
  async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/photos`,
        {
          headers: {
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return response.data;
    } catch (error) {
      return false;
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

export const getUserHistoryAsync = createAsyncThunk(
  'user/getUserHistory',
  async () => {
    try {
      const history = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/history`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );
      const inflation = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/inflation`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${getActualToken()}`
          },
        }
      );

      return [history.data, inflation.data];
    } catch (error) {
      throw error;
    }
  });
