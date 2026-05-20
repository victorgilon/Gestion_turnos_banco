import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";
import monitorRoutes from "./routes/monitor.routes";
import { fallos } from "./utils/fallos";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        credentials: true,
    }),
);

// =============================
// CONFIGURACIÓN CIRCUIT BREAKER
// =============================

const circuitBreaker = {
    auth: {
        errores: 0,
        abierto: false,
        ultimoFallo: null,
    },

    sucursales: {
        errores: 0,
        abierto: false,
        ultimoFallo: null,
    },

    turnos: {
        errores: 0,
        abierto: false,
        ultimoFallo: null,
    },
};

const LIMITE_ERRORES = 3;
const TIEMPO_RECUPERACION = 10000; // 10 segundos

//* ==== rutas ==== *//
app.use(monitorRoutes);

// =============================
// VALIDAR ESTADO DEL CIRCUITO
// =============================

const verificarCircuito = (servicio) => {
    const circuito = circuitBreaker[servicio];

    // HALF-OPEN
    if (circuito.abierto && Date.now() - circuito.ultimoFallo > TIEMPO_RECUPERACION) {
        console.log(`[HALF-OPEN] Intentando recuperar ${servicio}`);

        circuito.abierto = false;
        circuito.errores = 0;
    }

    return circuito.abierto;
};

// =============================
// MANEJO DE ERRORES
// =============================

const manejarError = (servicio, err, req, res) => {
    const circuito = circuitBreaker[servicio];

    circuito.errores++;
    // CONTADOR DE CAIDAS
    fallos[servicio]++;

    console.log(`[ERROR] Servicio ${servicio}: ${err.message}`);

    console.log(`[ERRORES CONTADOS] ${servicio}: ${circuito.errores}`);

    // Abrir circuito
    if (circuito.errores >= LIMITE_ERRORES) {
        circuito.abierto = true;
        circuito.ultimoFallo = Date.now();

        console.log(`[CIRCUIT OPEN] ${servicio} bloqueado temporalmente`);
    }

    return res.status(503).json({
        error: `Servicio ${servicio} no disponible`,
        circuitBreaker: circuito.abierto ? "OPEN" : "CLOSED",
    });
};

// =============================
// MIDDLEWARE CIRCUIT BREAKER
// =============================

const circuitoMiddleware = (servicio) => {
    return (req, res, next) => {
        const abierto = verificarCircuito(servicio);

        if (abierto) {
            console.log(`[BLOCKED] Petición rechazada para ${servicio}`);

            return res.status(503).json({
                error: `Circuit breaker OPEN para ${servicio}`,
            });
        }

        next();
    };
};

// =============================
// RUTAS AUTH
// =============================

app.use(
    ["/api/autenticacion", "/api/users"],

    circuitoMiddleware("auth"),

    createProxyMiddleware({
        target: `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}`,
        changeOrigin: true,

        onError: (err, req, res) => manejarError("auth", err, req, res),

        onProxyRes: () => {
            circuitBreaker.auth.errores = 0;

            console.log("[OK] Servicio auth funcionando");
        },
    }),
);

// =============================
// RUTAS SUCURSALES
// =============================

app.use(
    "/api/sucursales",

    circuitoMiddleware("sucursales"),

    createProxyMiddleware({
        target: `http://${process.env.SUCURSAL_SERVICE_HOST}:${process.env.SUCURSAL_SERVICE_PORT}`,
        changeOrigin: true,

        onError: (err, req, res) => manejarError("sucursales", err, req, res),

        onProxyRes: () => {
            circuitBreaker.sucursales.errores = 0;

            console.log("[OK] Servicio sucursales funcionando");
        },
    }),
);

// =============================
// RUTAS TURNOS
// =============================

app.use(
    "/api/turnos",

    circuitoMiddleware("turnos"),

    createProxyMiddleware({
        target: `http://${process.env.TURNO_SERVICE_HOST}:${process.env.TURNO_SERVICE_PORT}`,
        changeOrigin: true,

        onError: (err, req, res) => manejarError("turnos", err, req, res),

        onProxyRes: () => {
            circuitBreaker.turnos.errores = 0;

            console.log("[OK] Servicio turnos funcionando");
        },
    }),
);

export default app;
