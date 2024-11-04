import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JOIN_USER_API_URL, LOGIN_USER_API_URL, VERIFY_USER_API_URL } from '../../../util/apiUrl'; // URL 상수 가져오기

export const joinUser = createAsyncThunk('auth/joinUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(JOIN_USER_API_URL, userData); // 상수 사용
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '회원가입 오류');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(LOGIN_USER_API_URL, loginData, {
      withCredentials: true,
    }); // 상수 사용
    const token = response.data.token;
    localStorage.setItem('token', token); // 토큰을 localStorage에 저장

    // 로그인 후 인증 상태를 초기화하여 Redux에 유저 정보 저장
    await dispatch(initializeAuth());

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '로그인 오류');
  }
});

// 새로고침 시 로그인 상태 초기화
// 새로고침 시 로그인 상태 초기화 (쿠키 기반 인증)
export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(VERIFY_USER_API_URL, {
      withCredentials: true, // 쿠키만으로 인증
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
        console.log('Initialized user:', action.payload);
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
