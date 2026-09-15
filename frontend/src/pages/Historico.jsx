import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import NavBar from "../components/NavBar";
import { apiFetch, apiUrl } from "../lib/api";

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

export default function Historico() {
  const [items, setItems] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const response = await apiFetch(apiUrl("/api/liberacao"), {
          headers: { authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao consultar a API");

        const dados = await response.json();
        const lista = Array.isArray(dados) ? dados : [];

        lista.sort(
          (a, b) =>
            new Date(b.data_hora_criacao).getTime() -
            new Date(a.data_hora_criacao).getTime()
        );

        setItems(lista);
      } catch (erro) {
        console.error("Falha ao carregar histórico:", erro);
        setItems([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [token]);

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
              <h1 className="mt-1 text-3xl font-bold text-[#2d0a4e]">Histórico</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Todas as requisições de liberação registradas no sistema.
              </p>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-[#6200e2]">{items.length}</p>
              <p className="text-xs text-purple-700/80">Requisições</p>
            </div>
          </div>
        </header>

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-purple-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#6200e2]" />
            <p className="mt-4 text-sm text-gray-500">Carregando histórico...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white py-20 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg font-medium text-[#2d0a4e]">
              Nenhuma requisição registrada
            </p>
            <p className="mt-1 text-sm text-gray-500">
              O histórico aparecerá aqui quando houver liberações cadastradas.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm shadow-purple-100/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/80">
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">#</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Visitante</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Tipo</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">CPF</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Placa</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Condômino</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Status</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Criada em</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Expira em</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Entrada</th>
                    <th className="px-4 py-3.5 font-semibold text-[#2d0a4e]">Saída</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {items.map((liberacao) => {
                    const status =
                      STATUS_CONFIG[liberacao.status_entrada] ?? STATUS_CONFIG.PENDENTE;

                    return (
                      <tr
                        key={liberacao.id}
                        className="transition-colors hover:bg-purple-50/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-purple-500">
                          {liberacao.id}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-[#2d0a4e]">
                          {liberacao.nome_visitante || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {liberacao.tipo_visitante || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {liberacao.cpf_visitante || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {liberacao.placa_visitante || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          #{liberacao.id_condomino}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {formatarData(liberacao.data_hora_criacao)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {formatarData(liberacao.data_hora_expiracao)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {formatarData(liberacao.data_hora_entrada)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                          {formatarData(liberacao.data_hora_saida)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
