import express from "express";
const reservationRoutes = express.Router();

//Importando as funções de vaccination
import { requestReservation } from "../controllers/reservationControllers";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
reservationRoutes.post("/", verifyToken, requestReservation);

export { reservationRoutes };