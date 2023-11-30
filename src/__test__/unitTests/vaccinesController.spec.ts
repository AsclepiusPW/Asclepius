//Criando o mock do prisma
const prismaMock = {
  vaccine: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

//Importando dependências
import { Request, Response } from "express";
import {
  createVaccines,
  editVaccine,
} from "../../controllers/vaccinesController";
import { v4 as uuid } from "uuid";

//Mokando o banco de dados
jest.mock("../../prismaClient/prismaClient", () => ({
  prisma: prismaMock,
}));

describe("Testando o fluxo normal da Api", () => {
  //Executar esse trecho a cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Caso de teste 001 da rota vaccine
  it("Deve ser possível adicionar uma nova vacina", async () => {
    // Criando o objeto request
    const req = {
      body: {
        name: "Vacina-test",
        type: "test",
        manufacturer: "by test",
        description: "Is a test",
        contraIndication: "not pass in test",
      },
    } as Request;

    // Criando o objeto response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Adicionando a vacina
    await createVaccines(req, res);

    // Resultados esperado
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("Deve ser possívle editar uma vacina existente", async () => {
    // Criando um id
    const vaccineId: String = uuid();
    prismaMock.vaccine.findUnique.mockResolvedValueOnce({
      id: vaccineId,
      name: "Vacina-test1",
      type: "test1",
      manufacturer: "by test1",
      description: "Is a test1",
      contraIndication: "not pass in test2.1",
    });

    // Criando o objeto request
    const updateVaccine = {
      name: "Vacina-test2",
      type: "test2",
      manufacturer: "by test2",
      description: "Is a test2",
      contraIndication: "not pass in test2",
    };
    const req = {
      params: {
        id: vaccineId,
      },
      body: updateVaccine,
    } as unknown as Request;

    // Criando o objeto response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Procedimento para atualizar a vacina
    await editVaccine(req, res);

    // Resultados esperados
    expect(prismaMock.vaccine.update).toHaveBeenCalledWith({
      data: updateVaccine,
      where: {
        id: vaccineId,
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Updated Vaccine",
    });
  });
});
