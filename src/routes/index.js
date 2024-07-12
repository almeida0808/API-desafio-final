const pratosRoutes = require("./pratos.routes");
const usersRoutes = require("./users.routes"); // imprta as rotas do /users
const sessionsRoutes = require("./sessions.routes");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const { Router } = require("express");
const routes = Router();

routes.use("/users", usersRoutes); // quando entrar na rota /users ele ja entra no arquivo e verifica qual metodo na rota users que foi solicitado,e realizaa a função correspondente
routes.use("/pratos", ensureAuthenticated, pratosRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;
