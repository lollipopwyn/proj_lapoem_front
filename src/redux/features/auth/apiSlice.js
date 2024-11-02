import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// API 요청에 사용될 엔드포인트 URL을 import함
import { GET_BOOK_LIST_API_URL } from '../../../util/apiUrl';
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
} from '../../../util/requestMethods';

//  1. 동적 fetch Thunk 생성기-----------------------
//    actionType (예: fetchGetBookList)
//    apiURL - 엔드포인트 URL
//    requestMethod - HTTP 요청 함수 (예: getRequest)
const createApiThunk = (actionType, apiURL, requestMethod) => {
  return createAsyncThunk(actionType, async (params) => {
    const options = {
      ...(requestMethod === getRequest ? {} : { body: JSON.stringify(params) }),
    };
    return await requestMethod(apiURL, options);
  });
};

// 2. 각 Thunks 정의---------------------------------
//    특정 API 요청을 위해 createApiThunk를 호출하여 Thunk 함수 생성

//북 리스트 관련 Thunks
export const fetchBookListData = createApiThunk(
  'api/fetchGetBookList',
  GET_BOOK_LIST_API_URL,
  getRequest
);

// 다른 Thunks 생성

// 3. 비동기 API 호출 처리------------------------------
// fulfilled 상태를 처리하는 핸들러 함수 생성
const handleFullfilled = (stateKey) => (state, action) => {
  state[stateKey] = Array.isArray(action.payload)
    ? action.payload //배열일 경우 그대로 state[stateKey]에 할당
    : action.payload.data || action.payload; //객체일 경우 data 속성을 우선적으로 할당하고, 만약 data가 없다면 action.payload 자체를 할당
};
// rejected 상태를 처리하는 핸들러 함수
const handleRejected = (state, action) => {
  state.isError = true;
  state.errorMessage = action.error.message;
};

// 4. apiSlice 슬라이스 생성--------------------------
//    Redux 슬라이스를 생성하여 초기 상태와 비동기 액션의 상태 관리 설정
const apiSlice = createSlice({
  name: 'api',
  initialState: {
    fetchGetBookList: [],
    // 다른 api슬라이스 초기 상태 지정
    isError: false,
    errorMessage: '',
  },

  // 비동기 액션을 처리하는 extraReducers 설정
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchBookListData.fulfilled,
        handleFullfilled('fetchGetBookList')
      )
      .addCase(fetchBookListData.rejected, handleRejected);
    // 다른 extraReducers 설정
  },
});

export default apiSlice.reducer;