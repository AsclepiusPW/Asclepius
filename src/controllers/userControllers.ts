import { Request, Response } from "express";
import { prisma } from "../prismaClient/prismaClient";
import { v4 as uuidv4, validate } from "uuid";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";
import { z, ZodError } from 'zod';
import { userSchema, authenticationSchema, authenticationSchemaAdmin } from "../utils/validateUser";

export const findAllUsers = async (req: Request, res: Response) => {
  try {
    //Buscando todos os usuários cadastrados no sistema
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Requisição para pegar as informações de um usuário específico
export const findSpecificUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id_User;

    //Validando que de fato o usuário exista
    const userExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        //Dados do usuário que serão mostrados
        image: true,
        name: true,
        email: true,
        telefone: true,
        latitude: true,
        longitude: true,
        //Listando solicitações, calendário e vacina
        requestReservation: {
          include: {
            calendar: {
              include: {
                vaccine: true,
              }
            },
          }
        },
        //Listando vacinação e vacina
        vaccination: {
          include: {
            vaccine: true,
          }
        },
      },
    });
    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email, telefone, latitude, longitude } = userSchema.parse(req.body);

    //Verificando se já não existe um usuário com o email cadastrado:
    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const existUserWithTelefone = await prisma.user.findUnique({
      where: {
        telefone: telefone,
      },
    });

    //Adicionando validação de existência de e-mail
    if (existUser) {
      return res.status(409).json({ error: "Existing user with this e-mail" });
    }

    //Adicionando validação de existência de telefone
    if (existUserWithTelefone) {
      return res.status(409).json({ error: "Existing user with this telefone" });
    } else {
      //Criptografando a senha do usuário:
      const salt = await bcryptjs.genSalt(15);
      const hashPassword = await bcryptjs.hash(password, salt);

      //Construindo o objeto usuário
      const createNewUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: name,
          password: hashPassword,
          email: email,
          telefone: telefone,
          latitude: latitude,
          longitude: longitude,
          image: "Image not registered", //Ainda não configurando o upload de arquivos
        },
      });

      //Retornando o usuário
      res.status(201).json(createNewUser);
    }
  } catch (error) {
    //Retornando erro caso haja
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
  
      return res.status(400).json({ error: 'Validation failed', errors: errorDetails });
    } else {
      console.error('Error retrieving users: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

//Requisção para criar um token para o usuário
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = authenticationSchema.parse(req.body);

    //Validando que o usuário realmente existe (Busca pelo o e-mail)
    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existUser) {
      return res.status(404).json({ error: "User does not exist" });
    } else {
      //Coferindo a senha passada com a senha salva no banco
      const checkPassword = await bcryptjs.compare(password, existUser?.password);

      if (!checkPassword) {
        return res.status(400).json({ error: "Invalid password" });
      } else {
        const secret = process.env.SECRET;
        //Método para confirmar que realmente o segredo do JWT existe
        if (!secret) {
          throw new Error("JWT secret is not defined");
        }

        const token = sign({ name: existUser.name }, secret, {
          expiresIn: "1d",
          subject: existUser.id,
        });

        res.status(200).json({ message: "Authentication successful", token, user: existUser });
      }
    }
  } catch (error) {
    //Retornando erro caso haja
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({ error: 'Validation failed', details: errorDetails });
    } else {
      // Retornar erro interno do servidor
      console.error("Error retrieving users: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

//Requisção para criar um token para o Administrador
export const authenticateAdmin = async (req: Request, res: Response) => {
  try {
    const { name, password, confirmPassword, email } = authenticationSchemaAdmin.parse(req.body);

    if (confirmPassword !== password) {
      return res.status(400).json({ error: "Check your password" });
    }

    //Validando que o usuário realmente existe (Busca pelo o e-mail)
    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existUser) {
      return res.status(404).json({ error: "User does not exist" });
    } else {
      //Coferindo a senha passada com a senha salva no banco
      const checkPassword = await bcryptjs.compare(password, existUser?.password);

      //Conferido o usuário que passou a senha (True se verdadeiro e False se falso)
      const compareName = existUser?.name === name;

      if (!checkPassword || !compareName) {
        return res.status(400).json({ error: "Invalid password or user" });
      } else {
        const secret = process.env.SECRET_ADMIN;
        //Método para confirmar que realmente o segredo do JWT existe
        if (!secret) {
          throw new Error("JWT secret is not defined");
        }

        const token = sign({ name: existUser.name }, secret, {
          expiresIn: "30d",
          subject: existUser.id,
        });

        res.status(200).json({ message: "Authentication successful", token });
      }
    }
  } catch (error) {
    //Retornando erro caso haja
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({ error: 'Validation failed', details: errorDetails });
    } else {
      // Retornar erro interno do servidor
      console.error("Error retrieving users: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

//Método de atualização do usuário (Possível método para atualizar)
export const editUser = async (req: Request, res: Response) => {
  try {
    const idUser = req.id_User; //Id vem do token
    const userData = userSchema.parse(req.body);
    const { name, password, email, telefone, latitude, longitude } = userData;

    //Procurando o usuário pelo o id
    const existUserWithId = await prisma.user.findUnique({
      where: {
        id: idUser,
      },
    });

    //Confirmando que o usuário existe
    if (!existUserWithId) {
      return res.status(404).json({ error: "Not existing user" });
    }

    //Criptografando a senha do usuário:
    const salt = await bcryptjs.genSalt(15);
    const hashPassword = await bcryptjs.hash(password, salt);

    //Validando email e telefone
    const userUpdate = await prisma.user.count({
      where:{
        email: email,
        password: password,
        id: { not: idUser}
      }
    });
    if (userUpdate > 0) {
      return res.status(409).json({ error: "E-mail or phone is already being used by another user" });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: idUser,
      },
      data: {
        name: name,
        password: hashPassword,
        email: email,
        telefone: telefone,
        latitude: latitude,
        longitude: longitude
      },
    });

    res.status(201).json({ message: "Updated User", updateUser });
  } catch (error) {
    //Retornando erro caso haja
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
  
      return res.status(400).json({ error: 'Validation failed', details: errorDetails });
    } else {
      console.error('Error retrieving users: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

//Requisiçõa para remover um usuário
export const removeUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    //Validando se o id é valido:
    if (!validate(userId)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    //Verificando se o usuário realmente existe
    const existUserId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existUserId) {
      return res.status(404).json({ error: "Not existing user" });
    } else {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return res.status(200).json({ message: "User removed" });
    }
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Requisição para o upload (criação e edição ) de arquivos de foto
export const uploadImage = async (req: Request, res: Response) => {
  try {
    const userId = req.id_User;
    //Pegando a imagem passada
    const requestImage = req.file as Express.Multer.File;

    //Validando que o usuário realmente existe 
    const existUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existUser) {
      return res.status(404).json({ error: "User does not exist" });
    } else {
      //Atualizando o usuário com a imagem
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          image: requestImage.filename,
        },
      });

      res.status(201).json({ massage: "Imagem adicionada" });
    }
  } catch (error) {
    //Retornando erro caso haja
    console.error("Error retrieving users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
