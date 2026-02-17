import express from "express";
import morgan from "morgan"; //middelware de express
import dotenv from "dotenv";

//* ==== importar rutas ==== *//
import turnoRoutes from "./routes/turno.routes";
import userRoutes from "./routes/user.routes";
import indexRoutes from "./routes/index.routes";
import autenticacionRoutes from "./routes/autenticacion.routes";
import { crearRoles } from "./libs/configuración_inicial";

const app = express();
crearRoles();

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

//* ==== ****** ==== *//
app.use(morgan("dev"));
app.use(express.json());

//* ==== rutas ==== *//s
app.use("/api", indexRoutes);
app.use("/api/turno", turnoRoutes);
app.use("/api/autenticacion", autenticacionRoutes);
app.use("/api/usuario", userRoutes);

export default app;
