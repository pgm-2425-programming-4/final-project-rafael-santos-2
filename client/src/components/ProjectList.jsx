import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1337/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data.data.map((project) => ({
          id: project.id,
          name: project.name || 'Naam onbekend',
        }));
        setProjects(cleanData);
      });
  }, []);

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/projects/${project.name}`}>{project.name}</Link>
        </li>
      ))}
    </ul>
  );
}