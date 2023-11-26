import express from 'express';
const userRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllUsers, createUser, authenticateUser, removeUsers } from '../controllers/userControllers';
//Importando o middleware de rerificação de token
import { verifyToken } from '../middleware/verifyToken'; 

//Rotas
userRoutes.get("/", findAllUsers);
userRoutes.post("/", createUser);
userRoutes.post("/authentication", authenticateUser);
userRoutes.delete("/remove/:id", verifyToken, removeUsers);

export { userRoutes };