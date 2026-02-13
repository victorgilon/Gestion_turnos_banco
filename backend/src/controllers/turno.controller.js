//este controlador lo que hace es crear, eliminar
import Turno from "../models/turno";

export const crearTurno = async (req, res) => {
    const { fecha, hora, estado, disponible, sucursal, usuario } = req.body;
    const newTurno = new Turno({ fecha, hora, estado, disponible, sucursal, usuario });

    const turnoGuardado = await newTurno.save();

    res.status(201).json(turnoGuardado);
};

export const obtenerTurno = async (req, res) => {
    const turno = await Turno.find();
    res.json(turno);
};

export const obtenerTurnoPorId = async (req, res) => {
    const turno = await Turno.findById(req.params.turnoId);

    res.status(200).json(turno);
};

export const actualizarTurnoPorId = async (req, res) => {
    const actualizacionTurno = await Turno.findByIdAndUpdate(req.params.turnoId, req.body, {
        new: true,
    });

    res.status(200).json(actualizacionTurno);
};

export const eliminarTurnoPorId = async (req, res) => {
    const { turnoId } = req.params;
    await Turno.findByIdAndDelete(turnoId);
    res.status(204).json();
};
