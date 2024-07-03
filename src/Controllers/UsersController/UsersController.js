const AppError = require("../../utils/AppError");

class UsersController {
  create(request, response) {
    const { name, email, password } = request.body;

    if (!email || !name || !password) {
      throw new AppError("Preencha todas informações");
    }

    if (password.lenght < 8) {
      throw new AppError("A senha deve ter no mínimo 8 caracteres");
    }

    response.json({ name, email, password });
  }
}

module.exports = UsersController;
