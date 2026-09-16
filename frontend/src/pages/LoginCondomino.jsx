import { User, Lock, AlertCircle } from "lucide-react";
import BackGround from "../components/BackGround";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatarCPF } from "../lib/formatadores";
import { apiUrl } from "../lib/api";

function LoginCondomino() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [errosCampos, setErrosCampos] = useState({ cpf: "", senha: "" });
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  function validarCampos() {
    const novosErros = {
      cpf: !cpf.trim() ? "Informe seu CPF" : "",
      senha: !senha.trim() ? "Informe sua senha" : "",
    };
    setErrosCampos(novosErros);
    return !novosErros.cpf && !novosErros.senha;
  }

  async function login_api(dados) {
    setCarregando(true);
    setErroGeral("");

    try {
      const response = await fetch(apiUrl("/api/loginCondomino"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const dados_resposta = await response.json();

      if (!response.ok) {
        setErroGeral(
          dados_resposta.error?.trim() || "CPF ou senha incorretos"
        );
        return;
      }

      const token = dados_resposta.token;
      if (!token) {
        setErroGeral("Erro ao fazer login. Tente novamente.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/condomino");
    } catch {
      setErroGeral("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function handleSubmit() {
    if (!validarCampos()) return;
    login_api({ cpf, senha });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackGround variant="blue" />

      <div className="relative w-full max-w-sm rounded-2xl border border-blue-100 bg-[#f0f7ff] px-10 pb-12 pt-10 shadow-2xl shadow-blue-900/20">
        <img className="mx-auto h-32 pb-2" src="../../logo.png" alt="Logo" />

        <p className="mb-1 flex justify-center text-xs font-semibold uppercase tracking-widest text-blue-600">
          Área do condômino
        </p>
        <h1 className="flex justify-center pb-2 text-3xl font-bold text-[#0c2d6b]">
          Bem-vindo de volta
        </h1>
        <p className="flex justify-center pb-6 text-gray-600">
          Acesse sua conta para gerenciar visitas
        </p>

        {erroGeral && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{erroGeral}</span>
          </div>
        )}

        <div className="flex w-full flex-col gap-1">
          <label htmlFor="cpf-condomino" className="pb-2 text-sm font-medium text-[#0c2d6b]">
            CPF
          </label>
          <div className="relative">
            <input
              type="text"
              id="cpf-condomino"
              inputMode="numeric"
              placeholder=" "
              value={cpf}
              onChange={(event) => {
                setCpf(formatarCPF(event.target.value));
                if (errosCampos.cpf || erroGeral) {
                  setErrosCampos((prev) => ({ ...prev, cpf: "" }));
                  setErroGeral("");
                }
              }}
              className={`peer w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-transparent focus:outline-none focus:ring-2 ${
                errosCampos.cpf
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            <label
              htmlFor="cpf-condomino"
              className="pointer-events-none absolute left-3 top-1/2 flex origin-left -translate-y-1/2 select-none items-center gap-2 text-sm text-gray-400 transition-all duration-200 peer-focus:invisible peer-focus:scale-95 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:invisible peer-[:not(:placeholder-shown)]:scale-95 peer-[:not(:placeholder-shown)]:opacity-0"
            >
              <User className="h-4 w-4 shrink-0 text-blue-400" />
              <span>CPF</span>
            </label>
          </div>
          {errosCampos.cpf && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.cpf}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-1 pt-4">
          <label htmlFor="senha-condomino" className="pb-2 text-sm font-medium text-[#0c2d6b]">
            Senha
          </label>
          <div className="relative">
            <input
              type="password"
              id="senha-condomino"
              placeholder=" "
              value={senha}
              onChange={(event) => {
                setSenha(event.target.value);
                if (errosCampos.senha || erroGeral) {
                  setErrosCampos((prev) => ({ ...prev, senha: "" }));
                  setErroGeral("");
                }
              }}
              className={`peer w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-transparent focus:outline-none focus:ring-2 ${
                errosCampos.senha
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            <label
              htmlFor="senha-condomino"
              className="pointer-events-none absolute left-3 top-1/2 flex origin-left -translate-y-1/2 select-none items-center gap-2 text-sm text-gray-400 transition-all duration-200 peer-focus:invisible peer-focus:scale-95 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:invisible peer-[:not(:placeholder-shown)]:scale-95 peer-[:not(:placeholder-shown)]:opacity-0"
            >
              <Lock className="h-4 w-4 shrink-0 text-blue-400" />
              <span>********</span>
            </label>
          </div>
          {errosCampos.senha && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.senha}</p>
          )}
        </div>

        <div className="pt-8">
          <button
            type="button"
            disabled={carregando}
            className="flex w-full justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-700 px-4 py-2.5 font-medium text-white shadow-md shadow-blue-600/30 transition-transform active:scale-95 hover:from-sky-400 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleSubmit}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginCondomino;
