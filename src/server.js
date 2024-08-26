require("express-async-errors");
const AppError = require("./utils/AppError");

const database = require("./database/sqlite");

const express = require("express");
const routes = require("./routes");

const cors = require("cors");
const app = express();

const uploadConfig = require("./configs/upload");

app.use(cors());

app.use("/files/", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

database();

const PORT = 2211;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
