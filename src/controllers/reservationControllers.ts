import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import { parseISO, isValid } from "date-fns";

//Relação entre usuário e calendário de vacinação
export const requestReservation = async (req: Request, res: Response) => {
    try {
        //Pegando o id do usuário da requisição
        const userId = req.id_User;
        //Pegando as credenciais do body
        const { date, idCalendar } = req.body;

        //Validando a existência do usuário e anexando a propriedade Vaccination
        const searchUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                requestReservation: true,
            }
        });
        if (!searchUser) {
            return res.status(400).json({ error: "User not found" });
        }

        //Validar a existência do evento no calendário
        if (!idCalendar) {
            return res.status(400).json({ error: "The event is mandatory" });
        }
        const searchEvent = await prisma.vaccinationCalendar.findUnique({
            where: {
                id: idCalendar,
            }
        });
        if (!searchEvent) {
            return res.status(400).json({ error: "Event not found" });
        }

        //Validar a date
        if (!date || !isValid(parseISO(date))) {
            return res.status(400).json({ error: "Incorrect date entered" });
        }

        //Validar que não existe uma requisição do com a date e id do calendario
        const isDuplicate = await prisma.requestReservation.count({
            where: {
                idUser: userId,
                idCalendar: idCalendar,
                date: parseISO(date)
            },
        });
        if (isDuplicate > 0) {
            return res.status(400).json({ message: "Request reservation registration already done" });
        }

        const newRequestReservation = await prisma.requestReservation.create({
            data: {
                id: uuidv4(),
                date: date,
                status: "Reservation requested",
                idCalendar: idCalendar,
                idUser: userId,
            }
        });

        res.status(200).json({ message: "Reservation requested", newRequestReservation });
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
