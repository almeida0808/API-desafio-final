const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); // salva o caminho da pasta temporaria onde as imagens vão ficar assim que são enviadas
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads"); // pasta onde as imagens vão ser realmente salvas

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER, // informa aonde a imagem vai ficar temporariamente

    filename(request, file, callback) {
      // função que define o nome do arquivo

      const fileHash = crypto.randomBytes(10).toString("hex"); // cria um nome cryptografado
      const fileName = `${fileHash}-${file.originalname}`; // junta o nome cryptografado com o nome original do arquivo

      return callback(null, fileName); // retorna o nome do arquivo ja com a cryptografia
    },
  }),
};

module.exports = { TMP_FOLDER, UPLOADS_FOLDER, MULTER };
