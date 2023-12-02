// Criando mock do prisma
const prismaMock = {
    vaccinationCalendar: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    },
};

//Importando os arquivos
import { Request, Response } from "express";
import { createCalendar, findSpecificCalendar, removeEvent, updateEventCalendar } from "../../controllers/vaccinationCalendarControllers";

//Mockando o banco do prisma
jest.mock("../../prismaClient/prismaClient", () => ({
    prisma: prismaMock,
}));

describe("Fluxo normal", () => {

    //Executar esse trecho a cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Caso de teste 001
    it("Deve ser possível adicionar um novo evento ao calendário", async () => {
        //Criando objeto request
        const req = {
            body: {
                local: "Centro médico",
                date: "2023-11-24T08:45:00.000Z",
                places: 34,
                responsible: "Dr. Miguel"
            }
        } as Request;

        //Criando objeto response
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        //Procedimento
        await createCalendar(req, res);

        //Resultado esperado
        expect(res.status).toHaveBeenCalledWith(200);
    });

    

    
});

describe("Fluxo de exceções", () => {

    //Executar esse trecho a cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar erro 400 se já existir um evento com as mesmas credenciais', async () => {
        // Mockando os dados da requisição
        const req = {
            body: {
                local: 'Clínica Menino da Paz',
                date: '2023-11-24T08:45:00.000Z',
                places: 10,
                responsible: 'Dr. Lucas',
            },
        } as Request;

        // Mockando os objetos de resposta
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Mockando a função findFirst do Prisma para simular a existência de um evento com essas credenciais
        prismaMock.vaccinationCalendar.findFirst.mockResolvedValueOnce({
            id: '026857bb-d5e9-4634-9170-2687a33f669e',
            local: 'Clínica Menino da Paz',
            date: '2023-11-24T08:45:00.000Z',
            places: 5,
            responsible: 'Dr. Lucas',
            status: 'Status not informed',
            observation: 'Observation not informed',
        });

        // Chame a função a ser testada
        await createCalendar(req, res);

        // Verifique os resultados esperados
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Event with venue and date already registered',
        });
    });
});