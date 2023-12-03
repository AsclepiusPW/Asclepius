import express from "express";
const vaccinationRoutes = express.Router();

//Importando as funções de vaccination
import { registerVaccination, listVaccination, removeVaccination } from "../controllers/vaccinationControllers";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
vaccinationRoutes.get("/", verifyToken, listVaccination);
vaccinationRoutes.post("/", verifyToken, registerVaccination);
vaccinationRoutes.delete("/remove/:id", verifyToken, removeVaccination);
export { vaccinationRoutes };