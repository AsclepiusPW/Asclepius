import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";

function verifyDate(referenceDate: string): boolean {
    const date: string = "2023-11-22T08:45:00Z";
    
    const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    
    return dateRegex.test(date) && date.length === referenceDate.length;
}

export const createCalendar = async (req: Request, res: Response) => {
    try {
        const { local, date, places, status, observation, responsible } = req.body;

        //Validações iniciais
        if (!local) {
            return res.status(400).json({ error: "The local is mandatory" });
        }
        if (!date) {
            return res.status(400).json({ error: "The date is mandatory" });
        }
        if (!verifyDate(date)) {
            return res.status(400).json({ error: "The date is invalid" });
        }
        if (!places) {
            return res.status(400).json({ error: "The places is mandatory" });
        }
        if (!responsible) {
            return res.status(400).json({ error: "The responsible is mandatory" });
        }

        // Verificar se há algum evento de calendário marcado para o mesmo local no mesmo dia
        const existingEvent = await prisma.vaccinationCalendar.findFirst({
            where: {
                local: local,
                date: date,
            },
        });

        // Caso já exista um evento com essas credenciais
        if (existingEvent) {
            return res.status(400).json({ message: "Event with venue and date already registered" });
        }

        //Criando objeto o evento
        const createEventInCalendar = await prisma.vaccinationCalendar.create({
            data: {
                id: uuidv4(),
                local: local,
                date: date,
                places: places,
                responsible: responsible,
                status: "Status not informed" || status,
                observation: "Observation not informed" || observation, 
            }
        });

        //Retornando resultado
        res.status(200).json({ message: "Registered event", createEventInCalendar});
    } catch (error) {
        //Caso haja erro:
        console.error("Error retrieving calendar: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

