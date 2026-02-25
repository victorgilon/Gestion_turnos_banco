import { Schema, model, version } from "mongoose";

const sucursalSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
        },
        direccion: {
            type: String,
            required: true,
        },
        ciudad: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
        },
        estado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default model("Sucursal", sucursalSchema);
