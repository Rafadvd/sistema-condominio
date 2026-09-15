import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  User,
  Car,
  ShieldCheck,
  CalendarClock,
  LogIn,
  LogOut,
  XCircle,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { apiFetch, apiUrl } from "../lib/api";

const STATUS_ATIVOS = ["PENDENTE", "EM_VISITA"];

const STATUS_CONFIG = {
  PENDENTE: {
    label: "Pendente",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  EM_VISITA: {
    label: "Em visita",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  CONCLUIDA: {
    label: "Concluída",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  EXPIRADA: {
    label: "Expirada",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  CANCELADA: {
    label: "Cancelada",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
};

function formatarData(data) {
  if (!data) return "—";
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AcoesLiberacao({ liberacao, onAtualizar, atualizando }) {
  const status = liberacao.status_entrada;

  if (status === "PENDENTE") {
    return (
      <div className="mt-4 flex flex-wrap gap-2 border-t border-purple-50 pt-4">
        <button
          type="button"
          disabled={atualizando}
          onClick={() => onAtualizar(liberacao.id, "entrada")}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          <LogIn className="h-3.5 w-3.5" />
          {atualizando ? "..." : "Entrou"}
        </button>
        <button
          type="button"
          disabled={atualizando}
          onClick={() => onAtualizar(liberacao.id, "cancelar")}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          <XCircle className="h-3.5 w-3.5" />
          {atualizando ? "..." : "Cancelar"}
        </button>
      </div>
    );
  }

  if (status === "EM_VISITA") {
    return (
      <div className="mt-4 border-t border-purple-50 pt-4">
        <button
          type="button"
          disabled={atualizando}
          onClick={() => onAtualizar(liberacao.id, "saida")}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <LogOut className="h-3.5 w-3.5" />
          {atualizando ? "..." : "Já saiu"}
        </button>
      </div>
    );
  }

  return null;
}

export default function Central() {
  const [items, setItems] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState(null);
  const [erroAcao, setErroAcao] = useState("");

  const token = localStorage.getItem("token");

  const api_liberacao = useCallback(async () => {
    try {
      const response = await apiFetch(apiUrl("/api/liberacao"), {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao consultar a API");
      }

      const dados_resposta = await response.json();
      const lista = Array.isArray(dados_resposta) ? dados_resposta : [];
      return lista.filter((l) => STATUS_ATIVOS.includes(l.status_entrada));
    } catch (erro) {
      console.error("Falha na requisição:", erro);
      return [];
    }
  }, [token]);

  async function carregar() {
    setCarregando(true);
    const dados = await api_liberacao();
    setItems(dados);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, [api_liberacao]);

  async function atualizarStatus(id, acao) {
    setAtualizandoId(id);
    setErroAcao("");

    try {
      const response = await apiFetch(apiUrl("/api/liberacao"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, acao }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErroAcao(dados.mensage || "Não foi possível atualizar a liberação.");
        return;
      }

      if (!STATUS_ATIVOS.includes(dados.status_entrada)) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? dados : item))
        );
      }
    } catch {
      setErroAcao("Não foi possível conectar ao servidor.");
    } finally {
      setAtualizandoId(null);
    }
  }

  const pendentes = items.filter((l) => l.status_entrada === "PENDENTE").length;
  const emVisita = items.filter((l) => l.status_entrada === "EM_VISITA").length;

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
              <h1 className="mt-1 text-3xl font-bold text-[#2d0a4e]">
                Central de Liberações
              </h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Acompanhe as autorizações de entrada de visitantes solicitadas
                pelos condôminos.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-[#6200e2]">{pendentes}</p>
                <p className="text-xs text-purple-700/80">Pendentes</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-violet-700">{emVisita}</p>
                <p className="text-xs text-violet-700/80">Em visita</p>
              </div>
            </div>
          </div>
        </header>

        {erroAcao && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erroAcao}
          </div>
        )}

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-purple-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#6200e2]" />
            <p className="mt-4 text-sm text-gray-500">Carregando liberações...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white py-20 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg font-medium text-[#2d0a4e]">
              Nenhuma liberação ativa
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Liberações pendentes ou em visita aparecerão aqui. Concluídas e
              canceladas ficam no histórico.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((liberacao) => {
              const status =
                STATUS_CONFIG[liberacao.status_entrada] ?? STATUS_CONFIG.PENDENTE;

              return (
                <article
                  key={liberacao.id}
                  className="group flex flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm shadow-purple-100/50 transition-all hover:-translate-y-0.5 hover:border-[#c507ff]/40 hover:shadow-md hover:shadow-purple-200/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-purple-400">
                        Liberação #{liberacao.id}
                      </span>
                      <h2 className="mt-1 truncate text-lg font-bold text-[#2d0a4e]">
                        {liberacao.nome_visitante || "Visitante sem nome"}
                      </h2>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {liberacao.tipo_visitante || "Tipo não informado"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-purple-50 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4 shrink-0 text-[#6200e2]" />
                      <span className="truncate">
                        Condômino #{liberacao.id_condomino}
                      </span>
                    </div>

                    {liberacao.placa_visitante && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Car className="h-4 w-4 shrink-0 text-[#6200e2]" />
                        <span className="truncate">
                          Placa: {liberacao.placa_visitante}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 shrink-0 text-[#6200e2]" />
                      <span className="truncate">
                        Criada em {formatarData(liberacao.data_hora_criacao)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarClock className="h-4 w-4 shrink-0 text-[#6200e2]" />
                      <span className="truncate">
                        Expira em {formatarData(liberacao.data_hora_expiracao)}
                      </span>
                    </div>
                  </div>

                  {(liberacao.data_hora_entrada || liberacao.data_hora_saida) && (
                    <div className="mt-4 rounded-xl bg-purple-50/70 px-3 py-2 text-xs text-purple-800">
                      {liberacao.data_hora_entrada && (
                        <p>Entrada: {formatarData(liberacao.data_hora_entrada)}</p>
                      )}
                      {liberacao.data_hora_saida && (
                        <p>Saída: {formatarData(liberacao.data_hora_saida)}</p>
                      )}
                    </div>
                  )}

                  <AcoesLiberacao
                    liberacao={liberacao}
                    onAtualizar={atualizarStatus}
                    atualizando={atualizandoId === liberacao.id}
                  />
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
