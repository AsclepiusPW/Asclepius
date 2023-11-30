import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export const findAllVaccines = async (req: Request, res: Response) => {
  try {
    //Buscando todos os usuários cadastrados no sistema
    const vaccine = await prisma.vaccine.findMany();
    return res.status(200).json(vaccine);
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createVaccines = async (req: Request, res: Response) => {
  try {
    const { name, type, manufacturer, description, contraIndication } =
      req.body;
    if (!name && !type && !manufacturer && !description && !contraIndication) {
      return res.status(400).json({ error: "All fields must be filled out" });
    }

    //Verificando se a vacina já existe no banco de dados
    const existVaccine = await prisma.vaccine.findUnique({
      where: {
        name: name,
      },
    });

    if (existVaccine) {
      return res.status(400).json({ error: "The vaccine already exists" });
    }

    //Construindo o objeto vacina
    const newVaccine = await prisma.vaccine.create({
      data: {
        id: uuidv4(),
        name: name,
        type: type,
        manufacturer: manufacturer,
        description: description,
        contraIndication: contraIndication,
      },
    });

    //Retornando a Vacina criada
    res.status(200).json(newVaccine);
  } catch (error) {
    console.error("Error when registering vaccine", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};