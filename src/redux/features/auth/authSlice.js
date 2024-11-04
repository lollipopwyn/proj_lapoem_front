import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JOIN_USER_API_URL, LOGIN_USER_API_URL, VERIFY_USER_API_URL } from '../../../util/apiUrl';

// 로그아웃 URL 설정 (백엔드 서버의 경로로 지정)
const LOGOUT_USER_API_URL = `${
  process.env.NODE_ENV === 'production' ? 'http://222.112.27.120:8002' : 'http://localhost:8002'
}/logout`;

// 초기 상태 설정
const initialState = {
  user: null,
  isLoggedIn: false,
  error: null,
  message: null, // 메시지 상태 추가
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
    return response.data; // 서버에서 사용자 정보를 반환
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '로그인 오류');
  }
});

// 새로고침 시 로그인 상태 초기화
export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(VERIFY_USER_API_URL, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    return rejectWithValue('Token verification failed');
  }
});

// 로그아웃 - 서버에 쿠키 삭제 요청을 보내는 thunk
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axios.post(LOGOUT_USER_API_URL, {}, { withCredentials: true }); // 서버에 로그아웃 요청
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return rejectWithValue('Logout failed');
  }
});

// Redux slice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null; // 메시지 초기화 액션
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
      // 로그인 처리
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // 인증 상태 초기화 처리
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      })
      // 로그아웃 처리
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.message = '로그아웃 되었습니다.'; // 로그아웃 성공 메시지 설정
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = authSlice.actions;
export default authSlice.reducer;
