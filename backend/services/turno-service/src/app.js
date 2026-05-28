import express from "express";
import morgan from "morgan"; //middelware de express
import dotenv from "dotenv";
import cors from "cors";

//* ==== importar rutas ==== *//
import turnoRutas from "./routes/turno.routes";
import healthRoutes from "./routes/health.routes";

dotenv.config();

const app = express();
app.use(cors());

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 4002);
app.set("json spaces", 4);

//* ==== Middlewares ==== *//
app.use(morgan("dev"));
app.use(express.json());

//* ==== rutas ==== *//
app.use("/api/turnos", turnoRutas);
app.use(healthRoutes);

export default app;
