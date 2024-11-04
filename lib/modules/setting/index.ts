import { tolgee } from '@integrations/tolgee';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LANGUAGE_CODE } from '@utilities/constant';
import dayjs, { Dayjs } from 'dayjs';

interface PopUpExpire {
  [key: string]: Dayjs | null;
}

export interface ShieldDeviceResult {
  platform: string;
  session_id: string;
  timestamp: string;
  version: string;
  device_intelligence:
    | ShieldDeviceIntelligenceIOS
    | ShieldDeviceIntelligenceAndroid;
}
export interface ShieldDeviceIntelligenceIOS {
  app_tampering: boolean;
  device_score: number;
  hooking: boolean;
  is_emulated: boolean;
  is_jailbroken: boolean;
  running_gps_spoofers: boolean;
  running_vpn_spoofers: boolean;
  shield_id: string;
  suspicious_factory_reset: boolean;
}

export interface ShieldDeviceIntelligenceAndroid {
  app_tampering: boolean;
  auto_clicker_enabled: boolean;
  device_score: number;
  hooking: boolean;
  is_device_masked: boolean;
  is_emulated: boolean;
  is_jailbroken: boolean;
  running_clone_apps: boolean;
  running_gps_spoofers: boolean;
  running_vpn_spoofers: boolean;
  shield_id: string;
  suspicious_factory_reset: boolean;
  virtual_os: boolean;
}

export interface PopUpPromotionLastOpenData {
  username: string;
  dateTime: string;
}

export interface ISetting {
  showBalance: boolean;
  locale: LANGUAGE_CODE;
  popUpExpiry: PopUpExpire;
  shield?: ShieldDeviceResult;
  popUpPromotionLastOpenData: PopUpPromotionLastOpenData[];
}
export const DomainListHintPostfix = '-DomainListHint';
export const DepositListHintPostfix = '-DepositListHint';
export const PromoPopHint = 'PromoPopHint';

const initialState: ISetting = {
  showBalance: true,
  locale: LANGUAGE_CODE.VIETNAM,
  popUpExpiry: {},
  popUpPromotionLastOpenData: [],
};

const settingSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    toggleShowBalance: (state, action: PayloadAction<boolean>) => {
      state.showBalance = action.payload;
    },
    setLocale: (state, action: PayloadAction<string>) => {
      tolgee.changeLanguage(action.payload);
      state.locale = action.payload as LANGUAGE_CODE;
    },
    setPopUpExpiry: (state, action: PayloadAction<string>) => {
      state.popUpExpiry[action.payload] = dayjs().add(1, 'day');
    },
    setShieldDeviceResult: (
      state,
      action: PayloadAction<ShieldDeviceResult>,
    ) => {
      state.shield = action.payload;
    },
    setPopUpPromotionLastOpenDataDetail(
      state,
      action: PayloadAction<PopUpPromotionLastOpenData>,
    ) {
      const currentDataIndex = state.popUpPromotionLastOpenData.findIndex(
        data => data.username === action.payload.username,
      );
      if (currentDataIndex > -1) {
        state.popUpPromotionLastOpenData[currentDataIndex] = action.payload;
        return;
      }
      state.popUpPromotionLastOpenData.push(action.payload);
    },
    /** Remove all the last open data if the data is after 12AM of each day */
    setPopUpPromotionLastOpenData(
      state,
      action: PayloadAction<PopUpPromotionLastOpenData[]>,
    ) {
      state.popUpPromotionLastOpenData = action.payload;
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(fetchProfile.fulfilled, (state, { payload }) => {
  //     state.locale = payload.langId as LANGUAGE_CODE;
  //   });
  // },
});

const { actions, reducer } = settingSlice;
export const SettingActions = actions;
export const settingReducer = reducer;
