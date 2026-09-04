import { User, Lock } from "lucide-react";
import BackGround from "../components/BackGround";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginOperario(props) {

  const[cpf, setCpf] = useState("");
  const[senha, setSenha] = useState("");

  async function login_api(dados) {
    const response = await fetch("http://localhost:8080/api/loginOperario", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(dados)
    })
    const dados_resposta = await response.json();

    const token = dados_resposta.token;
    console.log("JWT recebido", token);

    localStorage.setItem("token", token);

    return token;
  };

  const navigate = useNavigate();


  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <BackGround />
      <div className="bg-[#f4f3ef] pb-14 pl-14 pr-14 pt-10 rounded-md relative shadow-2xl">
        <img className="h-40 mx-auto pb-2" src="../../public/logo.png" />
        <h1 className="text-3xl font-bold justify-center flex pb-2">
          Bem-vindo de volta
        </h1>
        <p className="pb-8 text-gray-700 justify-center flex">
          Acesse sua conta para continuar
        </p>
        <div className="flex flex-col gap-1 w-full max-w-sm">
          <label htmlFor="cpf" className="text-sm font-medium pb-2">
            CPF
          </label>
          <div className="relative">
            <input
              type="text"
              id="cpf"
              placeholder=" "
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              className="peer w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-900 transition-colors placeholder:text-transparent focus:border-blue-500 focus:outline-none"
            />
            <label
              htmlFor="cpf"
              className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 pointer-events-none text-sm text-gray-400 select-none transition-all duration-200 origin-left
               peer-focus:opacity-0 peer-focus:invisible peer-focus:scale-95 peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:invisible peer-[:not(:placeholder-shown)]:scale-95"
            >
              <User className="h-4 w-4 shrink-0" />
              <span>CPF</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-sm pt-4">
          <label htmlFor="senha" className="text-sm font-medium pb-2">
            Senha
          </label>
          <div className="relative">
            <input
              type="senha"
              id="senha"
              placeholder=" "
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="peer w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-900 transition-colors placeholder:text-transparent focus:border-blue-500 focus:outline-none"
            />
            <label
              htmlFor="senha"
              className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 pointer-events-none text-sm text-gray-400 select-none transition-all duration-200 origin-left
               peer-focus:opacity-0 peer-focus:invisible peer-focus:scale-95 peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:invisible peer-[:not(:placeholder-shown)]:scale-95"
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span>********</span>
            </label>
          </div>
        </div>
        <div className="pt-10">
          <button 
          className="px-4 py-2 bg-linear-to-r from-[#c507ff] to-[#6200e2] rounded-lg text-white flex w-full justify-center active:scale-95" 
          onClick={() => {
            if (!cpf .trim() || !senha.trim()) {
              return alert("Preencha todos os campos!");
            }
            const dados = {
              cpf: cpf,
              senha: senha
            }
            login_api(dados)
            navigate("/")
          }}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginOperario;
