const API_URL = "http://localhost:8080";

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Erro na requisição");
  }

  return response.json();
}

export async function apiPost(endpoint: string, data: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro na requisição");
  }

  return response.json();
}