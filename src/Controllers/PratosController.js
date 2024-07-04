const knex = require("../database/knex");
const { use } = require("../routes");
const AppError = require("../utils/AppError");

class PratosController {
  async create(request, response) {
    const { name, value, imageUrl, description, ingredientes } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();
    if (!user) {
      throw new AppError("usuário invalido");
    }

    if (user.role !== "admin") {
      throw new AppError("Você não possui permissão");
    }

    if (isNaN(value)) {
      throw new AppError("Digite um valor valído");
    }

    const formatValue = (value) => {
      return parseFloat(value.replace(",", ".")).toFixed(2);
    };

    const prato = {
      user_id,
      name,
      value: formatValue(value),
      imageUrl,
      description,
    };

    await knex("pratos").insert(prato);

    if (ingredientes) {
    }
    response.status(201).json("Prato criado com sucesso");
  }
}

module.exports = PratosController;
