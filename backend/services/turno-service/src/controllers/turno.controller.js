//este controlador lo que hace es crear, eliminar
import Turno from "../models/turno";
import { verificarUsuarioPorDocumento } from "../services/auth.service";

export const crearTurno = async (req, res) => {
    try {
        const { fecha, hora, estado, disponible, sucursal, documento } = req.body;

        let usuarioId = null;
        let tipoCliente = "visitante";

        if (req.userId) {
            usuarioId = req.userId;
            tipoCliente = "registrado";
        } else if (documento) {
            const resultado = await verificarUsuarioPorDocumento(documento);

            if (resultado.exists) {
                usuarioId = resultado.userId;
                tipoCliente = "registrado";
            }
        }

        const newTurno = new Turno({
            fecha,
            hora,
            estado,
            disponible,
            sucursal,
            usuario: usuarioId,
            tipoCliente,
        });

        const turnoGuardado = await newTurno.save();

        res.status(201).json(turnoGuardado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear turno", error });
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
