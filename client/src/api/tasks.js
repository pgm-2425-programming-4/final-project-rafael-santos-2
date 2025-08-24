import { API_URL, API_TOKEN } from "../../constants/constant";

export async function Taskupdate({ id, title, description }) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        title,
        description,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text(); // haal response op als tekst
    throw new Error(`Update mislukt: ${text}`); // gooi fout met inhoud
  }

  // alleen hier json proberen als het zeker json is
  return await res.json();
}