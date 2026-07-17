import express, { Router } from "express";
import { Operario } from "../controller/controllerOperario.js";
import { Condomino } from "../controller/controllerCondomino.js";
import { Liberacao } from "../controller/controllerLiberacao.js";
import { lookupService } from "node:dns";

const rotas = Router();

rotas.post("/operario", Operario.create)
rotas.get("/operario", Operario.read)
rotas.put("/operario", Operario.update)
rotas.delete("/operario", Operario.delete)

rotas.post("/condomino", Condomino.create)
rotas.get("/condomino", Condomino.read)
rotas.put("/condomino", Condomino.update)
rotas.delete("/condomino", Condomino.delete)

rotas.post("/liberacao", Liberacao.create)
rotas.get("/liberacao", Liberacao.read)
rotas.put("/liberacao", Liberacao.update)
rotas.delete("/liberacao", Liberacao.delete)

export default rotas;