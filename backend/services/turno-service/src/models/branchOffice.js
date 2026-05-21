import { Schema, model } from "mongoose";

const branchOfficeSchema = new Schema(
    {
        nombre: String,
        direccion: String,
    },
    {
        versionKey: false,
    },
);

export default model("BranchOffice", branchOfficeSchema);
