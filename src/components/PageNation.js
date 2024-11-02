import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 버튼 생성
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 5; // 최대 5개 페이지 버튼
    const startPage =
      Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1; // 현재 페이지에 따라 시작 페이지 결정
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages); // 끝 페이지 결정

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {renderPaginationButtons()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
