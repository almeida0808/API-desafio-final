const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class PratosController {
  async create(request, response) {
    const { name, value, imageUrl, description, ingredientes, category } =
      request.body;
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
    const [prato_id] = await knex("pratos").insert({
      user_id,
      name,
      value: formatValue(value),
      imageUrl,
      description,
      category,
    });

    const ingredientesInsert = ingredientes.map((name) => {
      return {
        prato_id,
        name,
      };
    });

    await knex("ingredientes").insert(ingredientesInsert);

    response.status(201).json("Prato criado com sucesso");
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("pratos").where({ id }).first();

    if (!note) {
      throw new AppError("Prato não encontrada");
    } else {
      const ingredientes = await knex("ingredientes")
        .where({ prato_id: id })
        .orderBy("name");

      return response.json({ ...note, ingredientes });
    }
  }

  async index(request, response) {
    const { category } = request.query;

    const pratos = await knex("pratos").orderBy("name");

    return response.json({ pratos });
  }

  async update(request, response) {
    const { name, value, imageUrl, description, ingredientes, category } =
      request.body;

    const { prato_id } = request.params;
    const prato = await knex("pratos").where({ id: prato_id }).first();
    console.log({ prato, name });

    if (prato) {
      if (name) {
        prato.name = name;
      }
      if (description) {
        prato.description = description;
      }
      if (value) {
        const formatValue = (value) => {
          return parseFloat(value.replace(",", ".")).toFixed(2);
        };
        prato.value = formatValue(value);
      }
      if (imageUrl) {
        prato.imageUrl = imageUrl;
      }
      if (category) {
        prato.category = category;
      }
      if (ingredientes) {
        const ingredientesInsert = ingredientes.map((name) => {
          return {
            prato_id,
            name,
          };
        });

        await knex("ingredientes").update(ingredientesInsert).where({
          id: prato_id,
        });
      }
      await knex("pratos").update(prato).where({ id: prato_id });
      response.status(201).json(`Prato atualizado`);
    } else {
      throw new AppError("Não foi possivel encontrar este prato");
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("pratos").where({ id }).first().delete();
    response.status(200).json("Nota excluida com êxito");
  }
}

module.exports = PratosController;
