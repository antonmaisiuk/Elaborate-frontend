import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SettingsType} from "../components/Settings/Settings";
import axios from 'axios';
import {getActualToken} from "../App";

interface SettingsState {
  type: SettingsType;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
}

const initialState: SettingsState = {
  type: SettingsType.profile,
  loading: 'idle',
  error: null,
};

const backendApi = 'https://localhost:7247';

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.type = SettingsType[action.payload as keyof typeof SettingsType];
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(changeProfileAsync.fulfilled, (state, action) => {
  //       state.user = action.payload;
  //
  //       state.error = null;
  //     })
  // }
});

export const {
  setType,
} = settingsSlice.actions;

export default settingsSlice.reducer;
