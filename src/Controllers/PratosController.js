const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");
const diskStorage = new DiskStorage();
class PratosController {
  async create(request, response) {
    try {
      const { name, category, value, description, ingredientes } = request.body;
      const image = request.file.filename;
      const user_id = request.user.id;

      const user = await knex("users").where({ id: user_id }).first();

      if (!user) {
        throw new AppError("Usuário inválido");
      }

      if (user.role !== "admin") {
        throw new AppError("Você não possui permissão");
      }
      const formatValue = parseFloat(value.replace(",", ".")).toFixed(2);

      if (isNaN(formatValue)) {
        throw new AppError("Digite um valor válido");
      }

      const imageUrl = await diskStorage.saveFile(image);

      const [prato_id] = await knex("pratos").insert({
        user_id,
        name,
        value: formatValue,
        description,
        category,
        imageUrl,
      });
      let ingredientesArray = [];

      if (typeof ingredientes === "string") {
        ingredientesArray = ingredientes.split(",").map((name) => ({
          prato_id,
          name: name.trim(),
        }));
      } else if (Array.isArray(ingredientes)) {
        ingredientesArray = ingredientes.map((name) => ({
          prato_id,
          name: name.trim(),
        }));
      } else {
        throw new AppError("Formato de ingredientes inválido");
      }

      await knex("ingredientes").insert(ingredientesArray);

      response.status(201).json("Prato criado com sucesso");
    } catch (error) {
      console.error(error.message);

      if (error instanceof AppError) {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async show(request, response) {
    const { id } = request.params;

    const prato = await knex("pratos").where({ id }).first();
    console.log(prato);
    if (!prato) {
      throw new AppError("Prato não encontrada");
    } else {
      const ingredientes = await knex("ingredientes")
        .where({ prato_id: id })
        .orderBy("name");

      return response.json({ ...prato, ingredientes });
    }
  }
  async index(request, response) {
    const { name } = request.query;

    let pratos;
    pratos = await knex("pratos")
      .whereLike("name", `%${name}%`)
      .orderBy("name");

    return response.json({ pratos });
  }

  async update(request, response) {
    const { name, category, value, description, ingredientes } = request.body;
    const image = request.file ? request.file.filename : null;
    const { prato_id } = request.params;

    const prato = await knex("pratos").where({ id: prato_id }).first();
    if (!prato) {
      return response.status(404).json({ message: "Prato não encontrado" });
    }

    if (image) {
      await diskStorage.deleteFile(prato.imageUrl);
      const imageUrl = await diskStorage.saveFile(image);
      prato.imageUrl = imageUrl;
    }

    if (ingredientes) {
      await knex("ingredientes").where({ prato_id }).delete();
      const ingredientesArray = ingredientes
        .split(",")
        .map((ingrediente) => ingrediente.trim());
      const ingredientesInsert = ingredientesArray.map((name) => ({
        prato_id,
        name,
      }));
      await knex("ingredientes").insert(ingredientesInsert);
    }

    if (name) prato.name = name;
    if (value) prato.value = value;
    if (description) prato.description = description;
    if (category) prato.category = category;

    await knex("pratos").update(prato).where({ id: prato_id });

    return response
      .status(200)
      .json({ message: "Prato atualizado com sucesso" });
  }
  async delete(request, response) {
    const { id } = request.params;

    await knex("pratos").where({ id }).first().delete();
    response.status(200).json("Nota excluida com êxito");
  }
}

module.exports = PratosController;
