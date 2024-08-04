import express from "express";
const vaccinesRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllVaccines, createVaccines, editVaccine, removeVaccine, findVaccineById} from "../controllers/vaccinesController";
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
vaccinesRoutes.get("/", findAllVaccines);
vaccinesRoutes.post("/", verifyTokenAdmin ,createVaccines);
vaccinesRoutes.get("/:id", verifyToken, findVaccineById);
vaccinesRoutes.patch("/update/:id", verifyTokenAdmin, editVaccine);
vaccinesRoutes.delete("/remove/:id", verifyTokenAdmin, removeVaccine);

export { vaccinesRoutes };
