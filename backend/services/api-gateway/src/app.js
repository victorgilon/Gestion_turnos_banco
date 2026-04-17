import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

//Habilitar CORS para que el Frontend pueda comunicarse
app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        credentials: true,
    }),
);

const onProxyError = (err, req, res) => {
    console.log(`Error de proxy: ${err.message}`);
    res.status(502).json({ error: "Microservicio no disponible en este momento." });
};

//rutas
app.use(
    "/api/autenticacion",
    createProxyMiddleware({
        target: "http://auth-service:3001",
        changeOrigin: true,
        onError: onProxyError,
    }),
);

app.use(
    "/api/users",
    createProxyMiddleware({
        target: "http://auth-service:3001",
        changeOrigin: true,
        onError: onProxyError,
    }),
);

app.use(
    "/api/sucursales",
    createProxyMiddleware({
        target: "http://sucursal-service:3002",
        changeOrigin: true,
        onError: onProxyError,
    }),
);

app.use(
    "/api/turnos",
    createProxyMiddleware({
        target: "http://turno-service:3003",
        changeOrigin: true,
        onError: onProxyError,
    }),
);

export default app;