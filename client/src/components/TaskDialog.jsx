import React, { useState } from "react";
import { Taskupdate } from "../api/tasks";
import { API_URL, API_TOKEN } from "../../constants/constant";

function TaskDialog({ task, onClose, onRefresh }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [statusId, setStatusId] = useState(task.task_status?.id);

  const handleSave = async () => {
    try {
      await Taskupdate({
        id: task.id,
        title,
        description,
        task_status: statusId,
      });
      alert("Taak opgeslagen");
      onRefresh?.();
      onClose();
    } catch (err) {
      alert("Fout bij opslaan: " + err.message);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Weet je zeker dat je deze taak wilt verwijderen?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Verwijderen mislukt");
      alert("Taak verwijderd");
      onRefresh?.();
      onClose();
    } catch (err) {
      alert("Fout bij verwijderen: " + err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div style={{ background: "white", padding: "2rem", width: "400px", borderRadius: "8px" }}>
        <h2>Taakdetails</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschrijving"
          rows={4}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        <select
          value={statusId}
          onChange={(e) => setStatusId(Number(e.target.value))}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value={2}>Backlog</option>
          <option value={4}>To do</option>
          <option value={6}>In progress</option>
          <option value={7}>Ready for review</option>
          <option value={8}>Done</option>
        </select>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSave}>Opslaan</button>
          <button onClick={handleDelete} style={{ color: "red" }}>Verwijderen</button>
          <button onClick={onClose}>Sluiten</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDialog;
