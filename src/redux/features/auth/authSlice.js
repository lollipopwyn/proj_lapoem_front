import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JOIN_USER_API_URL, LOGIN_USER_API_URL, LOGOUT_USER_API_URL } from '../../../util/apiUrl';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoggedIn: !!localStorage.getItem('user'),
  isAuthInitializing: false,
  error: null,
  message: null,
};

// 회원가입
export const joinUser = createAsyncThunk('auth/joinUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(JOIN_USER_API_URL, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '회원가입 오류');
  }
});

// 로그인
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(LOGIN_USER_API_URL, loginData, {
      withCredentials: true,
    });
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData)); // 로컬 스토리지에 사용자 정보 저장
    return userData;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '로그인 오류');
  }
});

// 새로고침 시 로그인 상태 초기화
export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      return storedUser; // 로컬 스토리지에 저장된 사용자 정보를 반환
    } else {
      // 로컬 스토리지에 유저가 없는 경우 요청을 보내지 않음
      return rejectWithValue(null); // 에러로 간주하지 않음
    }
  } catch (error) {
    return rejectWithValue('Token verification failed');
  }
});

// 로그아웃
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axios.post(LOGOUT_USER_API_URL, {}, { withCredentials: true });
    localStorage.removeItem('user'); // 로그아웃 시 로컬 스토리지에서 사용자 정보 제거
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return rejectWithValue('Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinUser.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(joinUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.isAuthInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        console.log('Auth initialized with user:', action.payload);
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isAuthInitializing = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isAuthInitializing = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.message = '로그아웃 되었습니다.';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = authSlice.actions;
export default authSlice.reducer;
