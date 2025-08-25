import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function TaskForm({ currentProject, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");

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

  const {
    data: labelData,
    isLoading: labelLoading,
    isError: labelError,
  } = useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const res = await fetch("http://localhost:1337/api/labels");
      if (!res.ok) throw new Error("Kan labels niet ophalen");
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
      setSelectedLabels([]);
      alert("Taak succesvol toegevoegd");
    },
    onError: (err) => {
      alert("Fout: " + err.message);
    },
  });

  const handleAddNewLabel = async () => {
    if (!newLabel.trim()) return;

    try {
      const res = await fetch("http://localhost:1337/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: newLabel,
          },
        }),
      });

      if (!res.ok) throw new Error("Kon label niet aanmaken");

      const created = await res.json();
      const newId = created.data.id;

      setSelectedLabels((prev) => [...prev, newId.toString()]);
      setNewLabel("");
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    } catch (err) {
      alert("Fout bij label aanmaken: " + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !selectedStatus) {
      alert("Titel en status zijn verplicht");
      return;
    }

    createTask.mutate({
      data: {
        title,
        description,
        project: currentProject.id,
        task_status: selectedStatus,
        labels: selectedLabels.map((id) => parseInt(id)),
      },
    });
  };

  if (!currentProject || !currentProject.id) {
    return <p>Selecteer eerst een geldig project om een taak toe te voegen.</p>;
  }

  if (statusLoading || labelLoading) return <p>Gegevens laden...</p>;
  if (statusError || labelError) return <p>Fout bij laden van gegevens.</p>;

  const statuses = statusData?.data || [];
  const labels = labelData?.data || [];

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Nieuwe taak voor {currentProject.name}</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
        required
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschrijving"
        rows={3}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        required
        style={{ display: "block", marginBottom: "1rem" }}
      >
        <option value="">-- Kies status --</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.attributes?.name || status.name}
          </option>
        ))}
      </select>

      <label style={{ fontWeight: "bold" }}>Labels:</label>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {labels.map((label) => {
          const isSelected = selectedLabels.includes(label.id.toString());
          return (
            <button
              key={label.id}
              type="button"
              onClick={() => {
                setSelectedLabels((prev) =>
                  isSelected
                    ? prev.filter((id) => id !== label.id.toString())
                    : [...prev, label.id.toString()]
                );
              }}
              style={{
                backgroundColor: isSelected ? "#111" : "#eee",
                color: isSelected ? "#fff" : "#000",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              {label.attributes?.name || label.name}
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Nieuw label..."
          style={{ marginRight: "0.5rem", padding: "0.25rem" }}
        />
        <button type="button" onClick={handleAddNewLabel}>
          Voeg label toe
        </button>
      </div>

      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? "Toevoegen..." : "Taak toevoegen"}
      </button>
    </form>
  );
}

export default TaskForm;
