import React, { useState, useEffect } from "react";
import ThreadCard from "./ThreadCard";
import SearchBar from "../Common/SearchBar";
import PageNation from "../PageNation";
import "./Threadon.css";

function Threadon() {
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
      {
        id: 4,
        cover: "",
        title: "책제목1",
        author: "저자1",
        publisher: "출판사1",
      },
      {
        id: 5,
        cover: "",
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
      {
        id: 6,
        cover: "",
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
      {
        id: 7,
        cover: "",
        title: "책제목1",
        author: "저자1",
        publisher: "출판사1",
      },
      {
        id: 8,
        cover: "",
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
      {
        id: 9,
        cover: "",
        title: "책제목2",
        author: "저자2",
        publisher: "출판사2",
      },
    ];
    setThreads(data);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.includes(searchTerm) || thread.author.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredThreads.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="thread-container">
      <header className="thread-header">
        <h1 className="mb-20">THREAD ON</h1>
        <div className="thread-control-bar">
          <SearchBar onSearch={handleSearch} />
          <button className="thread-new-thread-button">+ New Thread</button>
        </div>
      </header>

      <div className="thread-list">
        {currentItems.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      <PageNation
        currentPage={currentPage}
        totalPages={Math.ceil(filteredThreads.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Threadon;
