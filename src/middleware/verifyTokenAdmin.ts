import { Request, Response, NextFunction } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

export async function verifyTokenAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Restricted access - Token missing" });
    }

    try {
        // Primeira verificação com SECRET_ADMIN
        const adminSecret = process.env.SECRET_ADMIN;
        if (adminSecret) {
            const decodedAdminToken = verify(token, adminSecret);
            // Se desejar, você pode acessar as informações do token decodificado usando decodedAdminToken
            next();
            return;
        } else {
            throw new Error('JWT admin secret is not defined');
        }
    } catch (adminError) {
        console.error(adminError);

        try {
            // Segunda verificação com SECRET
            const userSecret = process.env.SECRET;
            if (userSecret) {
                const decodedUserToken = verify(token, userSecret);
                // Se desejar, você pode acessar as informações do token decodificado usando decodedUserToken
                return res.status(401).json({ message: "Restricted access - Admin only" });
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
}