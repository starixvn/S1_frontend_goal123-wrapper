import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankInfoType } from 'src/screens/profile/BankInfoPage/hooks/useBankInfo';

export enum ModalControlType {
  AddBankInfo = 'addBankInfo',
  AddCryptoAccount = 'addCryptoAccount',
}

export interface ModalControlItem {
  isOpen?: boolean;
  params?: {
    type?: BankInfoType;
    title?: string;
  };
}

export interface ModalControlTogglePayload {
  type: ModalControlType;
  value: boolean;
  params?: {
    type?: BankInfoType;
    title?: string;
  };
}

const initialState: { [key in ModalControlType]: ModalControlItem } = {
  addBankInfo: {},
  addCryptoAccount: {},
};

const modalControlSlice = createSlice({
  name: 'modalControl',
  initialState,
  reducers: {
    toggleModal: (
      state,
      {
        payload: { type: modalType, value, params },
      }: PayloadAction<ModalControlTogglePayload>,
    ) => {
      const mType = state[modalType];
      mType.isOpen = value ?? !value;
      mType.params = params;
    },
  },
});

const { reducer, actions } = modalControlSlice;
export const modalControlReducer = reducer;
export const ModalControlActions = actions;
