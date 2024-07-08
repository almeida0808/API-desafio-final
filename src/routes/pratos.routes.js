const { Router } = require("express");
const pratosRoutes = Router();

const PratosController = require("../Controllers/PratosController");
const pratosController = new PratosController();

pratosRoutes.post("/:user_id", pratosController.create); // quando acessar a raiz do /users e fizer uma requisição no metodo post, ele vai realizar a função que for colocado depois da virgula(ainda não criamos a função)
pratosRoutes.get("/:id", pratosController.show);
pratosRoutes.put("/:prato_id", pratosController.update);
pratosRoutes.delete("/:id", pratosController.delete);
pratosRoutes.get("/", pratosController.index);

module.exports = pratosRoutes;
