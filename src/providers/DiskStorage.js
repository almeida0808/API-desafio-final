const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      // FUNÇÃO RENAME RECEBE DOIS PARAMETROS:
      path.resolve(uploadConfig.TMP_FOLDER, file), // AONDE O ARQUIVO ESTÁ E AONDEU EU QUERO LEVAR O ARQUIVO.
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); // mostra aonde está o arquivo

    try {
      await fs.promises.stat(filePath); // verifica o status do arquivo , ele está dentro de um try catch justamente por isso, caso retorne que ele está com um status que não nos permite fazr alguma alteração , ele cai no catch
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
