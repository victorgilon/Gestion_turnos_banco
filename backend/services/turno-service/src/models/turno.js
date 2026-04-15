import { Schema, model } from "mongoose";

const esquemaTurno = new Schema(
    {
        fecha: {
            type: Date,
            required: true,
        },
        hora: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        estado: {
            type: String,
            enum: ["reservado", "confirmado", "cancelado", "asistido"],
            default: "reservado",
        },
        disponible: {
            type: Boolean,
            default: true,
        },
        sucursal: {
            type: Schema.Types.ObjectId,
            ref: "BranchOffice",
            required: true,
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        numeroTelefono: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, "Por favor, ingresa un número de teléfono válido"],
            // Esta regex acepta formato internacional: +54911... o solo números
        },
        tipoCliente: {
            type: String,
            enum: ["registrado", "visitante"],
            default: "visitante",
        },
    },
    {
        timestamps: true, //para que cuando se guarde un dato vaya con su fecha de creacion y ultima fecha de actualizacion
        versionKey: false,
    },
);

// Evita duplicados: mismo turno en misma fecha/hora/sucursal
esquemaTurno.index({ fecha: 1, hora: 1, sucursal: 1 }, { unique: true });

export default model("Turno", esquemaTurno);
