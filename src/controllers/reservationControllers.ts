import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import { parseISO, isValid } from "date-fns";

//Relação entre usuário e calendário de vacinação (Realizado por USUÁRIO)
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
            return res.status(404).json({ error: "User not found" });
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
            return res.status(404).json({ error: "Event not found" });
        }

        //Validar a date
        if (!date || !isValid(parseISO(date))) {
            return res.status(400).json({ error: "Incorrect date entered" });
        }

        //Validar que não existe uma requisição do com a date e id do calendario
        const existingReservation = await prisma.requestReservation.findFirst({
            where: {
                idUser: userId,
                idCalendar: idCalendar,
            },
        });

        if (existingReservation) {
            return res.status(409).json({ message: "Request reservation already exists for this user and calendar" });
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

        res.status(201).json({ message: "Reservation requested", newRequestReservation });
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//Método para listar todas as solicitações (Realizado por USUÁRIO)
export const listReservations = async (req: Request, res: Response) => {
    try {
        //Pegando o id do usuário do tokne passado no headers da requisição
        const userId = req.id_User;

        //Validando a existência do usuário e anexando a propriedade Vaccination
        const searchUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                requestReservation: {
                    include: {
                        calendar: {
                            include: {
                                vaccine: true // Incluindo as informações da vacina relacionada
                            }
                        }
                    }
                },
            }
        });
        if (!searchUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(searchUser.requestReservation);
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//Método de remover uma solicitação (Realizado por USUÁRIO)
export const removeReservation = async (req: Request, res: Response) => {
    try {
        //Pegando o id do usuário do tokne passado no headers da requisição
        const userId = req.id_User;
        //Pegando o id da reservation
        const idReservationRemove = req.params.id;

        //Verificando se o id passado é válido
        if (!validate(idReservationRemove)) {
            return res.status(400).json({ error: "Invalid id" });
        }

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
            return res.status(404).json({ error: "User not found" });
        }

        //Validando a existência de uma solicitação de reserva com esse id
        const searchReservation = await prisma.requestReservation.findUnique({
            where: {
                id: idReservationRemove,
            }
        });
        if (!searchReservation) {
            return res.status(404).json({ error: "Request reservation not found" });
        }

        //Removendo a solicitação de reserva da entidade RequestReservation
        await prisma.requestReservation.delete({
            where: {
                id: idReservationRemove,
            }
        });

        //Atualizando o array do solicitações do usuário
        const updateRemoveReservation = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                requestReservation: {
                    disconnect: [{ id: idReservationRemove }]
                },
            },
            include: {
                requestReservation: true,
            }
        });

        res.status(200).json({ message: "Reservation request removed", updateRemoveReservation });
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//Método para atualizar uma solicitação (Realizado por USUÁRIO)
export const updateReservation = async (req: Request, res: Response) => {
    try {
        //Pegando o id do usuário da requisição
        const userId = req.id_User;
        //Pegando as credenciais do body
        const { date, idCalendar } = req.body;
        //Pegando o id da  reservation
        const idReservation = req.params.id;

        //Verificando se o id passado é válido
        if (!validate(idReservation)) {
            return res.status(400).json({ error: "Invalid id" });
        }

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
            return res.status(404).json({ error: "User not found" });
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
            return res.status(404).json({ error: "Event not found" });
        }

        //Validar a date
        if (!date || !isValid(parseISO(date))) {
            return res.status(400).json({ error: "Incorrect date entered" });
        }

        //Validando que realmente existe a solicitação de reserva
        const searchReservation = await prisma.requestReservation.findUnique({
            where: {
                id: idReservation,
            },
        });
        if (!searchReservation) {
            return res.status(404).json({ error: "Request reservation not found" });
        }

        //Validar que não existe uma requisição do com a date e id do calendario
        const isDuplicate = await prisma.requestReservation.count({
            where: {
                idUser: userId,
                idCalendar: idCalendar,
                date: parseISO(date),
                id: { not: idReservation }, //Verificando se há outra solicitação com as credenciais informadas, porém desconsiderando a reserva atual
            },
        });
        if (isDuplicate > 0) {
            return res.status(409).json({ message: "Request reservation registration already done" });
        }

        //Atualizando o registro de vacinação
        await prisma.requestReservation.update({
            where: { id: idReservation },
            data: {
                date: date,
                idCalendar: idCalendar,
            }
        });

        //Atualizando o array de requesteReservation do usuário
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                requestReservation: {
                    update: [
                        {
                            where: { id: idReservation },
                            data: {
                                date: parseISO(date),
                                idCalendar: idCalendar,
                            },
                        },
                    ],
                },
            },
            include: {
                requestReservation: true,
            }
        });

        res.status(200).json({ message: "Registered reservation request", updatedUser });
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//Método para atualizar status de uma solicitação de evento (Realizado por ADMIN)
export const updateStatusReservation = async (req: Request, res: Response) => {
    try {
        const registerId = req.params.id;
        const { status } = req.body;

        //Verificando se o id passado é válido
        if (!validate(registerId)) {
            return res.status(400).json({ error: "Invalid id" });
        }

        //Validação de registro de solicitação
        const searchReservation = await prisma.requestReservation.findUnique({
            where: {
                id: registerId
            }
        });
        if (!searchReservation) {
            return res.status(404).json({ error: "Vaccination not found" });
        }

        const userId = searchReservation.idUser as string;

        //Verificando se o id passado é válido
        if (!validate(userId)) {
            return res.status(400).json({ error: "Invalid User id" });
        }

        //Atualizando o registro de vacinação
        await prisma.requestReservation.update({
            where: { id: registerId },
            data: {
                status: status
            }
        });

        //Atualizando o array de requesteReservation do usuário
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              requestReservation: {
                update: [
                  {
                    where: { id: registerId },
                    data: {
                      status: status,
                    },
                  },
                ],
              },
            },
            include: {
              requestReservation: true,
            },
          });

        res.status(200).json({ message: "Update reservation request", updatedUser });
    } catch (error) {
        //Retornando erro caso haja
        console.error("Error retrieving vaccination: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}