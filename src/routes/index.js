const usersRoutes = require("./users.routes"); // imprta as rotas do /users
const { Router } = require("express");
const routes = Router();

routes.use("/users", usersRoutes); // quando entrar na rota /users ele ja entra no arquivo e verifica qual metodo na rota users que foi solicitado,e realizaa a função correspondente

module.exports = routes;