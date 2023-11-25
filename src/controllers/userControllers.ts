import e, { Request, Response } from 'express';
import { prisma } from '../prismaClient/prismaClient';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

export const findAllUsers = async (req:Request, res: Response) => {
    try {
        //Buscando todos os usuários cadastrados no sistema
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving users: ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createUser = async (req:Request, res:Response) => {
    try {
        const {name, password, confirmPassword, email, telefone, image, latitude, longitude} = req.body;

        //Validações (Atualizar para usar ZOD ou YUP)
        if(!name){
            res.status(400).json({ "erro": "The name is mandatory" });
        }
        if (!password) {
            res.status(400).json({ "erro": "The password is mandatory" });
        }
        if (confirmPassword !== password) {
            res.status(400).json({ "erro": "Check your password" });
        }
        if (!email) {
            res.status(400).json({ "erro": "The email is mandatory" });
        }
        if (!telefone) {
            res.status(400).json({ "erro": "The telefone is mandatory" });
        }
        if (!latitude || !longitude) {
            res.status(400).json({ "erro": "The location is mandatory" });
        }

        //Verificando se já não existe um usuário com o email cadastrado:
        const existUser = await prisma.user.findUnique({
            where:{
                email: email
            }
        });

        if (existUser) {
            res.status(400).json({ "erro": "Existing user with this e-mail" });
        }else{
            //Criptografando a senha do usuário:
            const salt = await bcryptjs.genSalt(15);
            const hashPassword = await bcryptjs.hash(password, salt);

            //Construindo o objeto usuário
            const createNewUser = await prisma.user.create({
                data:{
                    id: uuidv4(),
                    name: name,
                    password: hashPassword,
                    email: email,
                    telefone: telefone,
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    image: image //Ainda não configurando o upload de arquivos
                }
            });

            //Retornando o usuário
            res.status(200).json(createNewUser);
        }
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving users: ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
