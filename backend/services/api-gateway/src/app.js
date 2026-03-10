import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
    "/api/autenticacion",
    createProxyMiddleware({
        target: "http://auth-service:3001",
        //target: "http://localhost:3001",
        changeOrigin: true,
    }),
);

app.use(
    "/api/users",
    createProxyMiddleware({
        target: "http://auth-service:3001",
        //target: "http://localhost:3001",
        changeOrigin: true,
    }),
);

app.use(
    "/api/turnos",
    createProxyMiddleware({
        target: "http://turno-service:3002",
        changeOrigin: true,
    }),
);

app.use(
    "/api/sucursales",
    createProxyMiddleware({
        target: "http://sucursal-service:3003",
        changeOrigin: true,
    }),
);

export default app;
