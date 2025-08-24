function Pagination({ page, pageCount, onPageChange }) {
  return (
    <div>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Vorige
      </button>
      <span> Pagina {page} van {pageCount} </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === pageCount}>
        Volgende
      </button>
    </div>
  );
}

export default Pagination;
