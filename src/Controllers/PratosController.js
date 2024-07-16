const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage"); // Importe a classe DiskStorage aqui

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

      const formatValue = parseFloat(value.replace(",", "."));
      if (isNaN(formatValue)) {
        throw new AppError("Digite um valor válido");
      }

      // Verifique se há um arquivo enviado
      if (!request.file) {
        throw new AppError("Por favor, envie uma imagem");
      }

      // Salvar a imagem no DiskStorage
      const diskStorage = new DiskStorage();
      const imageUrl = await diskStorage.saveFile(image);

      // Inserir o prato no banco de dados com a URL da imagem
      const [prato_id] = await knex("pratos").insert({
        user_id,
        name,
        value: formatValue.toFixed(2),
        description,
        category,
        imageUrl, // Usando a URL da imagem aqui
      });

      // Tratar os ingredientes
      const ingredientesArray = ingredientes.split(",").map((name) => ({
        prato_id,
        name: name.trim(),
      }));

      await knex("ingredientes").insert(ingredientesArray);

      response.status(201).json("Prato criado com sucesso");
    } catch (error) {
      console.error(error);

      // Se o erro for uma instância de AppError, envie a mensagem do erro com o status apropriado
      if (error instanceof AppError) {
        return response.status(400).json({ message: error.message });
      }

      // Caso contrário, envie um erro interno do servidor
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
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
    const { name } = request.query;
    const user_id = request.user.id;

    const pratos = await knex("pratos").where({ name }).orderBy("name");

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
