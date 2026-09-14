function rotaLoginAtual() {
  return window.location.pathname.startsWith("/condomino") ? "/login" : "/loginOperario";
}

export function dadosDoToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function usuarioEhAdmin() {
  const dados = dadosDoToken();
  return dados?.perfil === "operario" && dados?.admin === true;
}

export function encerrarSessaoExpirada() {
  localStorage.removeItem("token");
  window.location.replace(rotaLoginAtual());
}

export async function apiFetch(url, opcoes) {
  const resposta = await fetch(url, opcoes);

  if (resposta.status === 401) {
    encerrarSessaoExpirada();
  }

  return resposta;
}
