import React, { useState, useEffect } from "react";
import ThreadCard from "./ThreadCard";
import PageNation from "../PageNation";
import "./Threadon.css";

function ThreadPage() {
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // 더미 데이터 (백엔드 구축 후 이 부분을 API 호출로 대체)
    const data = [
      {
        id: 1,
        cover: "",
        title: "책제목1",
        author: "저자1",
        publisher: "출판사1",
      },
      {
        id: 2,
        cover: "",
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
      {
        id: 3,
        cover: "",
        title: "책제목3",
        author: "저자3",
        publisher: "출판사3",
      },
      {
        id: 4,
        cover: "",
        title: "책제목4",
        author: "저자4",
        publisher: "출판사4",
      },
      {
        id: 5,
        cover: "",
        title: "책제목5",
        author: "저자5",
        publisher: "출판사5",
      },
      {
        id: 6,
        cover: "",
        title: "책제목6",
        author: "저자6",
        publisher: "출판사6",
      },
      {
        id: 7,
        cover: "",
        title: "책제목7",
        author: "저자7",
        publisher: "출판사7",
      },
      {
        id: 8,
        cover: "",
        title: "책제목8",
        author: "저자8",
        publisher: "출판사8",
      },
      {
        id: 9,
        cover: "",
        title: "책제목9",
        author: "저자9",
        publisher: "출판사9",
      },
      {
        id: 10,
        cover: "",
        title: "책제목10",
        author: "저자10",
        publisher: "출판사10",
      },
      {
        id: 11,
        cover: "",
        title: "책제목11",
        author: "저자11",
        publisher: "출판사11",
      },
      {
        id: 12,
        cover: "",
        title: "책제목12",
        author: "저자12",
        publisher: "출판사12",
      },
    ];
    setThreads(data);
  }, []);

  // 현재 페이지에 해당하는 데이터만 필터링
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = threads.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="Thread-container">
      <header className="Thread-header">
        <h1>THREAD ON</h1>
        <button className="Thread-new-thread-button">+ New Thread</button>
      </header>

      <div className="Thread-search-bar">
        <select className="Thread-filter-select">
          <option value="all">전체</option>
        </select>
        <input
          type="text"
          placeholder="검색할 도서명 혹은 저자를 입력해주세요."
        />
        <button className="Thread-search-button">🔍</button>
      </div>

      <div className="Thread-list">
        {currentItems.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      <PageNation
        currentPage={currentPage}
        totalPages={Math.ceil(threads.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ThreadPage;
