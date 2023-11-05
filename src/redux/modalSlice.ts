import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ModalType} from "../components/Modal/Modal";
import {catMainType, dataMainType} from "../components/Table/Table";

interface ModalState {
  isActive: boolean;
  modalType: ModalType | null;
  modalData: dataMainType;
  modalCatData: catMainType[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Состояние загрузки
  error: string | null; // Ошибка, если что-то пошло не так
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
    setModalData: (state, action: PayloadAction<dataMainType>) => {
      state.modalData = action.payload;
    },
    setModalCatData: (state, action: PayloadAction<catMainType[]>) => {
      state.modalCatData = action.payload;
    },
  }
});

export const {
  toggleActive,
  setModalType,
  setModalData,
  setModalCatData
} = modalSlice.actions;

export default modalSlice.reducer;
