import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import NavBarCondomino from "../components/NavBarCondomino";
import ConfiguracoesCondomino from "./ConfiguracoesCondomino";
import { apiFetch } from "../lib/api";
import { formatarCPF } from "../lib/formatadores";

const TIPOS_VISITANTE = [
  "Visitante",
  "Prestador de serviço",
  "Entregador",
  "Familiar",
];

const CAMPOS_OBRIGATORIOS = [
  "tipo_visitante",
  "nome_visitante",
  "cpf_visitante",
  "data_hora_expiracao",
];

const LABELS = {
  tipo_visitante: "Tipo de visitante",
  nome_visitante: "Nome do visitante",
  cpf_visitante: "CPF do visitante",
  data_hora_expiracao: "Data e hora de expiração",
};

function FormularioLiberacao({ idCondomino }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    tipo_visitante: "",
    nome_visitante: "",
    cpf_visitante: "",
    rg_visitante: "",
    placa_visitante: "",
    data_hora_expiracao: "",
  });
  const [errosCampos, setErrosCampos] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrosCampos((prev) => ({ ...prev, [campo]: "" }));
    setErroGeral("");
    setSucesso("");
  }

  function validarFormulario() {
    const novosErros = {};

    CAMPOS_OBRIGATORIOS.forEach((campo) => {
      if (!form[campo].trim()) {
        novosErros[campo] = `Informe ${LABELS[campo].toLowerCase()}`;
      }
    });

    if (form.data_hora_expiracao) {
      const expiracao = new Date(form.data_hora_expiracao);
      if (expiracao <= new Date()) {
        novosErros.data_hora_expiracao = "A expiração deve ser no futuro";
      }
    }

    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function enviarLiberacao(event) {
    event.preventDefault();
    if (!validarFormulario() || !idCondomino) return;

    setEnviando(true);
    setErroGeral("");
    setSucesso("");

    try {
      const response = await apiFetch("http://localhost:8080/api/liberacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_condomino: Number(idCondomino),
          tipo_visitante: form.tipo_visitante,
          nome_visitante: form.nome_visitante,
          cpf_visitante: form.cpf_visitante,
          rg_visitante: form.rg_visitante,
          placa_visitante: form.placa_visitante,
          data_hora_expiracao: new Date(form.data_hora_expiracao).toISOString(),
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErroGeral(dados.mensage || "Não foi possível criar a liberação.");
        return;
      }

      setSucesso("Liberação criada com sucesso! A portaria receberá o pedido.");
      setForm({
        tipo_visitante: "",
        nome_visitante: "",
        cpf_visitante: "",
        rg_visitante: "",
        placa_visitante: "",
        data_hora_expiracao: "",
      });
    } catch {
      setErroGeral("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  const inputClass = (campo) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
      errosCampos[campo]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/60">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0c2d6b]">Nova liberação</h2>
        <p className="mt-1 text-sm text-gray-500">
          Preencha os dados do visitante para solicitar acesso ao condomínio.
        </p>
      </div>

      {erroGeral && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{erroGeral}</span>
        </div>
      )}

      {sucesso && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{sucesso}</span>
        </div>
      )}

      <form onSubmit={enviarLiberacao} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="tipo_visitante" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            Tipo de visitante
          </label>
          <select
            id="tipo_visitante"
            value={form.tipo_visitante}
            onChange={(e) => atualizarCampo("tipo_visitante", e.target.value)}
            className={inputClass("tipo_visitante")}
          >
            <option value="">Selecione...</option>
            {TIPOS_VISITANTE.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errosCampos.tipo_visitante && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.tipo_visitante}</p>
          )}
        </div>

        <div>
          <label htmlFor="nome_visitante" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            Nome do visitante
          </label>
          <input
            id="nome_visitante"
            type="text"
            value={form.nome_visitante}
            onChange={(e) => atualizarCampo("nome_visitante", e.target.value)}
            className={inputClass("nome_visitante")}
            placeholder="Nome completo"
          />
          {errosCampos.nome_visitante && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.nome_visitante}</p>
          )}
        </div>

        <div>
          <label htmlFor="cpf_visitante" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            CPF do visitante
          </label>
          <input
            id="cpf_visitante"
            type="text"
            inputMode="numeric"
            value={form.cpf_visitante}
            onChange={(e) => atualizarCampo("cpf_visitante", formatarCPF(e.target.value))}
            className={inputClass("cpf_visitante")}
            placeholder="000.000.000-00"
          />
          {errosCampos.cpf_visitante && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.cpf_visitante}</p>
          )}
        </div>

        <div>
          <label htmlFor="rg_visitante" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            RG <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            id="rg_visitante"
            type="text"
            value={form.rg_visitante}
            onChange={(e) => atualizarCampo("rg_visitante", e.target.value)}
            className={inputClass("rg_visitante")}
            placeholder="Documento de identidade"
          />
        </div>

        <div>
          <label htmlFor="placa_visitante" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            Placa do veículo <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            id="placa_visitante"
            type="text"
            value={form.placa_visitante}
            onChange={(e) => atualizarCampo("placa_visitante", e.target.value.toUpperCase())}
            className={inputClass("placa_visitante")}
            placeholder="ABC1D23"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="data_hora_expiracao" className="mb-1.5 block text-sm font-medium text-[#0c2d6b]">
            Válido até
          </label>
          <input
            id="data_hora_expiracao"
            type="datetime-local"
            value={form.data_hora_expiracao}
            onChange={(e) => atualizarCampo("data_hora_expiracao", e.target.value)}
            className={inputClass("data_hora_expiracao")}
          />
          {errosCampos.data_hora_expiracao && (
            <p className="mt-1.5 text-xs text-red-600">{errosCampos.data_hora_expiracao}</p>
          )}
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={enviando || !idCondomino}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-700 px-4 py-2.5 font-medium text-white shadow-md shadow-blue-600/30 transition-transform active:scale-95 hover:from-sky-400 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-8"
          >
            <UserPlus className="h-4 w-4" />
            {enviando ? "Enviando..." : "Solicitar liberação"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CentralCondomino() {
  const [abaAtiva, setAbaAtiva] = useState("liberacoes");
  const [idCondomino, setIdCondomino] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const response = await apiFetch("http://localhost:8080/api/verification", {
          headers: { authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const dados = await response.json();
          setIdCondomino(dados.id);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-[#f0f7ff] text-gray-800">
      <NavBarCondomino abaAtiva={abaAtiva} onTrocarAba={setAbaAtiva} />

      <main className="flex-1 p-4 pt-16 md:ml-64 md:p-8 md:pt-8">
        <header className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Área do condômino
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#0c2d6b]">
            {abaAtiva === "liberacoes" ? "Liberações" : "Configurações"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            {abaAtiva === "liberacoes"
              ? "Solicite a entrada de visitantes para o condomínio."
              : "Gerencie suas preferências de conta."}
          </p>
        </header>

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-blue-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-gray-500">Carregando...</p>
          </div>
        ) : abaAtiva === "liberacoes" ? (
          <FormularioLiberacao idCondomino={idCondomino} />
        ) : (
          <ConfiguracoesCondomino />
        )}
      </main>
    </div>
  );
}
