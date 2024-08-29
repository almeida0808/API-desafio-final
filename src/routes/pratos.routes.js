const { Router } = require("express");
const pratosRoutes = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const PratosController = require("../Controllers/PratosController");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const pratosController = new PratosController();

const upload = multer(uploadConfig.MULTER);

pratosRoutes.post(
  "/",
  verifyUserAuthorization("admin"),
  upload.single("image"),
  pratosController.create
);
pratosRoutes.get("/:id", pratosController.show);
pratosRoutes.put(
  "/:prato_id",
  verifyUserAuthorization("admin"),
  upload.single("image"),
  pratosController.update
);

pratosRoutes.delete(
  "/:id",
  verifyUserAuthorization("admin"),
  pratosController.delete
);
pratosRoutes.get("/", pratosController.index);
pratosRoutes.patch("/img-food", upload.single("image"), (req, res) => {
  console.log(req.file.filename);
  res.json(req.file.filename);
});

module.exports = pratosRoutes;
