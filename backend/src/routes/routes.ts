import express, { Router } from "express";
import { Operario } from "../controller/controllerOperario.js";
import { Condomino } from "../controller/controllerCondomino.js";
import { Liberacao } from "../controller/controllerLiberacao.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js"
import { LoginCondomino } from "../controller/controllerCondominoAuth.js"
import { LoginOperario } from "../controller/controllerOperarioAuth.js"
import { lookupService } from "node:dns";

const rotas = Router();

rotas.post("/api/operario", ensureAuthenticated, Operario.create);
rotas.get("/api/operario", ensureAuthenticated, Operario.read);
rotas.put("/api/operario", ensureAuthenticated, Operario.update);
rotas.delete("/api/operario", ensureAuthenticated, Operario.delete);

rotas.post("/api/condomino", ensureAuthenticated, Condomino.create);
rotas.get("/api/condomino", ensureAuthenticated, Condomino.read);
rotas.put("/api/condomino", ensureAuthenticated, Condomino.update);
rotas.delete("/api/condomino", ensureAuthenticated, Condomino.delete);

rotas.post("/api/liberacao", ensureAuthenticated, Liberacao.create);
rotas.get("/api/liberacao", ensureAuthenticated, Liberacao.read);
rotas.put("/api/liberacao", ensureAuthenticated, Liberacao.update);
rotas.delete("/api/liberacao", ensureAuthenticated, Liberacao.delete);

rotas.post("/api/loginOperario", LoginOperario.post);
rotas.post("/api/loginCondomino", LoginCondomino.post);
rotas.get("/api/verification", ensureAuthenticated, (req, res) => {
    const userId = req.userID;

    return res.status(200).json({
        id:userId
    })
});

export default rotas;