import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Habilitar CORS usando la URL del Gateway si es necesario
app.use(
    cors({
        origin: "http://127.0.0.1:5500", // Tu frontend
        credentials: true,
    }),
);

const onProxyError = (err, req, res) => {
    console.log(`Error de proxy: ${err.message}`);
    res.status(502).json({ error: "Microservicio no disponible en este momento." });
};

// --- RUTAS DINÁMICAS BASADAS EN VARIABLES DE ENTORNO ---

// Autenticación y Usuarios
app.use(
    ["/api/autenticacion", "/api/users"],
    createProxyMiddleware({
        target: `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}`,
        changeOrigin: true,
        onError: onProxyError,
    }),
);

// Sucursales
app.use(
    "/api/sucursales",
    createProxyMiddleware({
        target: `http://${process.env.SUCURSAL_SERVICE_HOST}:${process.env.SUCURSAL_SERVICE_PORT}`,
        changeOrigin: true,
        onError: onProxyError,
    }),
);

// Turnos
app.use(
    "/api/turnos",
    createProxyMiddleware({
        target: `http://${process.env.TURNO_SERVICE_HOST}:${process.env.TURNO_SERVICE_PORT}`,
        changeOrigin: true,
        onError: onProxyError,
    }),
);

export default app;
