import express from "express";
import morgan from "morgan"; //middelware de express
import dotenv from "dotenv";

//* ==== importar rutas ==== *//
import autenticacionRoutes from "./routes/autenticacion.routes";
import usuarioRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 3001);
app.set("json spaces", 4);

//* ==== Middlewares ==== *//
app.use(morgan("dev"));
app.use(express.json());

//* ==== rutas ==== *//
app.use("/api/autenticacion", autenticacionRoutes);
app.use("/api/users", usuarioRoutes);

export default app;
