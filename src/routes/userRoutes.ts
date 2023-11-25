import express from 'express';
const userRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllUsers, createUser, authenticateUser } from '../controllers/userControllers';

//Rotas
userRoutes.get("/", findAllUsers);
userRoutes.post("/", createUser);
userRoutes.post("/authentication", authenticateUser);

export { userRoutes };