// src/utils/auth.js

// Guardar o token e dados do usuário após login
export function salvarSessao(token, usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuario.id);
    localStorage.setItem("usuarioNome", usuario.nome);
    localStorage.setItem("usuarioTipo", usuario.tipo ?? "");
  }
  
  // Remover tudo ao deslogar
  export function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
  
  // Obter usuário atual
  export function getUsuarioLogado() {
    return {
      id: localStorage.getItem("usuarioId"),
      nome: localStorage.getItem("usuarioNome"),
      tipo: localStorage.getItem("usuarioTipo"),
    };
  }
  