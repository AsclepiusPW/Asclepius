import express from "express";
const vaccinesRoutes = express.Router();

//Conjunto de requisições do usuário:
import {
  findAllVaccines,
  createVaccines,
  editVaccine,
  removeVaccine,
} from "../controllers/vaccinesController";

//Rotas
vaccinesRoutes.get("/", findAllVaccines);
vaccinesRoutes.post("/", createVaccines);
vaccinesRoutes.patch("/update/:id", editVaccine);
vaccinesRoutes.delete("/remove/:id", removeVaccine);

export { vaccinesRoutes };
