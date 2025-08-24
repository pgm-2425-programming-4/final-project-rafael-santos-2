import React, { useEffect, useState } from "react";
// import Column from "./Column.jsx";

function Board() {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [activeProject, setActiveProject] = useState("PGM3");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
      if (!response.ok) throw new Error("Fout bij ophalen taken");

      const data = await response.json();
      const grouped = {
        "To do": [],
        "In progress": [],
        "Ready for review": [],
        Done: [],
      };

      data.data.forEach((task) => {
        const status = task.task_status?.name || "To do";
        if (grouped[status]) {
          grouped[status].push(task);
        }
      });

      setTasksByStatus(grouped);
      setPageCount(data.meta.pagination.pageCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [activeProject, page, pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        {["PGM3", "PGM4"].map((project) => (
          <button
            key={project}
            onClick={() => {
              setActiveProject(project);
              setPage(1);
            }}
            style={{
              marginRight: "1rem",
              background: activeProject === project ? "black" : "lightgray",
              color: activeProject === project ? "white" : "black",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {project}
          </button>
        ))}
      </div>

      <h2>Project: {activeProject}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Taken per pagina:{" "}
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
      </div>

      {loading && <p>Laden...</p>}
      {error && <p>Fout: {error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <Column key={status} title={status} tasks={tasks} refresh={fetchTasks} />
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Vorige
        </button>
        <span style={{ margin: "0 1rem" }}>
          Pagina {page} van {pageCount}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page === pageCount}>
          Volgende
        </button>
      </div>
    </div>
  );
}

export default Board;
