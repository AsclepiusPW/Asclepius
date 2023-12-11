import { Request, Response, NextFunction } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

interface IPayload{
    sub: string,
    exp: number,
    name: string
}

export async function verifyToken(req:Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({message: "Restricted access"});
    }

    try {
        const secret = process.env.SECRET;
        if(!secret){
            throw new Error('JWT secret is not defined');
        }

        let {name, sub} = verify(token, secret) as IPayload;

        req.id_User = sub;
    } catch (error) {
        console.error(error);

        try {
            // Segunda verificação com SECRET
            const userSecret = process.env.SECRET_ADMIN;
            if (userSecret) {
                const decodedUserToken = verify(token, userSecret);
                // Se desejar, você pode acessar as informações do token decodificado usando decodedUserToken
                return res.status(401).json({ message: "Restricted access - User only" });
            } else {
                throw new Error('JWT secret is not defined');
            }
        } catch (userError) {
            console.error(userError);

            if (userError instanceof TokenExpiredError) {
                return res.status(401).json({ message: "Token expired" });
            }

            return res.status(401).json({ message: "Invalid token" });
        }
    }
    next();
}