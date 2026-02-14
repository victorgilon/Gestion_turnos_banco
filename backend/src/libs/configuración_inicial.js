import Role from "../models/roles";
export const crearRoles = async () => {
    try {
        const contador = await Role.estimatedDocumentCount();

        if (contador > 0) return;

        //esto lo que hace es ejecutar todas las funciones al mismo tiempo
        const valores = await Promise.all([
            new Role({ nombre: "user" }).save(),
            new Role({ nombre: "moderador" }).save(),
            new Role({ nombre: "admin" }).save(),
        ]);

        console.log(valores);
    } catch (error) {
        console.log(error);
    }
};
