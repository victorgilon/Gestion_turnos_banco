import { Schema, model } from "mongoose";
import { version } from "node:os";

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
    },
    {
        timestamps: true, //para que cuando se guarde un dato vaya con su fecha de creacion y ultima fecha de actualizacion
        versionKey: false,
    },
);

esquemaTurno.index({ fecha: 1, hora: 1, sucursal: 1 }, { unique: true });

export default model("Turno", esquemaTurno);
