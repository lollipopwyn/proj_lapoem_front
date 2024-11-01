import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import apiSlice from './features/auth/apiSlice';

const store = configureStore({
  // 5. store에 slide 등록
  reducer: {
    auth: authReducer,
    api: apiSlice,
  },
});

export default store;
