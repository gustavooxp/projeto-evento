// src/services/auth.js
import api from "./api";

export async function login(email, senha) {
  const response = await api.post("/auth/login", {
    email,
    senha,
  });

  localStorage.setItem("token", response.data.token);
  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}
