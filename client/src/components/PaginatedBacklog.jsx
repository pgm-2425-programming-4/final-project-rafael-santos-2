import React, { useEffect, useState } from "react";
import Backlog from "./Backlog.jsx";
import Pagination from "./Pagination.jsx";

function PaginatedBacklog() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeProject, setActiveProject] = useState("PGM3");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );

        if (!response.ok) throw new Error("Fout bij ophalen taken");

        const data = await response.json();
        setTasks(data.data);
        setPageCount(data.meta.pagination.pageCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, pageSize, activeProject]);

  return (
    <div>
      <h2>Backlog – Project: {activeProject}</h2>

      <div>
        <button onClick={() => setActiveProject("PGM3")}>PGM3</button>
        <button onClick={() => setActiveProject("PGM4")}>PGM4</button>
      </div>

      <label>
        Taken per pagina:{" "}
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </label>

      {loading && <p>Laden...</p>}
      {error && <p>Fout: {error}</p>}

      {!loading && !error && (
        <>
          <Backlog tasks={tasks} />
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default PaginatedBacklog;
