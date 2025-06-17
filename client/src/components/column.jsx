import React from "react";
import TaskCard from "./TaskCard";

function Column({ title, tasks }) {
  return (
    <div style={{ flex: 1 }}>
      <h3>{title}</h3>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default Column;
