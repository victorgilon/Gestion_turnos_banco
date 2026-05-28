import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

//* ==== importar rutas ==== *//
import sucursalRoutes from "./routes/sucursal.routes";
import healthRoutes from "./routes/health.routes";

dotenv.config();
const app = express();

//* ==== Ajustes ==== *//
app.set("port", process.env.PORT || 5200);

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//* ==== rutas ==== *//s
app.use("/api/sucursales", sucursalRoutes);
app.use(healthRoutes);

export default app;
