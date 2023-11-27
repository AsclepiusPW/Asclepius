import { Request, Response } from 'express';
import { prisma } from '../prismaClient/prismaClient';
import { v4 as uuidv4, validate } from 'uuid';
import bcryptjs from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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

        const existUserWithTelefone = await prisma.user.findUnique({
            where:{
                telefone: telefone
            }
        })

        if (existUser || existUserWithTelefone) {
            res.status(400).json({ "erro": "Existing user with this e-mail or with this telefone" });
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

//Requisção para criar um token para o usuário
export const authenticateUser = async (req:Request, res:Response) => {
    try {
        const {name, password, confirmPassword, email} = req.body;
        
        //Validações (Servem para garantir que todos os campos do formulário tenham sido passados)
        if (!name) {
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

        //Validando que o usuário realmente existe (Busca pelo o e-mail)
        const existUser = await prisma.user.findUnique({
            where:{
                email: email
            }
        });

        if (!existUser) {
            res.status(400).json({ "erro": "User does not exist" });
        }else{
            //Coferindo a senha passada com a senha salva no banco
            const checkPassword = await bcryptjs.compare(password, existUser?.password);
            
            //Conferido o usuário que passou a senha (True se verdadeiro e False se falso)
            const compareName = existUser?.name === name;

            if (!checkPassword || !compareName) {
                res.status(400).json({ "erro": "Invalid password or user" });
            }else{
                const secret = process.env.SECRET;
                //Método para confirmar que realmente o segredo do JWT existe
                if (!secret) {
                    throw new Error('JWT secret is not defined');
                }

                const token = sign(
                    {name: existUser.name},
                    secret,
                    {expiresIn: "1d", subject:existUser.id}
                );

                res.status(200).json({"message": "Authentication successful", token});
            }
        }
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving users: ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Método de atualização do usuário (Possível método para atualizar)
export const editUser = async (req:Request, res: Response) => {
    try {
        const idUser = req.params.id;
        const {name, password, confirmPassword, email, telefone, image, latitude, longitude} = req.body;

        //Procurando o usuário pelo o id
        const existUserWithId = await prisma.user.findUnique({
            where:{
                id: idUser
            }
        });
        
        //Confirmando que o usuário existe
        if (!existUserWithId) {
            return res.status(400).json({error: "Not existing user"});
        }

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

        //Criptografando a senha do usuário:
        const salt = await bcryptjs.genSalt(15);
        const hashPassword = await bcryptjs.hash(password, salt);

        const updateUser = await prisma.user.update({
            where:{
                id: idUser
            },
            data:{
                name: name,
                password: hashPassword,
                email: email,
                telefone: telefone,
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            }
        });

        res.status(200).json({message: "Updated User", updateUser});
    } catch (error) {
      //Retornando erro caso haja
      console.error("Error retrieving users: ", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Requisiçõa para remover um usuário
export const removeUsers = async (req:Request, res: Response) => {
    try {
        const userId = req.params.id;

        //Verificando se o id passado é válido
        if (!validate(userId)) {
            return res.status(400).json({error: "Invalid id"});
        }

        //Verificando se o usuário realmente existe
        const existUserId = await prisma.user.findUnique({
            where:{
                id: userId
            }
        });

        if (!existUserId) {
            res.status(400).json({error: "Not existing user"})
        }else{
            await prisma.user.delete({
                where:{
                    id: userId
                }
            });

            res.status(200).json({message: "User removed"});
        }
        
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving users: ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}