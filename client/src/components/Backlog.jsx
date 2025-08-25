import React, { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

function BacklogPage() {
  const { projectId } = useParams({ from: "/projects/$projectId/backlog" });
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        ← Terug naar projectpagina
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

      {loading && <p>Laden...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tasks.length === 0 ? (
            <p>Geen backlog-taken gevonden.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                {task.labels?.data?.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {task.labels.data.map((label) => (
                      <span
                        key={label.id}
                        style={{
                          backgroundColor: "#000",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
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
    </div>
  );
}

export default BacklogPage;
