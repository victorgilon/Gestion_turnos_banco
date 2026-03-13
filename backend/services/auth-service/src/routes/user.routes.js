import { Router } from "express";
import { obtenerUsuarioPorDocumento } from "../controllers/user.controller";

const router = Router();

router.get("/documento/:documento", obtenerUsuarioPorDocumento);

export default router;
