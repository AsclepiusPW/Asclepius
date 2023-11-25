import express from 'express';
import { userRoutes } from './routes/userRoutes';

//Configurações iniciais
const app = express();
app.use(express.json());

//Rotas de usuário
app.use("/user", userRoutes);

//Inicializando a API
app.listen(5000, ()=>{
    console.log("Server is running in port 5000");
});