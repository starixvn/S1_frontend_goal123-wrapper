import { alertReducer } from '@modules/alert';
import { settingReducer as _settingReducer } from '@modules/setting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { localizationApi } from '@services/localizationApi';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import {
  PersistConfig,
  PersistedState,
  createMigrate,
  persistReducer,
  persistStore,
} from 'redux-persist';

const settingReducer = combineReducers({
  setting: _settingReducer,
});

const rootReducer = combineReducers({
  alert: alertReducer,
  setting: settingReducer,
  [localizationApi.reducerPath]: localizationApi.reducer,
});

type ReducerState = ReturnType<typeof rootReducer>;

const migrations = {
  1: (_s: PersistedState) => {},
  2: (_s: PersistedState) => {},
};

const persistConfig: PersistConfig<ReducerState> = {
  key: 'root',
  version: 2,
  storage: AsyncStorage,
  whitelist: ['setting'],
  migrate: createMigrate(migrations, { debug: true }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [localizationApi.middleware];

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
});

export const persistor = persistStore(store);
export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

setupListeners(store.dispatch);
export default store;
