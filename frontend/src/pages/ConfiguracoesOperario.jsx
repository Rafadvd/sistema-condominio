import NavBar from "../components/NavBar";
import ConfiguracoesCondomino from "./ConfiguracoesCondomino";

export default function ConfiguracoesOperario() {
  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-gray-800">
      <NavBar />
      <main className="flex-1 p-4 pt-16 md:ml-64 md:p-8 md:pt-8">
        <header className="mb-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm shadow-purple-100/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6200e2]">Portaria</p>
          <h1 className="mt-1 text-3xl font-bold text-[#2d0a4e]">Configurações</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">Gerencie as configurações da sua conta.</p>
        </header>
        <ConfiguracoesCondomino apiUrl="http://localhost:8080/api/operario/senha" tema="roxo" />
      </main>
    </div>
  );
}
