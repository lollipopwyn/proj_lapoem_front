// util/apiUrl.js
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://222.112.27.120:8002' // 배포용 URL
    : 'http://localhost:8002'; // 로컬 개발용 URL

// FastAPI 서버의 BASE URL (HTTP API 요청용)
const FASTAPI_HTTP_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://222.112.27.120:9002' // 배포용 HTTP API URL
    : 'http://localhost:9002'; // 로컬 개발용 HTTP API URL

// FastAPI WebSocket URL
const FASTAPI_WEBSOCKET_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'ws://222.112.27.120:9002' // 배포용 WebSocket URL
    : 'ws://localhost:9002'; // 로컬 개발용 WebSocket URL

// GET 요청 URL
export const GET_BOOK_LIST_API_URL = `${BASE_URL}/book-list`;
export const GET_BOOK_DETAIL_API_URL = (bookId) => `${BASE_URL}/book-list/${bookId}`;
export const GET_BOOK_REVIEWS_API_URL = (bookId) => `${BASE_URL}/book-list/${bookId}/reviews`;
export const GET_REVIEW_BY_ID_API_URL = (bookId,reviewId) => `${BASE_URL}/book-list/${bookId}/reviews/${reviewId}`;
export const GET_SEARCH_BOOKS_API_URL = `${BASE_URL}/search-books`;
export const GET_BOOK_BY_CATEGORY_API_URL = `${BASE_URL}/search-category`;
export const GET_BOOK_ALL_CATEGORIES_API_URL = `${BASE_URL}/all-categories`;

export const GET_COMMUNITY_POSTS_API_URL = `${BASE_URL}/community`; // 커뮤니티 게시글 목록 조회
export const GET_USER_STATS_API_URL = `${BASE_URL}/user/stats`;
export const GET_HOT_TOPICS_API_URL = `${BASE_URL}/hot-topics`;
export const GET_TOP_USERS_API_URL = `${BASE_URL}/top-users`;
export const GET_NEW_BOOK_API_URL = `${BASE_URL}/new-book`;
export const GET_BEST_BOOK_API_URL = `${BASE_URL}/best-book`;

// POST 요청 URL
export const JOIN_USER_API_URL = `${BASE_URL}/join`; // 회원 가입 URL
export const LOGIN_USER_API_URL = `${BASE_URL}/login`; // 회원 로그인 URL
export const LOGOUT_USER_API_URL = `${BASE_URL}/logout`; // 회원 로그아웃 URL
export const VERIFY_USER_API_URL = `${BASE_URL}/verify`; // 사용자 인증 확인 URL
export const CREATE_COMMUNITY_POST_API_URL = `${BASE_URL}/community`; // 커뮤니티 새 게시글 작성
export const CREATE_COMMENT_API_URL = `${BASE_URL}/community/comment`; // 댓글 작성 URL
export const CREATE_BOOK_REVIEW_API_URL = (bookId) => `${BASE_URL}/book-list/${bookId}/reviews`; //책 리뷰 작성

// DELETE 요청 URL
export const DELETE_COMMENT_API_URL = (commentId) => `${BASE_URL}/community/comment/${commentId}`; // 댓글 삭제 URL
export const DELETE_REVIEW_API_URL = (bookId,reviewId) => `${BASE_URL}/book-list/${bookId}/reviews/${reviewId}`;//리뷰 삭제

export const API_CHAT_URL = `${FASTAPI_HTTP_BASE_URL}/api/chat`; // HTTP API URL
export const WEBSOCKET_CHAT_URL = `${FASTAPI_WEBSOCKET_BASE_URL}/ws/chat`; // WebSocket URL
