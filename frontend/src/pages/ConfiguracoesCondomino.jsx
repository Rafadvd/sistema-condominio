import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { apiFetch } from "../lib/api";

export default function ConfiguracoesCondomino({
  apiUrl = "http://localhost:8080/api/condomino/senha",
  tema = "azul",
}) {
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const roxo = tema === "roxo";

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: "" }));
    setErroGeral("");
    setSucesso("");
  }

  function validar() {
    const novosErros = {};

    if (!form.senhaAtual) novosErros.senhaAtual = "Informe sua senha atual.";
    if (!form.novaSenha) novosErros.novaSenha = "Informe a nova senha.";
    else if (form.novaSenha.length < 6) {
      novosErros.novaSenha = "A nova senha deve ter pelo menos 6 caracteres.";
    }
    if (!form.confirmarSenha) novosErros.confirmarSenha = "Confirme a nova senha.";
    else if (form.confirmarSenha !== form.novaSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function trocarSenha(event) {
    event.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    setErroGeral("");
    setSucesso("");

    try {
      const resposta = await apiFetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          senhaAtual: form.senhaAtual,
          novaSenha: form.novaSenha,
        }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroGeral(dados.error || dados.mensage || "Não foi possível alterar a senha.");
        return;
      }

      setSucesso("Senha alterada com sucesso.");
      setForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } catch {
      setErroGeral("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  const classeInput = (campo) =>
    `w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
      erros[campo]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : roxo
          ? "border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
          : "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

  const campos = [
    { id: "senhaAtual", label: "Senha atual", autoComplete: "current-password" },
    { id: "novaSenha", label: "Nova senha", autoComplete: "new-password" },
    { id: "confirmarSenha", label: "Confirmar nova senha", autoComplete: "new-password" },
  ];

  return (
    <section className={`max-w-xl rounded-2xl border bg-white p-6 shadow-sm ${roxo ? "border-purple-100 shadow-purple-100/60" : "border-blue-100 shadow-blue-100/60"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${roxo ? "bg-purple-50 text-[#6200e2]" : "bg-blue-50 text-blue-600"}`}>
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${roxo ? "text-[#2d0a4e]" : "text-[#0c2d6b]"}`}>Alterar senha</h2>
          <p className="mt-1 text-sm text-gray-500">Atualize a senha de acesso à sua conta.</p>
        </div>
      </div>

      {erroGeral && (
        <div role="alert" className="mt-6 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{erroGeral}</span>
        </div>
      )}
      {sucesso && (
        <div role="status" className="mt-6 flex gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{sucesso}</span>
        </div>
      )}

      <form onSubmit={trocarSenha} className="mt-6 space-y-5">
        {campos.map((campo) => (
          <div key={campo.id}>
            <label htmlFor={campo.id} className={`mb-1.5 block text-sm font-medium ${roxo ? "text-[#2d0a4e]" : "text-[#0c2d6b]"}`}>
              {campo.label}
            </label>
            <div className="relative">
              <LockKeyhole className={`pointer-events-none absolute left-3 top-3 h-4 w-4 ${roxo ? "text-purple-400" : "text-blue-400"}`} />
              <input
                id={campo.id}
                type={mostrarSenhas ? "text" : "password"}
                value={form[campo.id]}
                onChange={(event) => atualizarCampo(campo.id, event.target.value)}
                autoComplete={campo.autoComplete}
                className={classeInput(campo.id)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenhas((atual) => !atual)}
                className={`absolute right-3 top-2.5 rounded ${roxo ? "text-purple-500 hover:text-purple-700" : "text-blue-500 hover:text-blue-700"}`}
                aria-label={mostrarSenhas ? "Ocultar senhas" : "Mostrar senhas"}
              >
                {mostrarSenhas ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {erros[campo.id] && <p className="mt-1.5 text-xs text-red-600">{erros[campo.id]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={enviando}
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2.5 font-medium text-white shadow-md transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8 ${roxo ? "from-[#6200e2] to-[#c507ff] shadow-purple-900/30 hover:from-[#7a16e8] hover:to-[#d42cff]" : "from-sky-500 to-blue-700 shadow-blue-600/30 hover:from-sky-400 hover:to-blue-600"}`}
        >
          <KeyRound className="h-4 w-4" />
          {enviando ? "Alterando..." : "Alterar senha"}
        </button>
      </form>
    </section>
  );
}
