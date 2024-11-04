// util/apiUrl.js
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://222.112.27.120:8002' // 배포용 URL
    : 'http://localhost:8002'; // 로컬 개발용 URL

// GET 요청 URL
export const GET_BOOK_LIST_API_URL = `${BASE_URL}/book-list`;
export const GET_SEARCH_BOOKS_API_URL = `${BASE_URL}/search-books`;
export const GET_BOOK_BY_CATEGORY_API_URL = `${BASE_URL}/search-category`;
export const GET_BOOK_ALL_CATEGORIES_API_URL = `${BASE_URL}/all-categories`;
export const GET_COMMUNITY_POSTS_API_URL = `${BASE_URL}/community`; // 커뮤니티 게시글 목록 조회

// POST 요청 URL
export const JOIN_USER_API_URL = `${BASE_URL}/join`; // 회원 가입 URL
export const LOGIN_USER_API_URL = `${BASE_URL}/login`; // 회원 로그인 URL
export const VERIFY_USER_API_URL = `${BASE_URL}/verify`; // 사용자 인증 확인 URL
export const CREATE_COMMUNITY_POST_API_URL = `${BASE_URL}/community`; // 커뮤니티 새 게시글 작성
