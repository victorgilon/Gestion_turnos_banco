//Autorizacion
import jwt from "jsonwebtoken";
import { SECRET } from "../config/config";
import User from "../models/user";
import Role from "../models/roles";

export const verificacionToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "no se proporciono el token" });
        }

        const descifrado = jwt.verify(token, SECRET);
        req.userId = descifrado.id;

        const user = await User.findById(req.userId, { password: 0 });

        if (!user) {
            return res.status(404).json({ message: "Usuario no existe" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "No autorizado" });
    }
};

export const esAdminOModerador = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        console.log(req.userId);

        const roles = await Role.find({ _id: { $in: user.roles } }); //lo que hace es recorres la cadena de roles que tiene el usuario

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === "moderador" || roles[i].nombre === "admin") {
                next();
                return;
            }
        }

        return res.status(403).json({ message: "Se necesita rol de admin o moderador" });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
};

export const esAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        console.log(req.userId);

        const roles = await Role.find({ _id: { $in: user.roles } }); //lo que hace es recorres la cadena de roles que tiene el usuario

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === "admin") {
                next();
                return;
            }
        }

        return res.status(403).json({ message: "Se necesita rol de admin" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
};
