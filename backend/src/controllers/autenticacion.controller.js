import User from "../models/user";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/config";
import Role from "../models/roles";

export const registro = async (req, res) => {
    try {
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
            const role = await Role.findOne({ nombre: "usuario" });
            nuevoUsuario.roles = [role._id];
        }

        const usuarioGuardado = await nuevoUsuario.save();
        console.log(usuarioGuardado);

        const token = jwt.sign({ id: usuarioGuardado._id }, SECRET, {
            expiresIn: 86400, //24 horas
        });

        res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export const inicioSesion = async (req, res) => {
    try {
        const usuarioEncontrado = await User.findOne({ email: req.body.email }).populate("roles"); //populate = En vez de devolver solo los ObjectId de roles, devuelve la información completa de cada rol en este caso los nombres de los roles.

        if (!usuarioEncontrado) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const coincidenciaPassword = await usuarioEncontrado.comparePassword(req.body.password, usuarioEncontrado.password);

        if (!coincidenciaPassword) {
            return res.status(401).json({ token: null, message: "Contraseña invalida" });
        }

        const token = jwt.sign({ id: usuarioEncontrado._id }, SECRET, { expiresIn: 86400 });

        res.json({ token });
    } catch (error) {
        console.log(error);
    }
};
