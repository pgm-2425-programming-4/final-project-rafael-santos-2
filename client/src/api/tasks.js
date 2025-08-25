import { API_URL, API_TOKEN } from "../../constants/constant";

export async function Taskupdate({ id, title, description, task_status }) {
  const res = await fetch(`${API_URL}/taskens/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        title,
        description,
        task_status,
      },
    }),
  });
  const result = await res.json();

  if (!res.ok) {
    throw new Error("Update mislukt: " + JSON.stringify(result.error));
  }

  return result;
}
