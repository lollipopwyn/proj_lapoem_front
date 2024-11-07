import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import axios from "axios";
import ThreadCard from "./ThreadCard";
import SearchBar from "../Common/SearchBar";
import PageNation from "../PageNation";
import "./Threadon.css";

function Threadon() {
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    fetchThreads();
  }, [currentPage, searchTerm]); // currentPage나 searchTerm이 변경될 때마다 fetchThreads 호출

  // 스레드 데이터를 불러오는 함수
  const fetchThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      // 서버에서 스레드 데이터를 요청
      const response = await axios.get("http://localhost:8000/threads", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          query: searchTerm, // 검색어를 query 파라미터로 전달
        },
      });
      setThreads(response.data.threads); // 서버에서 받은 스레드 데이터 설정
      setLoading(false);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
      setLoading(false);
    }
  };

  // 검색어가 변경될 때마다 searchTerm 업데이트
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // 검색 시 페이지 초기화
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = threads.slice(indexOfFirstItem, indexOfLastItem);

  // 빈 카드 수 계산
  const emptyCardCount = itemsPerPage - currentItems.length;

  return (
    <div className="thread-container">
      <h1 className="thread-header">THREAD ON</h1>

      <div className="thread-search-bar">
        <SearchBar onSearch={handleSearch} />
        <button
          className="thread-new-thread-button"
          onClick={() => navigate("/new_thread")} // 버튼 클릭 시 "/new-thread"로 이동
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
          {currentItems.map((thread) => (
            <ThreadCard
              key={thread.thread_num}
              thread={{
                cover: thread.book_cover,
                title: thread.book_title,
                author: thread.book_author,
                publisher: thread.book_publisher,
                participantCount: thread.participant_count,
              }}
            />
          ))}
          {/* 빈 카드 추가 */}
          {Array.from({ length: emptyCardCount }).map((_, index) => (
            <div
              key={`empty-${index}`}
              style={{
                width: "280px",
                aspectRatio: "3 / 4",
                visibility: "hidden",
              }}
            />
          ))}
        </div>
      )}

      <PageNation
        currentPage={currentPage}
        totalPages={Math.ceil(threads.length / itemsPerPage)}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchThreads();
        }}
      />
    </div>
  );
}

export default Threadon;
