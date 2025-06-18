import React, { useState } from "react";

function ProjectForm({ onProjectCreated }) {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const response = await fetch("http://localhost:1337/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { name: projectName },
        }),
      });

      if (!response.ok) throw new Error("Fout bij aanmaken project");
      const data = await response.json();
      onProjectCreated?.(data.data); 
      setProjectName("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nieuw project</h3>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Projectnaam"
      />
      <button type="submit">Toevoegen</button>
    </form>
  );
}

export default ProjectForm;
