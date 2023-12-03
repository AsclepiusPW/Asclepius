import express from "express";
const vaccinationRoutes = express.Router();

//Importando as funções de vaccination
import { registerVaccination } from "../controllers/vaccination";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
vaccinationRoutes.post("/", verifyToken, registerVaccination);

export { vaccinationRoutes };