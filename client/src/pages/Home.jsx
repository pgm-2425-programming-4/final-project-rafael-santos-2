import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProjectCreated = () => {
    setRefreshKey((prev) => prev + 1); 
  };

  return (
    <div>
      <h1>Welkom bij Jammin</h1>

      <ProjectForm onProjectCreated={handleProjectCreated} />

      <h2>Projecten</h2>
      <ProjectList refreshTrigger={refreshKey} />
    </div>
  );
}
