import express from "express";
const reservationRoutes = express.Router();

//Importando as funções de vaccination
import { requestReservation, listReservations, removeReservation, updateReservation, updateStatusReservation } from "../controllers/reservationControllers";
import { verifyToken } from "../middleware/verifyToken";
import { verifyTokenAdmin } from "../middleware/verifyTokenAdmin";

//Rotas
reservationRoutes.get("/", verifyToken, listReservations);
reservationRoutes.post("/", verifyToken, requestReservation);
reservationRoutes.delete("/remove/:id", verifyToken, removeReservation);
reservationRoutes.put("/update/:id", verifyToken, updateReservation);
reservationRoutes.patch("/update/status/:id", verifyTokenAdmin, updateStatusReservation);

export { reservationRoutes };