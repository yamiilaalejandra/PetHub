const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, method = "GET", data) {
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (data) config.body = JSON.stringify(data);

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Error inesperado");
  return result;
}

export const api = {
  register: (data) => request("/api/usuarios/registro", "POST", data),
  login: (data) => request("/api/usuarios/login", "POST", data),
  reservar: (data) => request("/api/turnos", "POST", data),
  getTurnos: () => request("/api/turnos"),
};
