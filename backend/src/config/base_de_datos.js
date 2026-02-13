import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
    .connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/${process.env.DB_NAME}`)
    .then((db) => console.log("Se ha conectado a la base de datos MongoDB con exito"))
    .catch((error) => console.log(error));
