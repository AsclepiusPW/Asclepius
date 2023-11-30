//Criando o mock do prisma
const prismaMock = {
  vaccine: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

//Importando dependências
import { Request, Response } from "express";
import { createVaccines } from "../../controllers/vaccinesController";

//Mokando o banco de dados
jest.mock("../../prismaClient/prismaClient.", () => ({
  prisma: prismaMock,
}));

describe("Testando o fluxo normal da Api", () => {
  //Executar esse trecho a cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Caso de teste 001 da rota vaccine
  it("Deve ser possível adicionar uma nova vacina", async () => {
    const req = {
      body: {
        name: "Vacina-test",
        type: "test",
        manufacturer: "by test",
        description: "Is a test",
        contraIndication: "not pass in test",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await createVaccines(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
