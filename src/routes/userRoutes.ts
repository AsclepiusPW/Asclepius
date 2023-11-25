import express from 'express';
const userRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllUsers } from '../controllers/userControllers';

//Rotas
userRoutes.get("/", findAllUsers);

export { userRoutes };