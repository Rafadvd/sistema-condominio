function NavBar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#1b0b30] text-white flex flex-col pt-16 px-6 shadow-lg">
      <nav className="flex flex-col gap-4">
        <a className="p-2 rounded hover:bg-[#452c66]" href="#">
          Central
        </a>
        <a className="p-2 rounded hover:bg-[#452c66]" href="#">
          Condominos
        </a>
        <a className="p-2 rounded hover:bg-[#452c66]" href="#">
          Operarios
        </a>
        <a className="p-2 rounded hover:bg-[#452c66]" href="#">
          Histórico
        </a>
        <a className="p-2 rounded hover:bg-[#452c66]" href="#">
          Configurações
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#452c66] flex items-center gap-3 pb-6">
        <img
          src="https://via.placeholder.com/40"
          alt="Foto de Perfil"
          className="w-10 h-10 rounded-full border border-purple-400 object-cover"
        />
        <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">Usuario</span>
            <span className="text-xs text-gray-400 truncate">Função</span>
        </div>
      </div>
    </aside>
  );
}

export default NavBar;
