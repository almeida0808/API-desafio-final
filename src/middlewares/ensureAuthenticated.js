const { verify } = require("jsonwebtoken"); // função do propio jsonwebtoken que verifica se é um token valido
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth"); // importa as configurações que criamos anteriormente

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization; // pega o token do header de autorização

  if (!authHeader) {
    // caso não exista um token emite esse erro
    throw new AppError("JWT não informado", 401);
  }

  const [, token] = authHeader.split(" "); // caso exista um token ele separa, pois o token vem neste formato: "bearer xxxxxtokenxxxxx", entao fazemos um split removendo a palava bearer e removendo o espaço

  try {
    // agora tendo um token ja capturado nos ja desestruturamos o id que vem junto com o token, e verificamos se o token é realmente um token valido
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      // passa o id do usuário para o request.user possibilitando acessar o request.user.id\
      id: Number(user_id), // retorna o id pra número
    };

    return next(); // caso deu tudo certo passa do middleware
  } catch {
    // caso pegue algum erro ele barra o user informando que seu token é invalido
    throw new AppError("Jwt Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;
