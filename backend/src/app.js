import express from "express";
import morgan from "morgan"; //middelware de express
import pkg from "../package.json";
import turnoRoutes from "./routes/turno.routes";

const app = express();

app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: app.get("pkg").name,
        autor: app.get("pkg").author,
        descripcion: app.get("pkg").descripcion,
        version: app.get("pkg").version,
    });
});

app.use("/turno", turnoRoutes);

export default app;
