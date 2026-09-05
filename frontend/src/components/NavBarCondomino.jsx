import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "liberacoes", label: "Liberações", icon: UserPlus },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export default function NavBarCondomino({ abaAtiva, onTrocarAba }) {
  const [aberta, setAberta] = useState(false);
  const navigate = useNavigate();

  function fecharMenu() {
    setAberta(false);
  }

  function trocarAba(id) {
    onTrocarAba(id);
    fecharMenu();
  }

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c2d6b] text-white shadow-lg shadow-blue-900/30 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {aberta && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#0c2d6b]/40 backdrop-blur-sm md:hidden"
          onClick={fecharMenu}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#0c2d6b] text-white shadow-xl transition-transform duration-300 md:translate-x-0 ${
          aberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-blue-700/50 px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-md">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">Meu Condomínio</p>
              <p className="truncate text-xs text-blue-200/70">Área do condômino</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fecharMenu}
            className="rounded-lg p-1.5 text-blue-200 hover:bg-blue-800/60 md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-blue-300/50">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const ativa = abaAtiva === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => trocarAba(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  ativa
                    ? "bg-gradient-to-r from-sky-500/90 to-blue-600/90 text-white shadow-md shadow-blue-900/30"
                    : "text-blue-100/80 hover:bg-blue-800/60 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-blue-700/50 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-800/40 px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold">
              CD
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Condômino</span>
              <span className="block truncate text-xs text-blue-200/70">Morador</span>
            </div>
          </div>

          <button
            type="button"
            onClick={sair}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
