import express from "express";
import { userRoutes } from "./routes/userRoutes";
import { vaccinesRoutes } from "./routes/vaccinesRoutes";

//Configurações iniciais
const app = express();
app.use(express.json());

//Rotas de usuário
app.use("/user", userRoutes);

//Rotas de vacinas
app.use("/vaccine", vaccinesRoutes);

//Exportando o app configurado
export default app;
