import express from "express";
const vaccinationRoutes = express.Router();

//Importando as funções de vaccination
import { registerVaccination, listVaccination } from "../controllers/vaccinationControllers";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
vaccinationRoutes.get("/", verifyToken, listVaccination);
vaccinationRoutes.post("/", verifyToken, registerVaccination);
export { vaccinationRoutes };