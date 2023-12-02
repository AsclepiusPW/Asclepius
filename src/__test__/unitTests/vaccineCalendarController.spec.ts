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

    //Caso de teste 002
    it("Deve ser possível remover um evento já cadastrado", async () => {
        //Supondo que exista um evento com esse id
        const eventId = "026857bb-d5e9-4634-9170-2687a33f669e";
        prismaMock.vaccinationCalendar.findUnique.mockResolvedValueOnce({ id: eventId });

        //Criando um objeto request
        const req = {
            params: {
                id: eventId,
            }
        } as unknown as Request;

        //Criando um obejto response
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        //Procedimento
        await removeEvent(req, res);

        //Resultados
        //Verifica se a função delete foi chamada de forma correta
        expect(prismaMock.vaccinationCalendar.delete).toHaveBeenCalledWith({
            where: { id: eventId },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Event removed",
        });
    });

    //Caso de teste 003
    it("Deve ser possível editar um evento já cadastrado", async () => {
        // Supondo que exista um evento com esse id
        const eventId = "026857bb-d5e9-4634-9170-2687a33f669e";
        prismaMock.vaccinationCalendar.findUnique.mockResolvedValueOnce({
            id: eventId,
            local: 'Clínica Menino da Paz',
            date: '2023-11-24T08:45:00.000Z',
            places: 5,
            responsible: 'Dr. Lucas',
            status: 'Status not informed',
            observation: 'Observation not informed',
        });

        // Construindo objeto de body
        const updateEvent = {
            local: 'Hostipal D. Pedro II',
            date: '2023-11-24T08:45:00.000Z',
            places: 50,
            responsible: 'Dr. Lucas',
        };

        // Criando objeto request
        const req = {
            params: {
                id: eventId,
            },
            body: updateEvent,
        } as unknown as Request;

        // Criando objeto response
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Procedimento
        await updateEventCalendar(req, res);

        // Resultados esperados
        expect(prismaMock.vaccinationCalendar.findUnique).toHaveBeenCalledWith({
            where: { id: eventId },
        });
        // Verificando se a função findFirst foi chamada corretamente
        expect(prismaMock.vaccinationCalendar.findFirst).toHaveBeenCalledWith({
            where: {
                date: '2023-11-24T08:45:00.000Z',
                local: 'Hostipal D. Pedro II',
            },
        });
        // Verificando se a função update foi chamada corretamente
        expect(prismaMock.vaccinationCalendar.update).toHaveBeenCalledWith({
            where: { id: eventId },
            data: updateEvent,
        });
        // Verificando se a resposta está correta
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Update event" });
    });

    //Caso de teste 004
    it("Deve ser possível imprimir as informações de um evento do calendário", async ()=>{
        // Supondo que exista um evento com esse id
    const calendarId = "026857bb-d5e9-4634-9170-2687a33f669e";
    prismaMock.vaccinationCalendar.findUnique.mockResolvedValueOnce({
      id: calendarId,
      local: "Clínica Menino da Paz",
      date: "2023-11-24T08:45:00.000Z",
      places: 5,
      responsible: "Dr. Lucas",
      status: "Status not informed",
      observation: "Observation not informed",
      scheduleVaccine: [],
    });

    // Criando objeto request
    const req = {
      params: {
        id: calendarId,
      },
    } as unknown as Request;

    // Criando objeto response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Procedimento
    await findSpecificCalendar(req, res);

    // Resultados esperados
    // Verificando se a resposta está correta
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: calendarId,
      local: "Clínica Menino da Paz",
      date: "2023-11-24T08:45:00.000Z",
      places: 5,
      responsible: "Dr. Lucas",
      status: "Status not informed",
      observation: "Observation not informed",
      scheduleVaccine: [],
    });
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

    it("Deve retornar erro se o evento não for encontrado", async () => {
        const nonExistentEventId = "026857bb-d5e9-4634-9170-2687a33f669e";
        prismaMock.vaccinationCalendar.findUnique.mockResolvedValueOnce(null);
    
        const req = {
          params: {
            id: nonExistentEventId,
          },
          body: {
            local: "Novo local",
            date: "2023-12-01T10:00:00.000Z",
            places: 50,
            responsible: "Novo responsável",
          },
        } as unknown as Request;
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
    
        await updateEventCalendar(req, res);
    
        // Verificando se a função findUnique foi chamada corretamente
        expect(prismaMock.vaccinationCalendar.findUnique).toHaveBeenCalledWith({
          where: { id: nonExistentEventId },
        });
    
        // Verificando se a função findFirst não foi chamada (pois o evento não foi encontrado)
        expect(prismaMock.vaccinationCalendar.findFirst).not.toHaveBeenCalled();
    
        // Verificando se a função update não foi chamada (pois o evento não foi encontrado)
        expect(prismaMock.vaccinationCalendar.update).not.toHaveBeenCalled();
    
        // Verificando se a resposta está correta
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
      });
});