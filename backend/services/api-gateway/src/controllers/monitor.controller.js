import { fallos } from "../utils/fallos";

const SERVICIOS = {
    auth: `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}/health`,

    turnos: `http://${process.env.TURNO_SERVICE_HOST}:${process.env.TURNO_SERVICE_PORT}/health`,

    sucursales: `http://${process.env.SUCURSAL_SERVICE_HOST}:${process.env.SUCURSAL_SERVICE_PORT}/health`,

    notificacion: `http://${process.env.NOTIFICACION_SERVICE_HOST}:${process.env.NOTIFICACION_SERVICE_PORT}/health`,
};

export const estadoGeneral = async (req, res) => {
    const resultado = {};

    console.log("\n========== MONITOREO DEL SISTEMA ==========");

    for (const [nombre, url] of Object.entries(SERVICIOS)) {
        const inicio = Date.now();

        try {
            console.log(`[MONITOREO] Verificando ${nombre}`);
            const response = await fetch(url);
            const fin = Date.now();
            const tiempo = fin - inicio;

            resultado[nombre] = {
                estado: "activo",
                codigo_http: response.status,
                veces_caido: fallos[nombre],
                latencia: `${tiempo} ms`,
            };
            console.log(`[OK] ${nombre} activo`);
            console.log(`[LATENCIA] ${nombre}: ${tiempo} ms`);
        } catch (error) {
            resultado[nombre] = {
                estado: "caido",

                veces_caido: fallos[nombre],
            };
            console.log(`[ERROR] ${nombre}: ${error.message}`);
            console.log(`[SERVICIO CAIDO] ${nombre}: ${fallos[nombre]} veces`);
        }
    }

    console.log("===========================================\n");

    res.json(resultado);
};
