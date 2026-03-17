import { Router } from "express";
import { verificacionToken, esAdminOModerador, esAdmin } from "../middleware/autenticacionJwt";
import {
    crearTurno,
    obtenerTurno,
    obtenerTurnoPorId,
    actualizarTurnoPorId,
    eliminarTurnoPorId,
} from "../controllers/turno.controller";

const router = Router();

router.post("/", verificacionToken, crearTurno);

router.get("/", verificacionToken, obtenerTurno); //pensar si se verifica toker

router.get("/:turnoId", obtenerTurnoPorId); //pensar si se verifica toker

router.put("/:turnoId", verificacionToken, actualizarTurnoPorId);

router.delete("/:turnoId", [verificacionToken, esAdminOModerador], eliminarTurnoPorId); //ejemplo para usar los roles par ahacer cosas modificar luego [se enciarra en llaves para decir que necesita ejecutar 2 middleware]

export default router;
