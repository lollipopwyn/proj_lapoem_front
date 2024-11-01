import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET_BOOK_LIST_API_URL } from '../../../util/apiUrl';
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
} from '../../../util/requestMethods';

const getBookListFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (getBookList) => {
    console.log(getBookList);
    const options = {
      body: JSON.stringify(getBookList), //표준 json 문자열로 변환
    };
    return await getRequest(apiURL, options);
  });
};

//북 리스트 갯
export const fetchBookListData = getBookListFetchThunk(
  'fetchGetBookList',
  GET_BOOK_LIST_API_URL
);

//create slice에서 사용하는 상태 체크
const handleFullfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};
const handleRejected = (state, action) => {
  state.isError = true;
};

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    fetchGetBookListData: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchBookListData.fulfilled,
        handleFullfilled('fetchGetBookListData')
      )
      .addCase(fetchBookListData.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
