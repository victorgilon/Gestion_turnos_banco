import express from "express";
import morgan from "morgan"; //middelware de express
import dotenv from "dotenv";

//* ==== importar rutas ==== *//
import autenticacionRoutes from "./routes/autenticacion.routes";

dotenv.config();

const app = express();

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 3001);
app.set("json spaces", 4);

//* ==== Middlewares ==== *//
app.use(morgan("dev"));
app.use(express.json());

//* ==== rutas ==== *//s
app.use("/api/autenticacion", autenticacionRoutes);

export default app;
