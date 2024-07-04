const { Router } = require("express");
const pratosRoutes = Router();

const PratosController = require("../Controllers/PratosController");
const pratosController = new PratosController();

pratosRoutes.post("/:user_id", pratosController.create); // quando acessar a raiz do /users e fizer uma requisição no metodo post, ele vai realizar a função que for colocado depois da virgula(ainda não criamos a função)

module.exports = pratosRoutes;
