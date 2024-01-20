import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ModalType} from "../components/Modal/Modal";
import {catMainType, dataMainType} from "../components/Table/Table";
import {IItem, IOtherInvestment} from "../components/Investments/Overview/InvestOverview";

interface ModalState {
  isActive: boolean;
  modalType: ModalType | null;
  modalData: dataMainType | IOtherInvestment;
  modalCatData: catMainType[];
  modalItems: IItem[],
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ModalState = {
  isActive: false,
  modalType: 0,
  modalData: {
    id: '',
    name: '',
    category: '',
    categoryId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  },
  modalCatData: [],
  modalItems: [],
  loading: 'idle',
  error: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setModalType: (state, action: PayloadAction<ModalType>) => {
      state.modalType = action.payload;
    },
    setModalData: (state, action: PayloadAction<dataMainType | IOtherInvestment>) => {
      state.modalData = action.payload;
    },
    setModalCatData: (state, action: PayloadAction<catMainType[]>) => {
      state.modalCatData = action.payload;
    },
    setModalItems: (state, action: PayloadAction<IItem[]>) => {
      state.modalItems = action.payload;
    },
  }
});

export const {
  toggleActive,
  setModalType,
  setModalData,
  setModalCatData,
  setModalItems
} = modalSlice.actions;

export default modalSlice.reducer;
