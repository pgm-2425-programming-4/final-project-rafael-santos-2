import React, { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import TaskDialog from "./TaskDialog.jsx";
import TaskCard from "./taskCard.jsx"; 

function BacklogPage() {
  const { projectId } = useParams({ from: "/projects/$projectId/backlog" });
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${projectId}&filters[task_status][name][$eq]=Backlog&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );

      if (!response.ok) throw new Error("Fout bij het ophalen van taken");

      const data = await response.json();
      setTasks(data.data || []);
      setPageCount(data.meta.pagination.pageCount);
      setTotalCount(data.meta.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, page, pageSize]);

  return (
    <div>
      <h2>Backlog voor project: {projectId}</h2>

      <Link
        to="/projects/$projectId"
        params={{ projectId }}
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        Terug naar projectpagina
      </Link>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Taken per pagina:{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
      </div>
      <p>
        Totaal aantal backlog-taken: <strong>{totalCount}</strong>
      </p>
      {loading && <p>Laden...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tasks.length === 0 ? (
            <p>Geen backlog-taken gevonden.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))
          )}
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

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={fetchTasks}
        />
      )}
    </div>
  );
}

export default BacklogPage;
