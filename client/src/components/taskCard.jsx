import React, { useState } from "react";

function TaskCard({ task, onDeleted, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description?.[0]?.children?.[0]?.text || ""
  );

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title,
            description: [
              {
                type: "paragraph",
                children: [{ text: description }],
              },
            ],
          },
        }),
      });

      if (!res.ok) throw new Error("Updaten mislukt");
      alert("✅ Taak geüpdatet");
      setIsEditing(false);
      onUpdated?.();
    } catch (err) {
      alert("❌ Fout bij update: " + err.message);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Weet je zeker dat je deze taak wilt verwijderen?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:1337/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Verwijderen mislukt");
      onDeleted?.();
    } catch (err) {
      alert("Fout bij verwijderen: " + err.message);
    }
  };

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
          <button onClick={handleUpdate}>Opslaan</button>
          <button onClick={() => setIsEditing(false)}> Annuleer</button>
        </>
      ) : (
        <>
          <p><strong>{task.title}</strong></p>
          <p>{description || "Geen beschrijving"}</p>
          <button onClick={() => setIsEditing(true)}> Bewerken</button>
          <button
            onClick={handleDelete}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              marginLeft: "0.5rem",
            }}
          >
            Verwijder
          </button>
        </>
      )}
    </div>
  );
}

export default TaskCard;
