import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/${process.env.DB_NAME}`;
mongoose
    .connect(URI)
    .then((db) => console.log("Se ha conectado a la base de datos MongoDB con exito"))
    .catch((error) => console.log("Error al conectar a MongoDB:", error));
