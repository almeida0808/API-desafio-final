const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    if (!email || !name || !password) {
      throw new AppError("Preencha todas informações");
    }

    if (password.lenght < 8) {
      // a senha tem que ter 8 caracteres
      throw new AppError("A senha deve ter no mínimo 8 caracteres");
    }

    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Este email já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    response.status(201).json("Usuário criado com sucesso");
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;

    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário invalido");
    }

    const emailExists = await knex("users").where({ email }).first();

    if (emailExists && emailExists.id !== user.id) {
      throw new AppError("Este email já foi cadastrado");
    }
    if (email) {
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password && !old_password) {
      throw new AppError("Digite sua senha atual");
    }

    if (password && old_password) {
      const old_passwordIsCorrect = await compare(old_password, user.password); // compara a senha antiga que o usuário informou com a senha que esta no banco de dados , e pra fazer isso é usado o compare do bcrypts

      if (!old_passwordIsCorrect) {
        throw new AppError("Senha atual incorreta");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").update(user).where({ id: user_id });

    return response.status(201).json({ user });
  }
}

module.exports = UsersController;
