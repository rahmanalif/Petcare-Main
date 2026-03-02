import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import serviceReducer from './serviceSlice';
import userReducer from './userSlice';
import petReducer from './petSlice';
import boardingSearchReducer from './boardingSearchSlice';
import walkingSearchReducer from './walkingSearchSlice';
import daycareSearchReducer from './daycareSearchSlice';
import sitterProfileReducer from './sitterProfileSlice';

// New Import
import bookingReducer from './sitter/bookingSlice';
import chatReducer from './chat/chatSlice';
import sitterReducer from './sitter/sitterSlice';
import paymentReducer from './sitter/paymentSlice';
import settingReducer from './settingSlice';


const authPersistConfig = {
  key: 'auth',
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    service: serviceReducer,
    user: userReducer,
    pets: petReducer,
    boardingSearch: boardingSearchReducer,
    walkingSearch: walkingSearchReducer,
    daycareSearch: daycareSearchReducer,
    sitterProfile: sitterProfileReducer,
    
    // New Reducer Added Here
    booking: bookingReducer,
    chat: chatReducer,
    sitter: sitterReducer,
    payment: paymentReducer,
    setting: settingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);