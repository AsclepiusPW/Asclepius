import express from 'express';
const app = express();
app.use(express.json());

//Teste inicial (Depois atualizar)
app.listen(3000, ()=>{
    console.log("Server is running in port 3000");
});