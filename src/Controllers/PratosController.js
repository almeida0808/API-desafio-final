const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage"); // Importe a classe DiskStorage aqui
const diskStorage = new DiskStorage(); // instancia DiskStorage

class PratosController {
  async create(request, response) {
    try {
      // dentro do insomnia nos fazmos uma requisição usando o metodo multpart no body
      const { name, category, value, description, ingredientes } = request.body; // pega os dados de texto pelo body normal
      const image = request.file.filename; // quando vc vai pegar um arquivo de uma requisição , vc sempre vai digitar request.file.nomeDoCampo nesse caso o nome do campo é filename

      const user_id = request.user.id; // pega o id do usuário

      const user = await knex("users").where({ id: user_id }).first(); // busca pelo usuário pelo id

      if (!user) {
        throw new AppError("Usuário inválido");
      }

      if (user.role !== "admin") {
        // se o usuário não for adm:
        throw new AppError("Você não possui permissão");
      }

      const formatValue = parseFloat(value.replace(",", ".")); // caso o usuário passe um valor usando , ele substitui pra .

      if (isNaN(formatValue)) {
        // se o valor formatado n for do tipo Number, retorna esse erro
        throw new AppError("Digite um valor válido");
      }

      // Verifique se há um arquivo enviado
      if (!request.file) {
        throw new AppError("Por favor, adicione uma imagem");
      }

      const imageUrl = await diskStorage.saveFile(image); // salva a foto e guarda o nome do arquivo na const imageUrl

      const [prato_id] = await knex("pratos").insert({
        // Inseri todos os dados no database , e guarda o id do prato nessa const
        user_id,
        name,
        value: formatValue.toFixed(2),
        description,
        category,
        imageUrl, // Usando a URL da imagem aqui
      });

      // na requisição os ingredientes vem da seguinte maneira = "alho, sal, pimenta" ele basicamente cria um array separando cada ingrediente usando a virgula como parametro e então faz um map criando um objeto que contenha o id do prato e o nome pra cada ingrediente
      const ingredientesArray = ingredientes.split(",").map((name) => ({
        prato_id,
        name: name.trim(),
      }));

      await knex("ingredientes").insert(ingredientesArray); // inseri os cada ingrediente dentro tabela de ingredientes

      response.status(201).json("Prato criado com sucesso");
    } catch (error) {
      // caso de algum ero ele cai aqui
      console.error(error);

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
    const { name, category, value, description, ingredientes } = request.body; // pega os dados de texto pelo body normal

    const image = request.file.filename;
    const { prato_id } = request.params;
    const prato = await knex("pratos").where({ id: prato_id }).first();
    console.log({ prato, name, image });
    if (image) {
      if (prato.imageUrl) {
        await diskStorage.deleteFile(prato.imageUrl);
      }
      const imageUrl = diskStorage.saveFile(image);

      prato.imageUrl = imageUrl;
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
    if (ingredientes) {
      const ingredientesInsert = ingredientes.split(",").map((name) => {
        return {
          prato_id,
          name: name.trim(),
        };
      });

      await knex("ingredientes").update(ingredientesInsert).where({
        id: prato_id,
      });
    }
    if (category) {
      prato.category = category;
    }

    await knex("pratos").update(prato).where({ id: prato_id });
    response.status(201).json(`Prato atualizado`);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("pratos").where({ id }).first().delete();
    response.status(200).json("Nota excluida com êxito");
  }
}

module.exports = PratosController;
