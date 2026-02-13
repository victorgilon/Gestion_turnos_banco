//este controlador lo que hace es crear, eliminar
import Turno from "../models/turno";

export const crearTurno = async (req, res) => {
    const { fecha, hora, estado, disponible, sucursal, usuario } = req.body;
    const newTurno = new Turno({ fecha, hora, estado, disponible, sucursal, usuario });

    const turnoGuardado = await newTurno.save();

    res.status(201).json(turnoGuardado);
};

export const obtenerTurno = (req, res) => {
    res.json("obtener turno");
};

export const obtenerTurnoPorId = (req, res) => {};

export const actualizarTurnoPorId = (req, res) => {};

export const eliminarTurnoPorId = (req, res) => {};
