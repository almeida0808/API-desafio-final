const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    // função assincrona
    const { name, email, password } = request.body; // pega os dados do request.body

    if (!email || !name || !password) {
      // todas informações tem que ser preenchidas se não vai dar erro
      throw new AppError("Preencha todas informações");
    }

    if (password.lenght < 8) {
      // a senha tem que ter 8 caracteres
      throw new AppError("A senha deve ter no mínimo 8 caracteres");
    }

    const checkUserExists = await knex("users").where({ email }).first(); // pesquisa na tabela de usuários o email que foi informado no request body, e se caso existir ele retorna true

    if (checkUserExists) {
      // caso o email exista retorna esse erro
      throw new AppError("Este email já está em uso");
    }

    const hashedPassword = await hash(password, 8); // faz uma cryptografia na senha que foi informado (usando a biblioteca bcrypts)

    await knex("users").insert({ name, email, password: hashedPassword }); // inseri na tabela de usuário os dados recebidos

    response.status(201).json("Usuário criado com sucesso"); // caso de certo retorna uma mensagem que o user foi criado
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body; // pega do request os dados informados

    const { user_id } = request.params; // pega o id do usuário que foi passado no request params

    const user = await knex("users").where({ id: user_id }).first(); // busca o usuário pelo id que foi informado nos parametros e armazena na const user

    if (!user) {
      // caso o user não for encontrado retorna esse erro
      throw new AppError("Usuário invalido");
    }

    const emailExists = await knex("users").where({ email }).first(); // busca o email informado pra ver se ele ja existe

    if (emailExists && emailExists.id !== user.id) {
      // caso o email exista ele verifica se o dono do email é o mesmo que está fazendo a requisição
      throw new AppError("Este email já foi cadastrado");
    }
    if (email) {
      // atualiza o email
      user.email = email;
    }

    if (name) {
      // atualiza o nome
      user.name = name;
    }

    if (password && !old_password) {
      // caso seja informado uma senha nova o user tem que informar a senha antiga se não da erro
      throw new AppError("Digite sua senha atual");
    }

    if (password && old_password) {
      // caso queira atualizar a senha e tenha informado a senha antiga...
      const old_passwordIsCorrect = await compare(old_password, user.password); // compara a senha antiga que o usuário informou com a senha que esta no banco de dados , e pra fazer isso é usado o compare do bcrypts

      if (!old_passwordIsCorrect) {
        // caso as senhas não batem retorna um erro
        throw new AppError("Senha atual incorreta");
      }

      user.password = await hash(password, 8); // atualiza no banco de dados ja passando a nova senha cryptografada
    }

    await knex("users").update(user).where({ id: user_id }); // na tabela de usuários procura o usuario pelo id , e faz o update passando os dados guardados na const user

    return response.status(201).json({ user }); // retorna os dados do usuário com o cod 201
  }
}

module.exports = UsersController;
