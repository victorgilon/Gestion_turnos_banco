import app from "./app";
import dotenv from "dotenv";
//import "./config/base_de_datos";
import mongoose from "mongoose";
console.log("ENTRÓ A INDEX");

dotenv.config();

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
    console.log("=============================================");
    console.log(`Turno-service ejecutándose en el puerto ${PORT}`);
    console.log("=============================================");
});
