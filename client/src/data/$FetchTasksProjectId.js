export const fetchTasksByProjectId = async (projectId) => {
  const res = await fetch(
    `http://localhost:1337/api/tasks?populate=*&filters[project][documentId][$eq]=${projectId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks by projectId");
  }

  const data = await res.json();

  // Belangrijk: we flatten hier de structuur én bewaren de Strapi ID
  return data.data.map((item) => ({
    id: item.id, // Strapi ID voor update/delete
    ...item.attributes,
  }));
};