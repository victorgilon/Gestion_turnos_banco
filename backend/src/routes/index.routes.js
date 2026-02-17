import { Router } from "express";
import pkg from "../../package.json";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Bienvenido",
        name: pkg.name,
        autor: pkg.author,
        descripcion: pkg.descripcion,
        version: pkg.version,
    });
});

export default router;
