const { Router } = require("express");
const pratosRoutes = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const PratosController = require("../Controllers/PratosController");
const pratosController = new PratosController();

const upload = multer(uploadConfig.MULTER);

pratosRoutes.post("/:user_id", pratosController.create); // quando acessar a raiz do /users e fizer uma requisição no metodo post, ele vai realizar a função que for colocado depois da virgula(ainda não criamos a função)
pratosRoutes.get("/:id", pratosController.show);
pratosRoutes.put("/:prato_id", pratosController.update);
pratosRoutes.delete("/:id", pratosController.delete);
pratosRoutes.get("/", pratosController.index);
pratosRoutes.patch("/img-food", upload.single("img-food"), (req, res) => {
  console.log(req.file.filename);
  res.json(req.file.filename);
});

module.exports = pratosRoutes;
