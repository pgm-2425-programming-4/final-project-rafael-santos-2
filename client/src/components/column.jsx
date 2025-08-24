import React from "react";
import TaskCard from "./taskCard.jsx";

function Column({ title, tasks, refresh }) {
  return (
    <div style={{ flex: 1 }}>
      <h3>{title}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDeleted={refresh}
          onUpdated={refresh}
        />
      ))}
    </div>
  );
}

export default Column;
