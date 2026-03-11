import app from "./app";
import dotenv from "dotenv";
import "./config/base_de_datos";
import { crearRoles } from "./libs/configuración_inicial";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log("=============================================");
    console.log("auth-service ejecutándose en el puerto", app.get("port"));
    console.log("=============================================");
    await crearRoles(); //crea roles si no existen
});
