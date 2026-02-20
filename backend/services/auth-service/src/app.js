import express from "express";
import morgan from "morgan"; //middelware de express
import dotenv from "dotenv";
import cors from "cors";

//* ==== importar rutas ==== *//
import autenticacionRoutes from "./routes/autenticacion.routes";

dotenv.config();

const app = express();

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 3001);
app.set("json spaces", 4);

//* ==== Middlewares ==== *//
app.use(morgan("dev"));
app.use(cors({ origin: "http://127.0.0.1:5501", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

//* ==== rutas ==== *//
app.use("/api/autenticacion", autenticacionRoutes);

export default app;
