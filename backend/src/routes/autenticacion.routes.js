import { Router } from "express";
import * as autenticacion from "../controllers/autenticacion.controller";

const router = Router();

router.post("/inicioSesion", autenticacion.inicioSesion);

router.post("/registro", autenticacion.registro);

export default router;
