import express, { Router } from "express";
import { Operario } from "../controller/controllerOperario.js";
import { Condomino } from "../controller/controllerCondomino.js";
import { Liberacao } from "../controller/controllerLiberacao.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js"
import { Login } from "../controller/controllerCondominoAuth.js"
import { lookupService } from "node:dns";

const rotas = Router();

rotas.post("/operario", Operario.create);
rotas.get("/operario", Operario.read);
rotas.put("/operario", Operario.update);
rotas.delete("/operario", Operario.delete);

rotas.post("/condomino", Condomino.create);
rotas.get("/condomino", Condomino.read);
rotas.put("/condomino", Condomino.update);
rotas.delete("/condomino", Condomino.delete);

rotas.post("/liberacao", Liberacao.create);
rotas.get("/liberacao", Liberacao.read);
rotas.put("/liberacao", Liberacao.update);
rotas.delete("/liberacao", Liberacao.delete);

rotas.post("/login", Login.post);
rotas.get("/dashboard", ensureAuthenticated, (req, res) => {
    const userId = req.userID;

    return res.status(200).json({
        id:userId
    })
});

export default rotas;