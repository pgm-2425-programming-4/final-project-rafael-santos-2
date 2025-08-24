import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Taskupdate } from "../api/tasks"; // ✅ jouw nieuwe update functie
import { API_URL, API_TOKEN } from "../../constants/constant"; 

function TaskCard({ task, onDeleted, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");

  // ✅ Status veranderen (met fetch direct)
  const changeStatus = useMutation({
    mutationFn: async (newStatusId) => {
      const taskId = task?.id;
      if (!taskId) throw new Error("Geen task ID");

      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            task_status: newStatusId,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Status veranderen mislukt: ${errorText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      alert("Status bijgewerkt!");
      onUpdated?.();
    },
    onError: (err) => {
      alert("Fout bij status veranderen: " + err.message);
    },
  });

  // ✅ Taak bijwerken via aparte functie
  const updateTask = useMutation({
    mutationFn: async () => {
      return await Taskupdate({
        id: task.id,
        title,
        description,
        // task_status: task.task_status, // mag ook ontbreken
      });
    },
    onSuccess: () => {
      alert("Taak geüpdatet");
      onUpdated?.();
      setIsEditing(false);
    },
    onError: (err) => {
      alert("Fout bij update: " + err.message);
    },
  });

  // ✅ Verwijderen blijft voorlopig direct in component
  const deleteTask = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/task/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error("Verwijderen mislukt");
      return res.json();
    },
    onSuccess: () => {
      alert("Taak verwijderd");
      onDeleted?.();
    },
    onError: (err) => {
      alert("Fout bij verwijderen: " + err.message);
    },
  });

  // ✅ Handlers
  const handleUpdate = () => {
    updateTask.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Weet je zeker dat je deze taak wilt verwijderen?")) {
      deleteTask.mutate();
    }
  };

  return (
    <>
      <div
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <button onClick={handleUpdate} disabled={updateTask.isPending}>
              {updateTask.isPending ? "Opslaan..." : "Opslaan"}
            </button>
            <button onClick={() => setIsEditing(false)}>Annuleer</button>
          </>
        ) : (
          <>
            <p><strong>{task.title}</strong></p>
            <p>{typeof task.description === "string" ? task.description : "Geen beschrijving"}</p>
            <button onClick={() => setIsEditing(true)}>Bewerken</button>
            <button
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                marginLeft: "0.5rem",
              }}
            >
              {deleteTask.isPending ? "Verwijderen..." : "Verwijder"}
            </button>
          </>
        )}
      </div>

      {/* ✅ Status wijzigen dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Status wijzigen:</label>
        <select
          onChange={(e) => changeStatus.mutate(Number(e.target.value))}
          defaultValue=""
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="" disabled>Kies status</option>
          <option value={2}>Backlog</option>
          <option value={4}>To do</option>
          <option value={6}>In progress</option>
          <option value={8}>Done</option>
        </select>
      </div>
    </>
  );
}

export default TaskCard;
