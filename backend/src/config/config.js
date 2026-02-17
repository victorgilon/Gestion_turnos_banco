import { config } from "dotenv";
config();

export const SECRET = "turnos-api";
export const PORT = process.env.PORT || 4000;
