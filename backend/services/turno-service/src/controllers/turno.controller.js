//este controlador lo que hace es crear, eliminar
import Turno from "../models/turno";

export const crearTurno = async (req, res) => {
    try {
        const { fecha, hora, estado, disponible, sucursal, documento } = req.body;

        let usuarioId = null;
        let tipoCliente = "visitante";
        let documentoCliente = documento || null;

        if (req.userId) {
            usuarioId = req.userId;
            tipoCliente = "registrado";
            documentoCliente = req.documento;
        }

        const turnoExistente = await Turno.findOne({
            fecha,
            hora,
            sucursal,
        });

        if (turnoExistente) {
            return res.status(400).json({ message: "Este turno ya esta reservado" });
        }

        const newTurno = new Turno({
            fecha,
            hora,
            estado,
            disponible,
            sucursal,
            usuario: usuarioId,
            tipoCliente,
            documento: documentoCliente,
        });

        const turnoGuardado = await newTurno.save();

        res.status(201).json(turnoGuardado);
    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Este turno ya está reservado para esa fecha, hora y sucursal" });
        }

        return res.status(500).json({ message: "Error al crear turno", error: error.message });
    }
};

export const obtenerTurno = async (req, res) => {
    try {
        const turno = await Turno.find();
        res.json(turno);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener turnos", error });
    }
};

// Obtener todos los turnos
export const obtenerTurnoPorId = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.turnoId);
        res.status(200).json(turno);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener turno", error });
    }
};

export const actualizarTurnoPorId = async (req, res) => {
    try {
        const actualizacionTurno = await Turno.findByIdAndUpdate(req.params.turnoId, req.body, {
            new: true,
        });

        res.status(200).json(actualizacionTurno);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar turno", error });
    }
};

export const eliminarTurnoPorId = async (req, res) => {
    try {
        const { turnoId } = req.params;
        await Turno.findByIdAndDelete(turnoId);
        res.status(204).json({ message: "Turno elimando correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar turno" });
    }
};
