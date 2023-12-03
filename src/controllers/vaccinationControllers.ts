import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import { parseISO, isValid, isSameDay } from "date-fns";

//Relação entre usuário e vacina
//Método para criar um registro de vacinação
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
            return res.status(400).json({ error: "User not found" });
        }
        
        //Validação da vacina
        const searchVaccine = await prisma.vaccine.findUnique({
            where: {
                name: vaccine,
            }
        });
        if (!searchVaccine) {
            return res.status(400).json({ error: "Vaccine not found" });
        }
        
        //Validação de date
        if (!date) {
            return res.status(400).json({ error: "The date is mandatory" });
        }
        if (!isValid(parseISO(date))) {
            return res.status(400).json({ error: "Incorrect date entered" });
        }

        //Validando que não existe registro cadastrado com data e a mesma vacina
        const verifyVaccineId = await prisma.vaccination.count({
            where: {
              idUser: userId,
              idVaccine: vaccine.id,
            },
          });
          
        const verifyVaccineDate = await searchUser.vaccination.some((resgiter) => isSameDay(new Date(resgiter.date), parseISO(date)));
        if (verifyVaccineId >= 1 && verifyVaccineDate) { //Validação dupla
            return res.status(400).json({ message: "Vaccination registration already done" });
        }

        //Criando objeto
        const newRegisterVaccination = await prisma.vaccination.create({
            data: {
                id: uuidv4(),
                date: date,
                quantityApplied: 1 || applied,
                idVaccine: searchVaccine.id,
                idUser: userId
            }
        });

        //Retornando resultado
        res.status(200).json({ message: "Registered vaccination", newRegisterVaccination });

    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//Método para imprimir todas os resistros de vacinação do usuário
export const listVaccination = async (req: Request, res: Response) => {
    try {
        //Capturando o id do usuário atraves do token passado pela requisição
        const userId = req.id_User;

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
            return res.status(400).json({ error: "User not found" });
        }

        res.status(200).json(searchUser.vaccination);
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

