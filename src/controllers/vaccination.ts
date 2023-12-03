import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import { parseISO, isValid } from "date-fns";

//Relação entre usuário e vacina

export const registerVaccination = async (req: Request, res: Response) => {
    try {
        //Pegando o id do usuário através do token passado pela a requisição
        const userId = req.id_User;
        //Pegando as credenciais do registro de vacinação
        const { date, applied, vaccine } = req.body;

        //Validando a existência do usuário e anexando a propriedade Vaccination
        const searchUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                vaccination: true,
            }
        });
        if (!searchUser) {
            return res.status(400).json({ error: "User not found"});
        }

        //Validação da vacina
        const searchVaccine = await prisma.vaccine.findUnique({
            where: {
                name : vaccine,
            }
        });
        if (!searchVaccine) {
            return res.status(400).json({ error: "Vaccine not found"});
        }

        //Validação de date
        if (!date) {
            return res.status(400).json({ error: "The date is mandatory" });
        }
        if (!isValid(parseISO(date))) {
            return res.status(400).json({ error: "Incorrect date entered" });
        }
        
        const newRegisterVaccination = await prisma.vaccination.create({
            data: {
                id: uuidv4(),
                date: date,
                quantityApplied: 1 || applied,
                idVaccine: searchVaccine.id
            }
        });

        //Retornando resultado
        res.status(200).json({ message: "Registered vaccination", newRegisterVaccination});

    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving users: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}