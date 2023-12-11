import express from "express";
const vaccinesRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllVaccines, createVaccines, editVaccine, removeVaccine, findVaccineById} from "../controllers/vaccinesController";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
vaccinesRoutes.get("/", findAllVaccines);
vaccinesRoutes.post("/", verifyToken ,createVaccines);
vaccinesRoutes.get("/:id", verifyToken, findVaccineById);
vaccinesRoutes.patch("/update/:id", verifyToken, editVaccine);
vaccinesRoutes.delete("/remove/:id", verifyToken, removeVaccine);

export { vaccinesRoutes };
