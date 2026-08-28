function LoginOperario() {
  return (
    <div className=" bg-[#45325e] min-h-screen flex items-center justify-center">
      <div className="bg-[#f4f3ef] p-10 rounded-md">
        <h1 className="text-4xl font-bold">LOGIN</h1>
        <div className="flex flex-col gap-1 w-full max-w-sm">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            E-MAIL
          </label>
          <input
            type="text"
            id="email"
            placeholder="email@empresa.com"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex flex-col gap-1 w-full max-w-sm">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            SENHA
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="pt-6">
          <button className="px-4 py-2 bg-purple-500 rounded-lg text-white flex w-full justify-center">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginOperario;
