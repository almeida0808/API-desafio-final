const fs = require("fs"); // fs do propio node lida com manipulação de arquivos
const path = require("path"); // navega entre os diretorios
const uploadConfig = require("../configs/upload"); // configurações de upload

class DiskStorage {
  async saveFile(file) {
    // salva o arquivo que foi passado como parametro
    await fs.promises.rename(
      // FUNÇÃO RENAME RECEBE DOIS PARAMETROS:

      path.resolve(uploadConfig.TMP_FOLDER, file), // AONDE O ARQUIVO ESTÁ E AONDE EU QUERO LEVAR O ARQUIVO
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file; // retorna qual arquivo foi salvo
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); // mostra aonde está o arquivo

    try {
      await fs.promises.stat(filePath); // verifica o status do arquivo , ele está dentro de um try catch justamente por isso, caso retorne que ele está com um status que não nos permite fazr alguma alteração , ele cai no catch
    } catch {
      return;
    }

    await fs.promises.unlink(filePath); // unlink deleta o arquivo
  }
}

module.exports = DiskStorage;
