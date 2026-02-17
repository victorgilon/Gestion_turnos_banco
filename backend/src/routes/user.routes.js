import { Router } from "express";
import { crearUsuario } from "../controllers/user.controller";
import { chequearRolesExistentes } from "../middlewares/verificacionRegistro";
import { verificacionToken, esAdminOModerador, esAdmin } from "../middlewares/autenticacionJwt";

const router = Router();
router.post("/", [verificacionToken, esAdmin, chequearRolesExistentes], crearUsuario);

export default router;
