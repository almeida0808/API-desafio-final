const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage"); // Importe a classe DiskStorage aqui
const diskStorage = new DiskStorage(); // instancia DiskStorage

class PratosController {
  async create(request, response) {
    try {
      const { name, category, value, description, ingredientes } = request.body; // pega os dados de
      const image = request.file.filename;
      const user_id = request.user.id;

      const user = await knex("users").where({ id: user_id }).first();

      if (!user) {
        throw new AppError("Usuário inválido");
      }

      if (user.role !== "admin") {
        // se o usuário não for adm:
        throw new AppError("Você não possui permissão");
      }
      // Processamento do valor
      const formatValue = parseFloat(value.replace(",", ".")).toFixed(2);

      // Verifica se o valor convertido é um número válido
      if (isNaN(formatValue)) {
        throw new AppError("Digite um valor válido");
      }

      const imageUrl = await diskStorage.saveFile(image); // salva a foto e guarda o nome do arquivo na const imageUrl

      const [prato_id] = await knex("pratos").insert({
        // Inseri todos os dados no database , e guarda o id do prato nessa const
        user_id,
        name,
        value: formatValue,
        description,
        category,
        imageUrl,
      });
      let ingredientesArray = [];

      if (typeof ingredientes === "string") {
        // Supondo que a string é uma lista de ingredientes separados por vírgulas
        ingredientesArray = ingredientes.split(",").map((name) => ({
          prato_id,
          name: name.trim(), // Remove espaços extras
        }));
      } else if (Array.isArray(ingredientes)) {
        // Se for um array, mapeia os ingredientes como objetos
        ingredientesArray = ingredientes.map((name) => ({
          prato_id,
          name: name.trim(), // Remove espaços extras
        }));
      } else {
        throw new AppError("Formato de ingredientes inválido");
      }

      // Insere cada ingrediente na tabela "ingredientes"
      await knex("ingredientes").insert(ingredientesArray);

      response.status(201).json("Prato criado com sucesso");
    } catch (error) {
      // caso de algum ero ele cai aqui
      console.error(error.message);

      if (error instanceof AppError) {
        // se for um erro do lado do cliente
        return response.status(400).json({ message: error.message });
      }

      // Caso contrário, envie um erro interno do servidor
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
    const { name, ingredientes } = request.query;

    let pratos;
    pratos = await knex("pratos")
      .whereLike("name", `%${name}%`)
      .orderBy("name");

    // pratos = await knex("pratos")
    //   .select([
    //     "pratos.name",
    //     "pratos.value",
    //     "pratos.category",
    //     "pratos.imageUrl",
    //     "pratos.description",
    //   ])
    //   .whereLike("pratos.name", `%${name}%`);

    // if (ingredientes) {
    //   const filterIngredientes = ingredientes
    //     .split(",")
    //     .map((ingrediente) => ingrediente.trim());

    //   pratos = await knex("ingredients")
    //     .select([
    //       "pratos.name",
    //       "pratos.value",
    //       "pratos.category",
    //       "pratos.imageUrl",
    //       "pratos.description",
    //     ])
    //     .whereLike("pratos.name", `%${name}%`)
    // .whereIn("name", filterIngredientes)
    //     .innerJoin("pratos", "pratos.id", "ingredientes.prato_id")
    //     .orderBy("name");
    // } else {
    //   pratos = (await knex("pratos"))
    //     .whereLike("name", `%${name}%`)
    //     .orderBy("name");
    // }

    return response.json({ pratos });
  }

  async update(request, response) {
    const { name, category, value, description, ingredientes } = request.body; // pega os dados de texto pelo body normal
    const image = request.file.filename; // pega a imagem
    const { prato_id } = request.params;

    const prato = await knex("pratos").where({ id: prato_id }).first(); // busca o prato que esta sendo editado

    if (image) {
      await diskStorage.deleteFile(prato.imageUrl); // exclua a antiga imagem

      const imageUrl = await diskStorage.saveFile(image); // salva a imagem nos arquivos e guarda o nome do arquivo na const imageUrl

      prato.imageUrl = imageUrl; // troca o nome da imagem no banco de dados
    }

    if (ingredientes) {
      await knex("ingredientes").where({ prato_id }).delete(); // deleta os ingredientes antigos

      const ingredientes = "vazo, leite,peira";

      const ingredientesArray = ingredientes // pela requisição os itens vem assim: vazo, leite, peira
        .split(",") // transforma em ["vazo", " leite", "peira"]
        .map((ingrediente) => ingrediente.trim()); // remove os espaços: ["vazo", "leite", "peira"]

      const ingredientesInsert = ingredientesArray.map((name) => {
        return {
          prato_id,
          name: name.trim(),
        };
      });

      await knex("ingredientes").insert(ingredientesInsert).where({ prato_id });
    }

    if (name) {
      prato.name = name;
    }
    if (value) {
      prato.value = value;
    }
    if (description) {
      prato.description = description;
    }

    if (category) {
      prato.category = category;
    }

    console.log("PRato noovo", { prato });

    await knex("pratos").update(prato).where({ id: prato_id });
    return response.status(201).json(`Prato atualizado`);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("pratos").where({ id }).first().delete();
    response.status(200).json("Nota excluida com êxito");
  }
}

module.exports = PratosController;
