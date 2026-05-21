//este controlador lo que hace es crear, eliminar
import Turno from "../models/turno";
import BranchOffice from "../models/branchOffice";
import { publishEvent } from "../config/rabbitmq";

export const crearTurno = async (req, res) => {
    try {
        const { fecha, hora, estado, disponible, sucursal, documento, numeroTelefono, tramite } = req.body;

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
            sucursal,
            usuario: usuarioId, // Id del usuario si está logueado
            documento: documentoCliente, // <--- Campo nuevo del esquema
            numeroTelefono: numeroTelefono || null, // <--- Campo opcional del esquema
            tramite,
            tipoCliente, // "visitante" o "registrado"
            estado: "reservado", // Valor por defecto
            disponible: false, // Al reservarse, ya no está disponible
        });

        const turnoGuardado = await newTurno.save();
        console.log("Turno guardado:", turnoGuardado._id);

        //PUBLICAR EVENTO AQUÍ
        publishEvent("turno.created", {
            user_id: usuarioId || "visitante",
            turn_id: turnoGuardado._id.toString(),
            date: fecha,
        });
        console.log("Evento enviado a RabbitMQ");

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
        const turno = await Turno.find({
            usuario: req.userId,
        }).populate("sucursal", "nombre direccion");

        res.json(turno);
    } catch (error) {
        console.log("ERROR REAL:", error);

        return res.status(500).json({
            message: "Error al obtener turnos",
            error: error.message,
        });
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
