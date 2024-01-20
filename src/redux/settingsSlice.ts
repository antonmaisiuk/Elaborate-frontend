import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SettingsType} from "../components/Settings/Settings";

interface SettingsState {
  type: SettingsType;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SettingsState = {
  type: SettingsType.profile,
  loading: 'idle',
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.type = SettingsType[action.payload as keyof typeof SettingsType];
    },
  },
});

export const {
  setType,
} = settingsSlice.actions;

export default settingsSlice.reducer;
