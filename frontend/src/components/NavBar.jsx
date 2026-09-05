import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HardHat,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Central", icon: LayoutDashboard, enabled: true },
  { to: "/condominos", label: "Condôminos", icon: Users, enabled: true },
  { to: "/operarios", label: "Operários", icon: HardHat, enabled: true },
  { to: "/historico", label: "Histórico", icon: History, enabled: true },
  { to: "/configuracoes", label: "Configurações", icon: Settings, enabled: false },
];

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  const baseClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

  if (!item.enabled) {
    return (
      <div
        className={`${baseClass} cursor-not-allowed text-white/35`}
        title="Em breve"
        aria-disabled="true"
      >
        <Icon className="h-5 w-5 shrink-0 opacity-60" />
        <span className="flex-1 truncate">{item.label}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
          Em breve
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${baseClass} ${
          isActive
            ? "bg-gradient-to-r from-[#6200e2]/90 to-[#c507ff]/70 text-white shadow-md shadow-purple-900/30"
            : "text-purple-100/80 hover:bg-[#452c66] hover:text-white"
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

export default function NavBar() {
  const [aberta, setAberta] = useState(false);
  const navigate = useNavigate();

  function fecharMenu() {
    setAberta(false);
  }

  function sair() {
    localStorage.removeItem("token");
    navigate("/loginOperario");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b0b30] text-white shadow-lg shadow-purple-900/30 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {aberta && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#2d0a4e]/40 backdrop-blur-sm md:hidden"
          onClick={fecharMenu}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#1b0b30] text-white shadow-xl transition-transform duration-300 md:translate-x-0 ${
          aberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#452c66] px-5 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c507ff] to-[#6200e2] shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">Condomínio</p>
              <p className="truncate text-xs text-purple-300/70">Portaria</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fecharMenu}
            className="rounded-lg p-1.5 text-purple-200 hover:bg-[#452c66] md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-purple-400/60">
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} onNavigate={fecharMenu} />
          ))}
        </nav>

        <div className="border-t border-[#452c66] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#452c66]/40 px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6200e2] to-[#c507ff] text-sm font-bold">
              OP
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Operário</span>
              <span className="block truncate text-xs text-purple-300/70">
                Portaria
              </span>
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
