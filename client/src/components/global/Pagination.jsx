import { useState } from 'react';

const Pagination = ({ page, callback }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePagination = (num) => {
    setCurrentPage(num);
    callback(num);
  };
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => handlePagination(currentPage - 1)}>&lt;</button>
      )}
      <div>
        {[...Array(page)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : undefined}
            onClick={() => handlePagination(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {currentPage !== page && (
        <button onClick={() => handlePagination(currentPage + 1)}>&gt;</button>
      )}
    </div>
  );
};

export default Pagination;
