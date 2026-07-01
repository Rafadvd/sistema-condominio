import express, { Router } from "express";
import { Operario } from "../controller/controllerOperario.js";
import { Condomino } from "../controller/controllerCondomino.js";

const rotas = Router();

rotas.post("/operario", Operario.create)
rotas.get("/operario", Operario.read)
rotas.put("/operario", Operario.update)
rotas.delete("/operario", Operario.delete)

rotas.post("/condomino", Condomino.create)
rotas.get("/condomino", Condomino.read)
rotas.put("/condomino", Condomino.update)
rotas.delete("/condomino", Condomino.delete)

export default rotas;