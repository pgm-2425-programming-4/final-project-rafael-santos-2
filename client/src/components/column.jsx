import React from "react";

function Column({ title, tasks, onTaskClick }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        minHeight: "200px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
        {title}
      </h3>

      {tasks.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666" }}>
          Geen taken in deze kolom
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task)}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <strong>{task.title}</strong>
            <p style={{ margin: "0.3rem 0" }}>{task.description}</p>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#888",
              }}
            >
              Status: {task.task_status?.name || "Onbekend"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Column;
