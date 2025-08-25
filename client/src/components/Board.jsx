import React, { useEffect, useState, useCallback } from "react";
import { Link } from '@tanstack/react-router';
import TaskForm from "./TaskForm.jsx";
import TaskCard from "./taskCard.jsx";
 import TaskDialog from "./TaskDialog.jsx";
import TaskFilterPanel from "./TaskFilterPanel.jsx";

function Board({ activeProject }) {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ title: "", label: "" });

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
      const queryParts = [
        `filters[project][name][$eq]=${activeProject}`,
        `filters[task_status][name][$ne]=Backlog`
      ];

      if (filters.title) {
        queryParts.push(`filters[title][$containsi]=${encodeURIComponent(filters.title)}`);
      }

      if (filters.label) {
        queryParts.push(`filters[labels][name][$eq]=${encodeURIComponent(filters.label)}`);
      }

      const query = queryParts.join("&");

      const res = await fetch(`http://localhost:1337/api/tasks?populate=*&${query}`);

      if (!res.ok) throw new Error("Fout bij ophalen taken");

      const data = await res.json();
      const tasks = data.data;

      const grouped = {
        "To do": [],
        "In progress": [],
        "Ready for review": [],
        Done: [],
      };

      tasks.forEach((task) => {
        const status = task.task_status?.name || "To do";
        if (grouped[status]) {
          grouped[status].push(task);
        }
      });

      setTasksByStatus(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeProject, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <h1>Kanban View</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Project: {activeProject}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            style={{
              backgroundColor: "#6c63ff",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {showForm ? "Annuleer" : "Nieuwe taak toevoegen"}
          </button>

          <Link
            to={`/projects/${activeProject}/backlog`}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6366f1",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Bekijk Backlog
          </Link>
        </div>
      </div>

      <TaskFilterPanel onFilterChange={setFilters} />

      {showForm && (
        <TaskForm currentProject={currentProject} refresh={fetchTasks} />
      )}

      {loading && <p>Laden...</p>}
      {error && <p style={{ color: "red" }}>Fout: {error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} style={{ flex: 1 }}>
              <h3>{status}</h3>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

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

export default Board;
