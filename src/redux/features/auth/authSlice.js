import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const joinUser = createAsyncThunk('auth/joinUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8002/join', userData); // 백엔드 URL 명시
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8002/login', loginData, { withCredentials: true });
    const token = response.data.token;
    localStorage.setItem('token', token); // 토큰을 localStorage에 저장

    // 로그인 후 인증 상태를 초기화하여 Redux에 유저 정보 저장
    await dispatch(initializeAuth());

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// 새로고침 시 로그인 상태 초기화
export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found');

  try {
    const response = await axios.get('http://localhost:8002/verify', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    return rejectWithValue('Token verification failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token'); // 로그아웃 시 토큰 제거
      state.user = null;
      state.isLoggedIn = false;
      alert('로그아웃 되었습니다.'); // 로그아웃 메시지 추가
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
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('token'); // 토큰 제거
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
