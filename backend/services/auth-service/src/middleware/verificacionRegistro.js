//ver si se esta enviadno un correo nuevo o si ya existe previamente y ver si ya tienen un rol
import { ROLES } from "../models/roles";
import User from "../models/user";

export const chequearEmailNombreUsuario = async (req, res, next) => {
    try {
        const user = await User.findOne({ nombreUsuario: req.body.nombreUsuario });

        if (user) return res.status(400).json({ message: "el nombre de usuario ya existe" });

        const email = await User.findOne({ email: req.body.email });

        if (email) return res.status(400).json({ message: "el  email ya existe" });

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const chequearRolesExistentes = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({ message: `Rol ${req.body.roles[i]} no existe` });
            }
        }
    }

    next();
};
