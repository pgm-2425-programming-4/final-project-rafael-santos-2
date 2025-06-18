import React from "react";

function ProjectDelete({ project, onProjectDeleted }) {
  const handleDelete = async () => {
    const confirm = window.confirm(
      `Weet je zeker dat je het project "${project.name}" wilt verwijderen?`
    );
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:1337/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Verwijderen mislukt");

      onProjectDeleted?.(project.id);
    } catch (err) {
      alert("Fout bij verwijderen: " + err.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "1.5rem",
        height: "1.5rem",
        cursor: "pointer",
        marginLeft: "0.5rem",
      }}
    >
      ×
    </button>
  );
}

export default ProjectDelete;
