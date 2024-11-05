import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// API 요청에 사용될 엔드포인트 URL을 import함
import {
  GET_BOOK_LIST_API_URL,
  GET_SEARCH_BOOKS_API_URL,
  GET_BOOK_BY_CATEGORY_API_URL,
  GET_BOOK_ALL_CATEGORIES_API_URL,
  GET_NEW_BOOK_API_URL,
  GET_BEST_BOOK_API_URL,
  GET_COMMUNITY_POSTS_API_URL,
  CREATE_COMMUNITY_POST_API_URL,
  // 다른 엔드포인트 URL
} from '../../../util/apiUrl';
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

// 검색 관련 Thunks
export const fetchSearchBooksData = createApiThunk(
  'api/fetchSearchBooks',
  GET_SEARCH_BOOKS_API_URL,
  getRequest
);

// 카테고리 필터 조회 Thunks
export const fetchBookByCategoryData = createApiThunk(
  'api/fetchBookByCategory',
  GET_BOOK_BY_CATEGORY_API_URL,
  getRequest
);

// 책 카테고리 Thunks
export const fetchBookAllCategoriesData = createApiThunk(
  'api/fetchBookAllCategories',
  GET_BOOK_ALL_CATEGORIES_API_URL,
  getRequest
);

// 신간 도서 불러오기 Thunks
export const fetchNewBookData = createApiThunk(
  'api/fetchNewBook',
  GET_NEW_BOOK_API_URL,
  getRequest
);

// 베스트셀러 불러오기 Thunks
export const fetchBestBookData = createApiThunk(
  'api/fetchBestBook',
  GET_BEST_BOOK_API_URL,
  getRequest
);

// 커뮤니티 게시글 가져오기 Thunk
export const fetchCommunityPostsData = createAsyncThunk(
  'api/fetchCommunityPosts',
  async ({ viewType, member_num }) => {
    const visibility = viewType === 'Only me' ? 'false' : 'true';
    const url = `${GET_COMMUNITY_POSTS_API_URL}?visibility=${visibility}${
      member_num ? `&member_num=${member_num}` : ''
    }`;
    console.log(
      'Requesting posts with visibility:',
      visibility,
      'and member_num:',
      member_num
    );
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
);

// 커뮤니티 새 게시글 생성 Thunk
export const createCommunityPostData = createApiThunk(
  'api/createCommunityPost',
  CREATE_COMMUNITY_POST_API_URL,
  postRequest
);

export const fetchCommunityPostDetail = createAsyncThunk(
  'community/fetchPostDetail',
  async (postId, thunkAPI) => {
    try {
      const response = await fetch(`${GET_COMMUNITY_POSTS_API_URL}/${postId}`);

      // 응답이 JSON 형식이 아니면 에러 던지기
      const contentType = response.headers.get('content-type');
      if (
        !response.ok ||
        !contentType ||
        !contentType.includes('application/json')
      ) {
        throw new Error(
          'Failed to fetch post details or invalid response format'
        );
      }

      const data = await response.json();
      console.log('Fetched Post Detail:', data); // 서버로부터 받아온 데이터 확인
      return data; // 단일 게시글 반환
    } catch (error) {
      console.error('Error fetching post details:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 다른 관련 Thunks생성

// 3. 비동기 API 호출 처리------------------------------
// fulfilled 상태를 처리하는 핸들러 함수 생성
const handleFullfilled = (stateKey) => (state, action) => {
  state[stateKey] = Array.isArray(action.payload)
    ? action.payload //배열일 경우 그대로 state[stateKey]에 할당
    : action.payload.data || action.payload; //객체일 경우 data 속성을 우선적으로 할당하고, 만약 data가 없다면 action.payload 자체를 할당
  state.isLoading = false;
};

// rejected 상태를 처리하는 핸들러 함수
const handleRejected = (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.errorMessage = action.error.message;
};

const handlePending = (state) => {
  state.isLoading = true;
  state.isError = false;
  state.errorMessage = '';
};

// 4. apiSlice 슬라이스 생성--------------------------
//    Redux 슬라이스를 생성하여 초기 상태와 비동기 액션의 상태 관리 설정
const apiSlice = createSlice({
  name: 'api',
  initialState: {
    fetchGetBookList: [],
    fetchSearchBooks: null,
    fetchBookByCategory: null,
    fetchBookAllCategories: [],
    fetchNewBookData: [],
    fetchBestBookData: [],
    fetchCommunityPosts: [],
    postDetail: null,
    createCommunityPost: null,
    isLoading: false,
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
      .addCase(fetchBookListData.rejected, handleRejected)
      // -----------------------------------------------------
      .addCase(
        fetchSearchBooksData.fulfilled,
        handleFullfilled('fetchSearchBooks')
      )
      .addCase(fetchSearchBooksData.rejected, handleRejected)

      .addCase(
        fetchBookByCategoryData.fulfilled,
        handleFullfilled('fetchBookByCategory')
      )
      .addCase(fetchBookByCategoryData.rejected, handleRejected)

      .addCase(
        fetchBookAllCategoriesData.fulfilled,
        handleFullfilled('fetchBookAllCategories')
      )
      .addCase(fetchBookAllCategoriesData.rejected, handleRejected)

      .addCase(fetchNewBookData.fulfilled, handleFullfilled('fetchNewBookData'))
      .addCase(fetchNewBookData.rejected, handleRejected)

      .addCase(
        fetchBestBookData.fulfilled,
        handleFullfilled('fetchBestBookData')
      )
      .addCase(fetchBestBookData.rejected, handleRejected)

      // 여기부터 커뮤니티 게시글 처리
      .addCase(
        fetchCommunityPostsData.fulfilled,
        handleFullfilled('fetchCommunityPosts')
      )
      .addCase(fetchCommunityPostsData.rejected, handleRejected)

      .addCase(
        createCommunityPostData.fulfilled,
        handleFullfilled('createCommunityPost')
      )
      .addCase(createCommunityPostData.rejected, handleRejected)
      .addCase(fetchCommunityPostDetail.pending, handlePending)
      .addCase(
        fetchCommunityPostDetail.fulfilled,
        handleFullfilled('postDetail')
      )
      .addCase(fetchCommunityPostDetail.rejected, handleRejected);
    // -----------------------------------------------------여기까지 커뮤니티
    // 다른 extraReducers 설정
  },
});

export default apiSlice.reducer;
