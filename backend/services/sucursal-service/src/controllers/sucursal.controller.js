import Sucursal from "../models/sucursal.js";

export const crearSucursal = async (req, res) => {
    try {
        const nuevaSucursal = new Sucursal(req.body);
        const sucursalGuardada = await nuevaSucursal.save();

        res.status(201).json(sucursalGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear sucursal", error });
    }
};

export const obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.find();
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener sucursales", error });
    }
};

export const obtenerSucursalId = async (req, res) => {
    try {
        const sucursal = await Sucursal.findById(req.params.id);
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener sucursal" });
    }
};

export const actualizarSucursal = async (req, res) => {
    try {
        const sucursalActualizada = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(sucursalActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar sucursal" });
    }
};

export const eliminarSucursal = async (req, res) => {
    try {
        await Sucursal.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar sucursal", error });
    }
};
