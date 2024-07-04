const { Router } = require("express");
const usersRoutes = Router();

const UsersController = require("../Controllers/UsersController/UsersController");
const usersController = new UsersController();

usersRoutes.post("/", usersController.create); // quando acessar a raiz do /users e fizer uma requisição no metodo post, ele vai realizar a função que for colocado depois da virgula(ainda não criamos a função)
usersRoutes.put("/:user_id", usersController.update);

module.exports = usersRoutes;
