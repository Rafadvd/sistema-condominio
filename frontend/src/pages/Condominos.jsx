import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Home,
  Phone,
  Plus,
  User,
  Users,
  X,
} from "lucide-react";
import NavBar from "../components/NavBar";

const CAMPOS_OBRIGATORIOS = ["lote", "nome", "cpf", "telefone", "senha"];

const LABELS = {
  lote: "Lote",
  nome: "Nome",
  cpf: "CPF",
  telefone: "Telefone",
  senha: "Senha",
};

function ModalNovoCondomino({ aberto, onFechar, onCriado }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    lote: "",
    nome: "",
    cpf: "",
    telefone: "",
    senha: "",
  });
  const [errosCampos, setErrosCampos] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!aberto) {
      setForm({ lote: "", nome: "", cpf: "", telefone: "", senha: "" });
      setErrosCampos({});
      setErroGeral("");
    }
  }, [aberto]);

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrosCampos((prev) => ({ ...prev, [campo]: "" }));
    setErroGeral("");
  }

  function validarFormulario() {
    const novosErros = {};
    CAMPOS_OBRIGATORIOS.forEach((campo) => {
      if (!form[campo].trim()) {
        novosErros[campo] = `Informe ${LABELS[campo].toLowerCase()}`;
      }
    });
    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validarFormulario()) return;

    setEnviando(true);
    setErroGeral("");

    try {
      const response = await fetch("http://localhost:8080/api/condomino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErroGeral(dados.mensage || "Não foi possível cadastrar o condômino.");
        return;
      }

      onCriado();
      onFechar();
    } catch {
      setErroGeral("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  if (!aberto) return null;

  const inputClass = (campo) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
      errosCampos[campo]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#2d0a4e]/50 backdrop-blur-sm"
        onClick={onFechar}
        aria-label="Fechar modal"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-purple-100 bg-white p-6 shadow-2xl shadow-purple-200/40">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2d0a4e]">Novo condômino</h2>
            <p className="mt-1 text-sm text-gray-500">
              Cadastre um morador para acesso ao sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-purple-50 hover:text-[#6200e2]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {erroGeral && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{erroGeral}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lote" className="mb-1.5 block text-sm font-medium text-[#2d0a4e]">
              Lote
            </label>
            <input
              id="lote"
              type="text"
              value={form.lote}
              onChange={(e) => atualizarCampo("lote", e.target.value)}
              className={inputClass("lote")}
              placeholder="Ex: A-12"
            />
            {errosCampos.lote && (
              <p className="mt-1.5 text-xs text-red-600">{errosCampos.lote}</p>
            )}
          </div>

          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-[#2d0a4e]">
              Nome completo
            </label>
            <input
              id="nome"
              type="text"
              value={form.nome}
              onChange={(e) => atualizarCampo("nome", e.target.value)}
              className={inputClass("nome")}
              placeholder="Nome do condômino"
            />
            {errosCampos.nome && (
              <p className="mt-1.5 text-xs text-red-600">{errosCampos.nome}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cpf" className="mb-1.5 block text-sm font-medium text-[#2d0a4e]">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                value={form.cpf}
                onChange={(e) => atualizarCampo("cpf", e.target.value)}
                className={inputClass("cpf")}
                placeholder="000.000.000-00"
              />
              {errosCampos.cpf && (
                <p className="mt-1.5 text-xs text-red-600">{errosCampos.cpf}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-[#2d0a4e]">
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                value={form.telefone}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
                className={inputClass("telefone")}
                placeholder="(00) 00000-0000"
              />
              {errosCampos.telefone && (
                <p className="mt-1.5 text-xs text-red-600">{errosCampos.telefone}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-[#2d0a4e]">
              Senha de acesso
            </label>
            <input
              id="senha"
              type="password"
              value={form.senha}
              onChange={(e) => atualizarCampo("senha", e.target.value)}
              className={inputClass("senha")}
              placeholder="Senha inicial"
            />
            {errosCampos.senha && (
              <p className="mt-1.5 text-xs text-red-600">{errosCampos.senha}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-lg border border-purple-200 px-4 py-2.5 text-sm font-medium text-[#2d0a4e] hover:bg-purple-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#c507ff] to-[#6200e2] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {enviando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Condominos() {
  const [condominos, setCondominos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [sucesso, setSucesso] = useState("");

  const token = localStorage.getItem("token");

  async function carregarCondominos() {
    setCarregando(true);
    try {
      const response = await fetch("http://localhost:8080/api/condomino", {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao carregar");

      const dados = await response.json();
      setCondominos(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.error("Falha ao carregar condôminos:", erro);
      setCondominos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCondominos();
  }, []);

  function handleCriado() {
    setSucesso("Condômino cadastrado com sucesso!");
    carregarCondominos();
    setTimeout(() => setSucesso(""), 4000);
  }

  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-gray-800">
      <NavBar />

      <main className="flex-1 p-4 pt-16 md:ml-64 md:p-8 md:pt-8">
        <header className="mb-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm shadow-purple-100/60">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6200e2]">
                Portaria
              </p>
              <h1 className="mt-1 text-3xl font-bold text-[#2d0a4e]">Condôminos</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Gerencie os moradores cadastrados no condomínio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-[#6200e2]">{condominos.length}</p>
                <p className="text-xs text-purple-700/80">Cadastrados</p>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c507ff] to-[#6200e2] px-5 py-3 text-sm font-medium text-white shadow-md shadow-purple-300/40 transition-transform active:scale-95 hover:opacity-95"
              >
                <Plus className="h-4 w-4" />
                Novo condômino
              </button>
            </div>
          </div>
        </header>

        {sucesso && (
          <div
            role="status"
            className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{sucesso}</span>
          </div>
        )}

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-purple-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#6200e2]" />
            <p className="mt-4 text-sm text-gray-500">Carregando condôminos...</p>
          </div>
        ) : condominos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg font-medium text-[#2d0a4e]">
              Nenhum condômino cadastrado
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Clique em &quot;Novo condômino&quot; para adicionar o primeiro morador.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {condominos.map((condomino) => (
              <article
                key={condomino.id}
                className="flex flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm shadow-purple-100/50 transition-all hover:-translate-y-0.5 hover:border-[#c507ff]/40 hover:shadow-md hover:shadow-purple-200/60"
              >
                <div className="min-w-0">
                  <span className="text-xs font-medium text-purple-400">
                    #{condomino.id}
                  </span>
                  <h2 className="mt-1 truncate text-lg font-bold text-[#2d0a4e]">
                    {condomino.nome}
                  </h2>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-purple-50 pt-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Home className="h-4 w-4 shrink-0 text-[#6200e2]" />
                    <span className="truncate">Lote {condomino.lote}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4 shrink-0 text-[#6200e2]" />
                    <span className="truncate">CPF: {condomino.cpf}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 shrink-0 text-[#6200e2]" />
                    <span className="truncate">{condomino.telefone}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <ModalNovoCondomino
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onCriado={handleCriado}
      />
    </div>
  );
}
