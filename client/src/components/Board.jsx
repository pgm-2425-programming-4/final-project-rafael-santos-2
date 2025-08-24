import React, { useEffect, useState, useCallback } from "react";
import Column from "./column.jsx";
import TaskForm from "./TaskForm.jsx";

function Board({ activeProject }) {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectList, setProjectList] = useState([]);

  const currentProject = projectList.find((p) => p.name === activeProject);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/projects");
        const data = await res.json();

        const projects = data.data.map((p) => ({
          id: p.id,
          name: p.attributes?.name || p.name,
        }));

        setProjectList(projects);
      } catch (err) {
        console.error("Fout bij ophalen projecten:", err);
      }
    };

    fetchProjects();
  }, []);

  const fetchTasks = useCallback(async () => {

    setLoading(true);
    setError(null);
    try {
      const backlogRes = await fetch(
        `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&filters[task_status][name][$eq]=Backlog&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
      if (!backlogRes.ok) throw new Error("Fout bij ophalen backlog");
      const backlogData = await backlogRes.json();
      const backlogTasks = backlogData.data;

      const otherRes = await fetch(
        `http://localhost:1337/api/tasks?populate=*&filters[project][name][$eq]=${activeProject}&filters[task_status][name][$ne]=Backlog`
      );
      if (!otherRes.ok) throw new Error("Fout bij ophalen andere taken");
      const otherData = await otherRes.json();
      const otherTasks = otherData.data;

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
  }, [activeProject, page, pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div>
      <h1>Kanban View</h1>
      <h2>Project: {activeProject}</h2>

      <TaskForm currentProject={currentProject} refresh={fetchTasks} />

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

      {loading && <p>Laden...</p>}
      {error && <p>Fout: {error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <Column
              key={status}
              title={status}
              tasks={tasks}
              refresh={fetchTasks}
            />
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
