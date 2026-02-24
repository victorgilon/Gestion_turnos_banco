//Autorizacion
import jwt from "jsonwebtoken";
import { SECRET } from "../config/config";

export const verificacionToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "no se proporciono el token" });
        }

        const descifrado = jwt.verify(token, SECRET);
        req.userId = descifrado.id;
        req.userNombre = descifrado.nombreUsuario;
        req.roles = descifrado.roles;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const esAdminOModerador = async (req, res, next) => {
    try {
        if (!req.roles) {
            return res.status(403).json({ message: "Rol no definido en el Token " });
        }

        if (req.roles.includes("admin") || req.roles.includes("moderador")) {
            return next();
        }

        return res.status(403).json({ message: "Se necesita rol de admin o moderador" });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
};

export const esAdmin = async (req, res, next) => {
    try {
        if (!req.roles) {
            return res.status(403).json({ message: "Rol no definido en el token" });
        }

        if (req.roles.includes("admin")) {
            return next();
        }

        return res.status(403).json({ message: "Se necesita rol de admin" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
};
