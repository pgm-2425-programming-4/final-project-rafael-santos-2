import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function TaskForm({ currentProject, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const queryClient = useQueryClient();

  const {
    data: statusData,
    isLoading: statusLoading,
    isError: statusError,
  } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const res = await fetch("http://localhost:1337/api/statuses");
      if (!res.ok) throw new Error("Kan statussen niet ophalen");
      return res.json();
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask) => {
      const res = await fetch("http://localhost:1337/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Fout bij taak toevoegen");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      refresh?.();
      setTitle("");
      setDescription("");
      setSelectedStatus("");
      alert("Taak succesvol toegevoegd");
    },
    onError: (err) => {
      alert("Fout: " + err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !selectedStatus) {
      alert("Titel en status zijn verplicht");
      return;
    }

    createTask.mutate({
      data: {
        title,
        description: description,
        project: currentProject.id,
        task_status: selectedStatus,
      },
    });
  };

  if (!currentProject || !currentProject.id) {
    return <p>Selecteer eerst een geldig project om een taak toe te voegen.</p>;
  }

  if (statusLoading) return <p>Statussen laden...</p>;
  if (statusError) return <p>Fout bij laden van statussen.</p>;

  const statuses = statusData?.data || [];

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nieuwe taak voor {currentProject.name}</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschrijving"
      />

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        required
      >
        <option value="">-- Kies status --</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.attributes?.name || status.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? "Toevoegen..." : "Taak toevoegen"}
      </button>
    </form>
  );
}

export default TaskForm;
