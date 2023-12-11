
# **Asclepius**

O **Asclepius** é uma API em constante desenvolvimento que se destina a desempenhar um papel fundamental no âmbito dos registros eletrônicos de vacinas. Configurando-se como uma solução especializada, o **Asclepius** atua como uma API dedicada ao gerenciamento eficiente de vacinação eletrônica. Concebida e criada com o propósito de servir como um projeto avaliativo para a disciplina **"Programação para Web I"** no curso de **Análise e Desenvolvimento de Sistemas (ADS)**, esta API aborda e aplica conceitos cruciais, incluindo autenticação de usuários, upload de arquivos e administração de um banco de dados, visando a implementação de um sistema WEB robusto e funcional.

## Tecnologias e Ferramentas Utilizadas

- [**Prisma:**](https://www.prisma.io/) ORM (Object-Relational Mapping) utilizado para interagir com o banco de dados relacional SQLite.

- [**Node.js**](https://nodejs.org/) **com** [**TypeScript**](https://www.typescriptlang.org/) - Back-End construído utilizando Node.js e TypeScript para garantir segurança e clareza no desenvolvimento.

- [**Express:**](https://expressjs.com/) Framework web utilizado para a construção do Controller, gerenciando requisições e respostas.

- [**JsonWebToken:**](https://jwt.io/) - Biblioteca para implementação de autenticação via JSON Web Tokens (JWT).

- [**Multer:**](https://www.npmjs.com/package/multer) - Middleware para tratamento de uploads de arquivos, utilizado para o upload de fotos de perfil.

- [**SQLite:**](https://www.sqlite.org/) Banco de dados relacional escolhido pela sua facilidade de integração e manuseio eficaz.

- [**Zod:**](https://github.com/colinhacks/zod) - Biblioteca para validação de dados em TypeScript, contribuindo para a segurança e integridade dos dados na aplicação.

## Schema Banco de Dados

O esquema do banco compreende um total de cinco tabelas: *User, Vaccine, Vaccination, VaccinationCalendar e RequestReservation*. Destas cinco tabelas, três são consideradas entidades, enquanto as duas restantes são o resultado de relacionamentos muitos para muitos entre essas entidades. Dessa forma, as três entidades fundamentais são: *User, Vaccine e VaccinationCalendar*.

A entidade *User* representa tanto o usuário final do sistema quanto o administrador, dado que ambos possuem funções praticamente idênticas. Além de pertencer ao domínio de relacionamento com outras entidades, essa entidade incorpora o conceito de autenticação gerada por JWT, regendo todo o acesso por meio de tokens. Adicionalmente, há um atributo para o upload de arquivos de foto nos formatos JPEG, JPG e PNG, destinados a representar visualmente o usuário no frontend do sistema. A entidade também incorpora um atributo para armazenar a geolocalização do usuário, registrando assim sua posição geográfica.

A entidade *Vaccine* é responsável por manter informações acerca das vacinas cadastradas no sistema, abrangendo atributos que definem as propriedades de cada vacina.

Já a entidade *VaccinationCalendar* estabelece relacionamento com a entidade Vacina e representa informações relativas a eventos de vacinação, incluindo datas e locais de realização.

Por fim, as entidades de relacionamento, a *RequestReservation e Vaccination*, desempenham o papel de conectar o usuário às demais entidades do sistema. A *RequestReservation* permite que o usuário solicite uma reserva para eventos marcados no calendário do sistema, enquanto a entidade *Vaccination* registra todas as vacinas já recebidas pelo usuário, juntamente com o período e a quantidade correspondente. Este arranjo estrutural oferece uma representação formal e elucidativa do desenvolvimento teórico do banco de dados, delineando de maneira clara os relacionamentos entre as entidades.

## Estrutura dos diretórios

```bash
├── prisma/
│ └── schema.prisma
├── src/
│ ├── tests/
| │   | ├── unitTest/
| │   | ├── integrationTest/
│ ├── @types/
| │   | ├── express.d.ts
│ ├── config/
| │   | ├── multer.ts
│ ├── controllers/
| │   | ├── userControllers.ts
| │   | ├── vaccineControllers.ts
| │   | ├── calendarVaccinationControllers.ts
| │   | ├── vaccinationControllers.ts
| │   | ├── requestReservationControllers.ts
│ ├── utils/
| │   | ├── validateUser.ts
| │   | ├── validateVaccine.ts
| │   | ├── validateCalendarVaccination.ts
│ ├── database/
| │   | ├── data.sqlite
│ ├── middleware/
| │   | ├── verifyToken.ts
| │   | ├── verifyImageUser.ts
| │   | ├── verifyTokenAdmin.ts
│ ├── prismaClient/
| │   | ├── prismaClient.ts
│ ├── routes/
| │   | ├── userRoutes.ts
| │   | ├── vaccineRoutes.ts
| │   | ├── calendarVaccinationRoutes.ts
| │   | ├── vaccinationRoutes.ts
| │   | ├── requestReservationRoutes.ts
│ ├── app.ts
│ └── server.ts
├── uploads/
├── .gitignore
├── .env
├── package.json
├── package-lock.json
├── tsconfig.json
├── test.config.ts
```

## Funcionalidades

O Asclepius apresenta-se como uma API altamente configurável, uma vez que cada entidade incorpora métodos CRUD (Create, Reload, Update e Delete). A seguir, estão detalhadas as rotas correspondentes a cada entidade, juntamente com suas respectivas especificações.

### User:

1. **GET:** ("/user/"): Requesição que lista todos os usuários;
2. **GET:** ("/user/:id"): RequestReservation para listar as informações de um único usuário;
3. **POST:** ("/user"): Requesição para criar um usuário;
4. **POST:** ("/user/authentication"): Requesição para autenticar um usuário;
5. **PUT:** ("/user/update"): Requesição para editar somente informações escritas do usuário;
6. **PATCH:** ("/user/upload"): Requesição para adicionar ou editar um foto do usuário;
7. **DELETE:** ("/user/remove/:id"): Requesição para remover um usuário. 

### Vaccines:

1. **GET:** ("/vaccine/"): Requesição para listar todas as vacinas cadastradas no sistema.
2. **GET:** ("/vaccine/:id"): Requisição para listar as informações de uma vaccina;
3. **POST:** ("/vaccine/"): Requesição para adicionar uma nova vacina ao sistema.
4. **PATCH:** ("/update/:id"): Requisição para editar as informações de uma vacina;
5. **DELETE:** ("/remove/:id): Requesição para remover uma vacina.

### CalendarVaccination:

1. **GET:** ("/event/"): Requesição para listar todos os eventos de calendário;
2. **GET:** ("/event/:id"): Requesição para listar as informações de uma único evento de um calendário de vacinas;
3. **POST:** ("/event/"): Requisição para adicionar um novo evento ao calendário de vacinação;
4. **PUT:** ("/event/update/:id"): Requisição para editar as informações de um evento;
5. **DELETE:** ("/event/remove/:id"): Requisição para remover um evento do calendário.

### Vaccination

1. **GET:** ("/register/"): Requesição para listar todos as vacinaçôes de um usuário;
2. **POST:** ("/register/"): Requisição para adicionar um novo cadastro de vacinação a um usuário;
3. **PUT:** ("/register/update/:id"): Requisição para editar as informações de uma vacinação;
4. **DELETE:** ("/resgister/remove/:id"): Requisição para remover uma vacinação da lista de vacinações de um usuário.

### RequestReservation

1. **GET:** ("/reservation/"): Requesição para listar todos as solicitações de reserva de um usuário;
2. **POST:** ("/reservation/"): Requisição para adicionar uma nova solicitação de reserva de um usuário;
3. **PUT:** ("/reservation/update/:id"): Requisição para editar as informações de uma solicitação de reserva;
4. **DELETE:** ("/reservation/remove/:id"): Requisição para remover uma solicitação de reserva da lista de solicitações de um usuário.

## Configurações de uso

1. Clone o repositório:
```bash
git clone https://github.com/AsclepiusPW/Asclepius.git
```
2. Navegue até o diretório do projeto:
```bash
cd Asclepius
```

3. Instale as dependências:
```bash
npm install
#ou
yarn
```
4. Configure o banco de dados SQLite, (ou qualquer outro que preferir) e adicione um arquivo **.env** à raiz do diretório:
```bash
DATABASE_URL="yourFile:./dev.db"
DATABASE_URL="yourFile:./test.db" #(Banco para testes)
SECRET= yourSecretKey #(Key usado para criar e validar um token usuário)
SECRET= yourSecretKeyAdmin #(Key usado para criar e validar token de Administrador)
```
5. Instancie o Banco de Dados:
```bash
npx prisma db push
```
Ou se você não tem Prisma CLI instalado globalmente:

```bash
npx prisma migrate dev
```
6. Execute o servidor:
```bash
npm run dev
```
O servidor estara disponível em http://localhost:API_PORT

## Observações

- **Autenticação Obrigatória:**
  - Todas as rotas, exceto as relacionadas à listagem de vacinas e eventos do calendário, requerem autenticação via token. Certifique-se de estar corretamente logado no sistema antes de acessar essas rotas.

- **Middleware de Verificação de Imagem:**
  - Cada chamada para editar ou adicionar uma foto a um usuário passa por um Middleware de verificação de imagem. Se o usuário já tiver uma foto cadastrada, ela será removida do diretório local antes de adicionar a nova imagem.

- **Armazenamento Local de Fotos:**
  - Todas as fotos dos usuários são armazenadas localmente no diretório chamado "Uploads". Certifique-se de considerar o armazenamento desses arquivos ao fazer backup ou mover o sistema.

- **Arquivos de Testes Desatualizados:**
  - Os arquivos de teste localizados na pasta "__tests__" estão desatualizados em relação à versão atual do sistema. Eles foram usados nas fases iniciais da construção do sistema e podem não refletir totalmente as funcionalidades atuais. Recomendamos revisar e atualizar esses testes conforme necessário.

- **Contribuições Bem-Vindas:**
  - Encorajamos contribuições para aprimorar e expandir o sistema. Se você identificar melhorias, correções ou novos recursos, sinta-se à vontade para abrir issues ou enviar pull requests. Estamos abertos a colaborações e agradecemos o interesse em contribuir para o projeto.

## Desenvolvedores

### Douglas Silva
- [GitHub](https://github.com/7-Dodi)
- Papel: Backend
- Resumo: Douglas Silva desempenhou um papel crucial no desenvolvimento e manutenção do lado do servidor, garantindo a eficiência e segurança das operações no backend. Sua experiência foi vital para a integração bem-sucedida de serviços e manipulação de dados.

### Jose Gabriel
- [GitHub](https://github.com/J-Gabriel-F-D)
- Papel: Backend
- Resumo: Jose Gabriel contribuiu significativamente para o desenvolvimento e aprimoramento do backend, assegurando a estabilidade e confiabilidade das operações do sistema. Seu conhecimento em backend foi essencial para a infraestrutura robusta do projeto.

### Marcos Paulo
- [GitHub](https://github.com/KingZabitus)
- Papel: Backend
- Resumo: Marcos Paulo desempenhou um papel crucial no desenvolvimento do backend, contribuindo para a arquitetura e implementação de funcionalidades essenciais. Sua atuação abrangente no lado do servidor foi fundamental para o sucesso do projeto.

Agradecemos a todos os desenvolvedores por suas valiosas contribuições para o backend do projeto Asclepius. Se você tiver dúvidas, sugestões ou deseja colaborar, sinta-se à vontade para entrar em contato com a equipe de desenvolvimento.

## Conclusão

O Projeto Asclepius foi concebido como uma iniciativa fictícia para explorar conceitos fundamentais na disciplina de Programação para Web I. Embora seja um projeto acadêmico, aspiramos que ele tenha proporcionado uma compreensão prática e valiosa do desenvolvimento de uma API de gerenciamento eletrônico de registros de vacinação.

Agradecemos a todos os envolvidos neste projeto fictício e reconhecemos o esforço dedicado. Este é um passo significativo na jornada de aprendizado, e esperamos que tenha sido uma experiência enriquecedora.

Para mais informações ou para compartilhar feedback, sinta-se à vontade para explorar a [página no GitHub](https://github.com/AsclepiusPW/Asclepius.git) ou abrir uma [issue](https://github.com/AsclepiusPW/Asclepius.git/issues). Este projeto serve como um exemplo acadêmico e é encerrado como parte do processo de avaliação.

Obrigado por participar do Projeto Asclepius!
