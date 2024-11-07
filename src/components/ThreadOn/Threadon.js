import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThreadCard from "./ThreadCard";
import SearchBar from "../Common/SearchBar";
import PageNation from "../PageNation";
import "./Threadon.css";
import {
  GET_SEARCH_THREADS_API_URL,
  GET_THREADS_API_URL,
} from "../../util/apiUrl";

function Threadon() {
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // 전체 항목 수 추가
  const navigate = useNavigate();

  useEffect(() => {
    fetchThreads();
  }, [currentPage, searchTerm]);

  const fetchThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(GET_THREADS_API_URL, {
        params: {
          page: currentPage, // 현재 페이지 번호(몇 번째 페이지를 가져올지.)
          limit: itemsPerPage, // 한 페이지에 표시할 스레드 수 (한 페이지에 몇 개의 스레드를 보여줄지.)
          query: searchTerm, // 검색어 (없을 수도 있음/ 사용자가 입력한 검색어(필터 조건).)
        },
      });
      setThreads(response.data.threads);
      setTotalCount(response.data.totalCount); // totalCount 설정
      // console.log("Total threads for pagination:", response.data.totalCount);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleSearch = (data) => {
    if (typeof data === "string") {
      setSearchTerm(data); // 검색어로 검색
    } else {
      // data가 객체일 때 (응답일 때)
      setThreads(data.threads || []);
      setTotalCount(data.totalCount || 0); // 응답 데이터에서 totalCount 설정
    }
    setCurrentPage(1); // 검색 시 페이지 초기화
  };

  // 전체 보기 핸들러
  const handleReset = () => {
    setSearchTerm(""); // 검색어 초기화
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="thread-container">
      <h1 className="thread-header">THREAD ON</h1>

      <div className="thread-search-bar">
        <SearchBar
          apiUrl={GET_SEARCH_THREADS_API_URL}
          onSearch={handleSearch}
        />
        <button
          className="thread-new-thread-button"
          onClick={() => navigate("/new_thread")}
        >
          New Thread
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="thread-list">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.thread_num}
              cover={thread.book_cover}
              title={thread.book_title}
              author={thread.book_author}
              publisher={thread.book_publisher}
              participantsCount={thread.participant_count}
            />
          ))}
          {Array.from({ length: itemsPerPage - threads.length }).map(
            (_, index) => (
              <div key={`empty-${index}`} className="thread-card-placeholder" />
            )
          )}
        </div>
      )}

      <div className="page-nation-container">
        <PageNation
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            console.log("Page changed to:", page);
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
}

export default Threadon;
