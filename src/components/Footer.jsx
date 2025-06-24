import React from 'react';
import './Footer.css';

const Footer = ({ totalPages, currentPage, setCurrentPage, totalL, currentL }) => {

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="table-footer">
      <div className="entry-count">Showing {currentL} out of {totalL} entries</div>
      <div className="pagination">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Footer;
