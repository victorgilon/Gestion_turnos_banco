import { Schema, model } from "mongoose";

const roleSchema = new Schema(
    {
        nombre: String,
    },
    {
        versionKey: false,
    },
);

export default model("Role", roleSchema);
