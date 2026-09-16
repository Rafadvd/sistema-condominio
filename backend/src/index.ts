import "dotenv/config";
import express from "express";
import rotas from "./routes/routes.js";
import cors from "cors";
import createInicialUserOperario from "./inicialUser/createOperario.js";
import createInicialUserAdmin from "./inicialUser/createOperarioAdmin.js";
import createInicialUserCondomino from "./inicialUser/createCondomino.js";

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL não está definida.");
}

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use(rotas);

declare global {
  namespace Express {
    interface Request {
      userID?: string;
      perfil?: "operario" | "condomino";
      admin?: boolean;
    }
  }
}

async function main() {
  await createInicialUserAdmin();
  await createInicialUserOperario();
  await createInicialUserCondomino();

  app.listen(process.env.PORT, () => {
    console.log("ON");
  });
}

main().catch((erro) => {
  console.error("Falha ao iniciar o servidor:", erro);
  process.exit(1);
});