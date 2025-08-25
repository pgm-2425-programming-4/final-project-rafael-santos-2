import React from "react";

function TaskCard({ task, onClick }) {
  const labels = Array.isArray(task.labels) ? task.labels : [];

  return (
    <div
      onClick={() => onClick(task)}
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
    >
      <p><strong>{task.title}</strong></p>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        {typeof task.description === "string" ? task.description : "Geen beschrijving"}
      </p>

      {labels.length > 0 && (
        <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {labels.map((label) => (
            <span
              key={label.id}
              style={{
                backgroundColor: "#111",
                color: "#fff",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
