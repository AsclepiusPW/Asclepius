import express from "express";
import path from "path";
import { userRoutes } from "./routes/userRoutes";
import { vaccinesRoutes } from "./routes/vaccinesRoutes";

//Configurações iniciais
const app = express();
app.use(express.json());

//Rotas de usuário
app.use("/user", userRoutes);

//Rotas de vacinas
app.use("/vaccine", vaccinesRoutes);

//Configurando rota para upload de arquivo
app.use("/images", express.static(path.join(__dirname, "..", "uploads")));

//Exportando o app configurado
export default app;
