import React, { useState, useEffect } from "react";

function TaskForm({ currentProject }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchStatuses = async () => {
      const res = await fetch("http://localhost:1337/api/statuses");
      const data = await res.json();
      setStatusOptions(data.data);
    };
    fetchStatuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title,
            description: [
              {
                type: "paragraph",
                children: [{ type: "text", text: description }],
              },
            ],
            project: currentProject.id,
            task_status: selectedStatus,
          },
        }),
      });

      if (!response.ok) throw new Error("Fout bij taak toevoegen");
      setTitle("");
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
  };
  if (!currentProject || !currentProject.id) {
    return (
      <p> Selecteer eerst een geldig project om een taak toe te voegen.</p>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <h3>Nieuwe taak voor {currentProject.name}</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschrijving"
      />
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">-- Kies status --</option>
        {statusOptions.map((status) => (
          <option key={status.id} value={status.id}>
            {status.attributes?.name || status.name}
          </option>
        ))}
      </select>
      <button type="submit">Taak toevoegen</button>
    </form>
  );
}

export default TaskForm;
