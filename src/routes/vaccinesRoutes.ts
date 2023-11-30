import express from "express";
const vaccinesRoutes = express.Router();

//Conjunto de requisições do usuário:
import {
  findAllVaccines,
  createVaccines,
} from "../controllers/vaccinesController";

//Rotas
vaccinesRoutes.get("/", findAllVaccines);
vaccinesRoutes.post("/", createVaccines);

export { vaccinesRoutes };
