import React, { useEffect, useState, useCallback } from "react";
import Column from "./Column.jsx";
import ProjectForm from "./ProjectForm.jsx";
import TaskForm from "./TaskForm.jsx";
import ProjectDelete from "./ProjectDelete.jsx";

function Board() {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [activeProject, setActiveProject] = useState("PGM3");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectList, setProjectList] = useState([]);

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/projects");
        const data = await res.json();
        const projects = data.data.map((p) => ({
          id: p.id,
          name: p.name,
        }));

        setProjectList(projects);
        if (!activeProject && projects.length > 0) {
          setActiveProject(projects[0].name);
        }
      } catch (err) {
        console.error("Fout bij ophalen projecten:", err);
      }
    };

    fetchProjects();
  }, [activeProject]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div>
      <h1>Kanban View</h1>
      <h2>Project: {activeProject}</h2>

      <ProjectForm
        onProjectCreated={(project) => console.log("Nieuw project:", project)}
      />

      <TaskForm
        currentProject={projectList.find((p) => p.name === activeProject)}
      />

      <div>
        {projectList.map((project) => (
          <div
            key={project.id}
            style={{ display: "inline-block", marginRight: "1rem" }}
          >
            <button
              onClick={() => {
                setActiveProject(project.name);
                setPage(1);
              }}
              style={{
                background:
                  activeProject === project.name ? "black" : "lightgray",
                color: activeProject === project.name ? "white" : "black",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
                marginRight: "0.5rem",
              }}
            >
              {project.name}
            </button>
            <ProjectDelete
              project={project}
              onProjectDeleted={(deletedId) => {
                setProjectList((prev) =>
                  prev.filter((p) => p.id !== deletedId)
                );
                if (activeProject === project.name) {
                  const nieuwe = projectList.find((p) => p.id !== deletedId);
                  setActiveProject(nieuwe?.name || "");
                }
              }}
            />
          </div>
        ))}
      </div>

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
