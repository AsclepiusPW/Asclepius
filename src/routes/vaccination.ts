import express from "express";
const vaccinationRoutes = express.Router();

//Importando as funções de vaccination
import { registerVaccination, listVaccination, removeVaccination, updateVaccination } from "../controllers/vaccinationControllers";
import { verifyToken } from "../middleware/verifyToken";
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin";
//Rotas
vaccinationRoutes.get("/", verifyToken, listVaccination);
vaccinationRoutes.post("/:id", verifyTokenAdmin, registerVaccination);
vaccinationRoutes.delete("/remove/:id", verifyTokenAdmin, removeVaccination);
vaccinationRoutes.put("/update/:id", verifyTokenAdmin, updateVaccination);
export { vaccinationRoutes };