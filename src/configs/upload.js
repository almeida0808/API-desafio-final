const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER, // informa aonde a imagem vai ficar
    filename(request, file, callback) {
      // cria um nome cryptografado pra não coorrer risco de ter imagens com mesmo nome
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

module.exports = { TMP_FOLDER, UPLOADS_FOLDER, MULTER };
