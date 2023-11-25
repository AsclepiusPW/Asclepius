import { Request, Response } from 'express';
import { prisma } from '../prismaClient/prismaClient';

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
