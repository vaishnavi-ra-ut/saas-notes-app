import axios from "axios";

const api = axios.create({
  baseURL: "/api", // matches your express app mounting
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token helper
export function attachToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
