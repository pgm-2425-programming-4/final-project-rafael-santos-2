import React, { useEffect, useState } from "react";

function TaskFilterPanel({ onFilterChange }) {
    const [title, setTitle] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [labels, setLabels]= useState([]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/labels");
        const data = await res.json();
        const labelData = data.data.map((label) => ({
          id: label.id,
          name: label.name || label.attributes?.name,
        }));
        setLabels(labelData);
      } catch (err) {
        console.error("Fout bij ophalen labels:", err);
      }
    };

    fetchLabels();
  }, []);

  useEffect(() => {
    onFilterChange({ label: selectedLabel, title });
  }, [selectedLabel, title, onFilterChange]);

  return (
    <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div>
        <label style={{ marginRight: "0.5rem" }}>Filter op label:</label>
        <select value={selectedLabel} onChange={(e) => setSelectedLabel(e.target.value)}>
          <option value="">Alle labels</option>
          {labels.map((label) => (
            <option key={label.id} value={label.name}>
              {label.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ marginRight: "0.5rem" }}>Zoek op titel:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Typ een titel..."
        />
      </div>
    </div>
  );
}

export default TaskFilterPanel;