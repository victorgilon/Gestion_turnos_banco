import { Router } from "express";
import {
    crearSucursal,
    obtenerSucursales,
    obtenerSucursalId,
    actualizarSucursal,
    eliminarSucursal,
} from "../controllers/sucursal.controller";

const router = Router();

router.post("/", crearSucursal);
router.get("/", obtenerSucursales);
router.get("/:id", obtenerSucursalId);
router.put("/:id", actualizarSucursal);
router.delete("/:id", eliminarSucursal);

export default router;
