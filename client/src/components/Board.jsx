import React, { useEffect, useState } from "react";
import Column from "./Column.jsx";
import Pagination from "./Pagination.jsx";

function Board() {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [activeProject, setActiveProject] = useState("PGM3");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Backlog-taken ophalen met paginatie
        const backlogRes = await fetch(
          `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&filters[task_status][name][$eq]=Backlog&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );
        if (!backlogRes.ok) throw new Error("Fout bij ophalen backlog");
        const backlogData = await backlogRes.json();
        const backlogTasks = backlogData.data;

        // 2. Andere taken ophalen (zonder paginatie)
        const otherRes = await fetch(
          `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&filters[task_status][name][$ne]=Backlog`
        );
        if (!otherRes.ok) throw new Error("Fout bij ophalen andere taken");
        const otherData = await otherRes.json();
        const otherTasks = otherData.data;

        // 3. Groeperen op status
        const grouped = {
          Backlog: backlogTasks,
          "To do": [],
          "In progress": [],
          "Ready for review": [],
          Done: [],
        };

        otherTasks.forEach((task) => {
          const status = task.task_status?.name || "To do";
          if (grouped[status]) {
            grouped[status].push(task);
          }
        });

        setTasksByStatus(grouped);
        setPageCount(backlogData.meta.pagination.pageCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeProject, page, pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div>
      <h1>Kanban View</h1>
      <h2>Project: {activeProject}</h2>

      {/* 🔘 Project selectie */}
      <div>
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
            }}
          >
            {project}
          </button>
        ))}
      </div>

      {/* 📦 Pagina-instellingen */}
      <div style={{ margin: "1rem 0" }}>
        <label>
          Taken per pagina:{" "}
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
      </div>

      {/* 🕓 Loader / Error */}
      {loading && <p>🕓 Laden...</p>}
      {error && <p>❌ Fout: {error}</p>}

      {/* 🧱 Kolommen */}
      {!loading && !error && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <Column key={status} title={status} tasks={tasks} />
          ))}
        </div>
      )}

      {/* 🔁 Alleen paginatie voor backlog */}
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
