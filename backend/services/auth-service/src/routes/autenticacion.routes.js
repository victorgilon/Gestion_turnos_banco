import { Router } from "express";
import * as autenticacion from "../controllers/autenticacion.controller";
import { chequearEmailNombreUsuario, chequearRolesExistentes } from "../middleware/verificacionRegistro";

const router = Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});

router.post("/login", autenticacion.inicioSesion);

router.post("/registro", [chequearEmailNombreUsuario, chequearRolesExistentes], autenticacion.registro);

export default router;
