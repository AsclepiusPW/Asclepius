import express from "express";
const reservationRoutes = express.Router();

//Importando as funções de vaccination
import { requestReservation, listReservations } from "../controllers/reservationControllers";
import { verifyToken } from "../middleware/verifyToken";

//Rotas
reservationRoutes.get("/", verifyToken, listReservations);
reservationRoutes.post("/", verifyToken, requestReservation);

export { reservationRoutes };