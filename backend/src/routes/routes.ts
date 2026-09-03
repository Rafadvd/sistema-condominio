import express, { Router } from "express";
import { Operario } from "../controller/controllerOperario.js";
import { Condomino } from "../controller/controllerCondomino.js";
import { Liberacao } from "../controller/controllerLiberacao.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js"
import { LoginCondomino } from "../controller/controllerCondominoAuth.js"
import { LoginOperario } from "../controller/controllerOperarioAuth.js"
import { lookupService } from "node:dns";

const rotas = Router();

rotas.post("/api/operario", Operario.create);
rotas.get("/api/operario", Operario.read);
rotas.put("/api/operario", Operario.update);
rotas.delete("/api/operario", Operario.delete);

rotas.post("/api/condomino", Condomino.create);
rotas.get("/api/condomino", Condomino.read);
rotas.put("/api/condomino", Condomino.update);
rotas.delete("/api/condomino", Condomino.delete);

rotas.post("/api/liberacao", Liberacao.create);
rotas.get("/api/liberacao", Liberacao.read);
rotas.put("/api/liberacao", Liberacao.update);
rotas.delete("/api/liberacao", Liberacao.delete);

rotas.post("/api/loginOperario", LoginOperario.post);
rotas.post("/api/loginCondomino", LoginCondomino.post);
rotas.get("/api/verification", ensureAuthenticated, (req, res) => {
    const userId = req.userID;

    return res.status(200).json({
        id:userId
    })
});

export default rotas;