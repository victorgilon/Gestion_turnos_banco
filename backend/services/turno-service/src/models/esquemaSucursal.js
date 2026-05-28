import { Schema, model } from "mongoose";

const esquemaSucursal = new Schema(
    {
        nombre: String,
        direccion: String,
    },
    {
        versionKey: false,
    },
);

export default model("Sucursal", esquemaSucursal);
