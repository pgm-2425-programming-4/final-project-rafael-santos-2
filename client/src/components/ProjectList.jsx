import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import ProjectDelete from './ProjectDelete';

export default function ProjectList({ refreshTrigger }) {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:1337/api/projects");
    const data = await res.json();

    const cleanData = data.data.map((project) => ({
      id: project.id,
      name: project.name || "Naam onbekend",
    }));
    setProjects(cleanData);
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  return (
<ul style={{ listStyle: "none", padding: 0 }}>
  {projects.map((project) => (
    <li
      key={project.id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
        padding: "0.5rem 1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Link
        to={`/projects/${project.name}`}
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        {project.name}
      </Link>

      <ProjectDelete
        project={project}
        onProjectDeleted={(id) =>
          setProjects((prev) => prev.filter((p) => p.id !== id))
        }
      />
    </li>
  ))}
</ul>
  );
}
