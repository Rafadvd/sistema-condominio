import express from "express";
import rotas from "./routes/routes.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(rotas);

declare global {
  namespace Express {
    interface Request {
      userID?: string;
    }
  }
};

app.listen(8080, () => {
    console.log("ON")
});