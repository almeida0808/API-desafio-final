const pratosRoutes = require("./pratos.routes");
const usersRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const { Router } = require("express");
const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/pratos", ensureAuthenticated, pratosRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;
