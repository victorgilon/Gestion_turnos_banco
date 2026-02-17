import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userShema = new Schema(
    {
        nombreUsuario: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: [
            {
                //para relacionar los roles se le dice que [{}] que es un arreglo de objetos, en el cual cada objeto va a tener una relacion que se usa la propiedad ref
                //ref es para decir que tiene una referencia o esta relacionado con otro modelo de datos
                ref: "Role",
                type: Schema.Types.ObjectId, //el tipo de dato que se va a guardar va hacer un ObjectId
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

//cifrar contrseña y comparar
userShema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userShema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); //esto retorna un true o un false, si la contraseña coinciden retorna un true
};



export default model("User", userShema);
