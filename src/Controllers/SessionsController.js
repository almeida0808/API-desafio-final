const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");

const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first(); // busca o usuário usando o email que foi passado

    if (!user) {
      // se o usuário não for encontrado da esse erro
      throw new AppError("Email e/ou senha inválidos");
    }
    // caso o user exista
    const passwordCorrect = await compare(password, user.password); // compara a senha informada com a senha do usuário que está no database
    if (!passwordCorrect) {
      // caso a senha esteja incorreta
      throw new AppError("Email e/ou senha inválidos");
    }

    const { expiresIn, secret } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return response.json({ user, token });
  }
}
module.exports = SessionsController;
