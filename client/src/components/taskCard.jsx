import React from "react";

function TaskCard({ task }) {
  const labels = task.labels || [];

  return (
    <div
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <p><strong>{task.title}</strong></p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {labels.map((label, i) => (
          <span
            key={i}
            style={{
              background: "black",
              color: "white",
              padding: "0.2rem 0.5rem",
              borderRadius: "5px",
              fontSize: "0.75rem",
            }}
          >
            {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TaskCard;
