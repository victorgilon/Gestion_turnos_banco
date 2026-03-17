import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en el .env");
}
export const SECRET = process.env.JWT_SECRET;
