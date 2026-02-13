import { Router } from "express";
import * as turnoCtrl from "../controllers/turno.controller";

const router = Router();

router.post("/", turnoCtrl.crearTurno);

router.get("/", turnoCtrl.obtenerTurno);

router.get("/:turnoId", turnoCtrl.obtenerTurnoPorId);

router.put("/:turnoId", turnoCtrl.actualizarTurnoPorId);

router.delete("/:turnoId", turnoCtrl.eliminarTurnoPorId);

export default router;
