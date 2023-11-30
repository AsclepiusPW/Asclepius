import express from 'express';
import multer from 'multer';
const userRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllUsers, createUser, authenticateUser, removeUsers, editUser, uploadImage } from '../controllers/userControllers';
//Importando o middleware de rerificação de token
import { verifyToken } from '../middleware/verifyToken'; 
//Importando o arquivo de configuração do multer
import uploadConfigImage from '../config/multer';
const upload = multer(uploadConfigImage); 

//Rotas
userRoutes.get("/", findAllUsers);
userRoutes.post("/", createUser);
userRoutes.post("/authentication", authenticateUser);
userRoutes.patch("/upload", verifyToken, upload.single("image"), uploadImage);
userRoutes.put("/update/:id", verifyToken, editUser);
userRoutes.delete("/remove/:id", verifyToken, removeUsers);

export { userRoutes };