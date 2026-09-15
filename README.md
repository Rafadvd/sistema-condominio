# Sistema de Gestão de Condomínio
 
Aplicação web full stack para gestão de rotinas de condomínio, com áreas separadas para portaria/operários e condôminos. O sistema controla o acesso de visitantes, o cadastro de moradores e operários, e a autenticação de cada perfil.
 
## Sumário
 
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Perfis de Acesso](#perfis-de-acesso)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Instalação e Execução Local](#instalação-e-execução-local)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Aprendizados e Destaques Técnicos](#aprendizados-e-destaques-técnicos)
- [Autor](#autor)
- [Licença](#licença)
## Funcionalidades
 
### Área da Portaria
 
- Central de liberações: acompanhamento de visitantes com status `PENDENTE` ou `EM_VISITA`.
- Atualização de status da liberação: registro de entrada, registro de saída ou cancelamento.
- Cadastro e visualização de condôminos.
- Cadastro e visualização de operários — disponível somente para administradores.
- Histórico de liberações — disponível somente para administradores.
- Configurações da conta: troca de senha.
- Operários não administradores acessam somente as telas de Central, Condôminos e Configurações.
- Rotas restritas (Operários e Histórico) redirecionam usuários não administradores para a Central.
### Área do Condômino
 
- Criação de liberações de acesso para visitantes.
- Cadastro do visitante com tipo, nome, CPF, RG (opcional), placa (opcional) e data/hora de expiração.
- Configurações da conta: troca de senha (senha atual, nova senha e confirmação).
- Validações de formulário com feedback visual de sucesso e erro.
### Autenticação e Segurança
 
- Telas de login separadas para operário e condômino.
- Autenticação via JWT, armazenado no `localStorage`.
- Quando o token expira ou a API retorna `401`, o token é removido e o usuário é redirecionado ao login correspondente.
- Máscaras de digitação:
  - CPF: `000.000.000-00`
  - Telefone: `(00) 00000-0000`
- Interface responsiva, com identidade visual própria para cada área (roxo para portaria, azul para condômino).
## Tecnologias Utilizadas
 
**Front-end**
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
**Back-end**
- Node.js
- TypeScript
- Express
- bcrypt
- jsonwebtoken
- dotenv
- cors
**Banco de Dados**
- PostgreSQL
- pg (driver Node.js para PostgreSQL)
## Perfis de Acesso
 
O sistema trabalha com dois perfis principais, definidos no token JWT:
 
| Perfil | Descrição |
|---|---|
| Operário | Responsável pela portaria. Pode ter a flag de administrador, que libera acesso a funcionalidades adicionais (cadastro de operários e histórico completo de liberações). Operários não administradores têm acesso restrito. |
| Condômino | Responsável por criar e gerenciar liberações de acesso para seus visitantes, além de gerenciar sua própria senha. |
 
Middlewares no back-end garantem que apenas usuários autenticados acessem rotas protegidas, e que apenas operários administradores possam gerenciar outros operários.
 
## Estrutura de Pastas
 
```
├── frontend/    # Aplicação React + Vite
├── backend/     # API Express + TypeScript
└── sql/         # Script de criação das tabelas
```
 
## Instalação e Execução Local
 
Pré-requisitos: Node.js e PostgreSQL instalados.
 
1. Clone o repositório
```bash
   git clone <url-do-repositorio>
   cd sistema-gestao-condominio
```
 
2. Instale as dependências do back-end
```bash
   cd backend
   npm install
```
 
3. Instale as dependências do front-end
```bash
   cd ../frontend
   npm install
```
 
4. Configure as variáveis de ambiente
   Crie arquivos `.env` nas pastas `backend` e `frontend` a partir dos respectivos arquivos `.env.example` (veja a seção Variáveis de Ambiente abaixo).
5. Execute o script SQL
   Rode o script localizado em `/sql` no seu banco PostgreSQL para criar as tabelas `operario`, `condomino` e `liberacao`.
6. Inicie o back-end
```bash
   cd backend
   npm run dev
```
 
7. Inicie o front-end
```bash
   cd frontend
   npm run dev
```
 
## Variáveis de Ambiente
 
Crie `backend/.env` com as seguintes variáveis:
 
```env
DATABASE_USER=
DATABASE_HOST=
DATABASE_NAME=
DATABASE_PASSWORD=
DATABASE_PORT=
PORT=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
```

Crie `frontend/.env` com a URL pública da API:

```env
VITE_API_URL=http://localhost:8080
```

Em produção, substitua os valores locais pelos domínios publicados. Por exemplo, `VITE_API_URL=https://api.exemplo.com` e `FRONTEND_URL=https://app.exemplo.com`.
 
## Scripts Disponíveis
 
**Front-end**
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run lint` | Executa a verificação de lint no código |
 
**Back-end**
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia a API em modo de desenvolvimento |
 
## Aprendizados e Destaques Técnicos
 
Pontos que trabalhei em profundidade neste projeto:
 
- Autenticação JWT completa, do login à validação de token em cada requisição protegida.
- Controle de acesso por perfil (operário/condômino) e por permissão (administrador/não administrador).
- Proteção de rotas no back-end (middlewares) e no front-end (redirecionamentos condicionais).
- Hash de senhas com bcrypt, evitando que credenciais sejam armazenadas ou retornadas em texto puro.
- Integração entre React, Express e PostgreSQL, cobrindo o fluxo de dados da interface ao banco.
- Detalhes de experiência do usuário: máscaras de campo, feedback visual de erros/sucesso e identidades visuais distintas para cada área do sistema.
## Autor
 
Desenvolvido por Rafael David de Mattos
 
Linkedin: https://www.linkedin.com/in/rafaeldvdmattos/
Github: https://github.com/Rafadvd/
