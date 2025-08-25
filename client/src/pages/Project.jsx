import { useParams, Link } from '@tanstack/react-router';
import Board from '../components/Board';

export default function ProjectPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });

  return (



      <Board activeProject={projectId} />

  );
}
