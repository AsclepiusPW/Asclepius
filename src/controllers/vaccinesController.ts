import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import { ZodError } from "zod";
import { vaccineSchema } from "../utils/validateVaccine";

//Método para listar as vacinas
export const findAllVaccines = async (req: Request, res: Response) => {
  try {
    //Buscando todos as vacinas cadastradas no sistema
    const vaccine = await prisma.vaccine.findMany();
    return res.status(200).json(vaccine);
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving vaccine: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createVaccines = async (req: Request, res: Response) => {
  try {
    const { name, type, manufacturer, description, contraIndication } = vaccineSchema.parse(req.body);

    //Verificando se a vacina já existe no banco de dados
    const existVaccine = await prisma.vaccine.findUnique({
      where: {
        name: name,
      },
    });

    if (existVaccine) {
      return res.status(404).json({ error: "The vaccine already exists" });
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
    res.status(201).json(newVaccine);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({ error: 'Validation failed', details: errorDetails });
    } else {
      console.error('Error when registering vaccine', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

//Método para editar uma vacina
export const editVaccine = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    //Validando se o id é valido:
    if (!validate(vaccineId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { name, type, manufacturer, description, contraIndication } = vaccineSchema.parse(req.body);

    // Verificando de uma vacina já existe
    if (!(await prisma.vaccine.findUnique({ where: { id: vaccineId } }))) {
      return res.status(404).json({ error: "Not existing vaccine" });
    }

    //Verificando se não já existe uma vacina com o nome que deseja ser atualizado
    const vaccineName = await prisma.vaccine.count({ where: { name: name, id: { not: vaccineId}} });
    if(vaccineName > 0){
      return res.status(409).json({ error: "There is already a registered vaccine with this name "});
    }

    // Update dos atributos
    const updateVaccine = await prisma.vaccine.update({
      where: {
        id: vaccineId,
      },
      data: {
        name: name,
        type: type,
        manufacturer: manufacturer,
        description: description,
        contraIndication: contraIndication,
      },
    });

    return res.status(200).json({ message: "Updated Vaccine", updateVaccine });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({ error: 'Validation failed', details: errorDetails });
    } else {
      console.error('Error when registering vaccine', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

//Requisiçõa para remover uma vacina
export const removeVaccine = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    // Verificando se o id é válido
    if (!validate(vaccineId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    // Verificando se a vacina existe
    if (!(await prisma.vaccine.findUnique({ where: { id: vaccineId } }))) {
      return res.status(404).json({ error: "Not existing vaccine" });
    } else {
      await prisma.vaccine.delete({
        where: {
          id: vaccineId,
        },
      });
    }

    return res.status(200).json({ message: "Vaccine removed" });
  } catch (error) {
    console.error("Error retrieving vaccine: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Requisição buscar uma vacina pelo id
export const findVaccineById = async (req: Request, res: Response) => {
  try {
    const vaccineId = req.params.id;

    // Verificando se o id é válido
    if (!validate(vaccineId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    //Procurando vacina pelo o id
    const vaccine = await prisma.vaccine.findUnique({
      where: {
        id: vaccineId,
      },
      select:{ //Listando os campos que desejas retornar
        name: true,
        type: true,
        manufacturer: true,
        description: true,
        contraIndication: true,
      }
    });
    if (!vaccine) {
      return res.status(404).json({ message: "vaccine not found" });
    }

    return res.status(200).json(vaccine);
  } catch (error) {
    console.error("Error retrieving vaccine: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
