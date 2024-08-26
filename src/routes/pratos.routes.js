const { Router } = require("express");
const pratosRoutes = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const PratosController = require("../Controllers/PratosController");
const pratosController = new PratosController();

const upload = multer(uploadConfig.MULTER);

pratosRoutes.post("/", upload.single("image"), pratosController.create);
pratosRoutes.get("/:id", pratosController.show);
pratosRoutes.put("/:prato_id", upload.single("image"), pratosController.update);
pratosRoutes.delete("/:id", pratosController.delete);
pratosRoutes.get("/", pratosController.index);
pratosRoutes.patch("/img-food", upload.single("image"), (req, res) => {
  console.log(req.file.filename);
  res.json(req.file.filename);
});

module.exports = pratosRoutes;
