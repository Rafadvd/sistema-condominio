import "dotenv/config";
import express from "express";
import rotas from "./routes/routes.js";
import cors from "cors";

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

app.listen(process.env.PORT, () => {
  console.log("ON");
});
