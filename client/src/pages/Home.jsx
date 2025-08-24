import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

export default function HomePage() {
  return (
    <div>
      <h1>Welkom bij Jammin</h1>

      <ProjectForm onProjectCreated={() => {
        // ProjectList zelf zou z'n eigen fetch moeten triggeren
        // eventueel kan je hier later iets uitbreiden
        console.log("Nieuw project aangemaakt");
      }} />

      <h2>Projecten</h2>
      <ProjectList />
    </div>
  );
}
