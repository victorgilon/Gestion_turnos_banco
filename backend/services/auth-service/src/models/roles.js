import { Schema, model } from "mongoose";

export const ROLES = ["usuario", "admin", "moderador"];

const roleSchema = new Schema(
    {
        nombre: String,
    },
    {
        versionKey: false,
    },
);

export default model("Role", roleSchema);
