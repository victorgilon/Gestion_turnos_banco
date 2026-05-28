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
            ref: "Sucursal",
            required: true,
        },

        usuario: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        documento: {
            type: String,
            required: true,
            trim: true,
        },

        tramite: {
            type: String,
            required: true,
            trim: true,
        },

        numeroTelefono: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, "Por favor, ingresa un número de teléfono válido"],
        },

        tipoCliente: {
            type: String,
            enum: ["registrado", "visitante"],
            default: "visitante",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

esquemaTurno.index(
    {
        fecha: 1,
        hora: 1,
        sucursal: 1,
    },
    { unique: true },
);

export default model("Turno", esquemaTurno);
