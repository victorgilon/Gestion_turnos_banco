import { Router } from "express";

import { estadoGeneral } from "../controllers/monitor.controller";

const router = Router();

router.get("/estado", estadoGeneral);

export default router;
