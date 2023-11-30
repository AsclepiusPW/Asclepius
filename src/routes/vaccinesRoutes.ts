import express from "express";
const vaccinesRoutes = express.Router();

//Conjunto de requisições do usuário:
import {
  findAllVaccines,
  createVaccines,
  editVaccine,
} from "../controllers/vaccinesController";

//Rotas
vaccinesRoutes.get("/", findAllVaccines);
vaccinesRoutes.post("/", createVaccines);
vaccinesRoutes.patch("/:id", editVaccine);

export { vaccinesRoutes };
