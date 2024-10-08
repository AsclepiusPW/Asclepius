import express from 'express';
import multer from 'multer';
const userRoutes = express.Router();

//Conjunto de requisições do usuário:
import { findAllUsers, findSpecificUser, createUser, editPassword, authenticateUser, authenticateIsValid, authenticateAdmin, removeUsers, editUser, uploadImage } from '../controllers/userControllers';
//Importando o middleware de verificação de token
import { verifyToken } from '../middleware/verifyToken'; 
//Importando o middleware do controle de upload de imagens
import { verifyImageUser } from '../middleware/verifyImageUser';
//Importando o middleware do verificação de token do administrador
import { verifyTokenAdmin } from '../middleware/verifyTokenAdmin';
//Importando o arquivo de configuração do multer
import uploadConfigImage from '../config/multer';
const upload = multer(uploadConfigImage); 

//Rotas
userRoutes.post("/", createUser);
userRoutes.patch("/resetPassword", editPassword);
userRoutes.post("/authentication", authenticateUser);
userRoutes.get("/authentication/isValid", verifyToken, authenticateIsValid);
userRoutes.post("/authenticationAdmin", authenticateAdmin);
userRoutes.get("/", verifyTokenAdmin, findAllUsers);
userRoutes.put("/update", verifyToken, editUser);
userRoutes.get("/profile", verifyToken, findSpecificUser);
userRoutes.delete("/remove/:id", verifyTokenAdmin, removeUsers); //Quando deletar um usuário deve deletar a sua imagem  
userRoutes.patch("/upload", verifyToken, verifyImageUser, upload.single("image"), uploadImage); //Método de criar e editar a foto do usuário

export { userRoutes };