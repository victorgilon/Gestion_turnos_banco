import User from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import Role from "../models/roles";

export const registro = async (req, res) => {
    const { nombreUsuario, email, password, roles } = req.body;

    const nuevoUsuario = new User({
        nombreUsuario,
        email,
        password: "",
    });
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

    if (roles) {
        const rolEncontrado = await Role.find({ nombre: { $in: roles } });
        nuevoUsuario.roles = rolEncontrado.map((role) => role._id);
    } else {
        const role = await Role.findOne({ nombre: "user" });
        nuevoUsuario.roles = [role._id];
    }

    const usuarioGuardado = await nuevoUsuario.save();
    console.log(usuarioGuardado);

    const token = jwt.sign({ id: usuarioGuardado._id }, config.SECRET, {
        expiresIn: 86400, //24 horas
    });

    res.status(200).json({ token });
};

export const inicioSesion = async (req, res) => {
    res.json("inicio de sesion");
};
