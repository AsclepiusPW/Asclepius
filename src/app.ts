import express from "express";
import { userRoutes } from "./routes/userRoutes";

//Configurações iniciais
const app = express();
app.use(express.json());

//Rotas de usuário
app.use("/user", userRoutes);

//Exportando o app configurado
export default app;
