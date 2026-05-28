import express from "express";
import connectDB from "./config/base_de_datos";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startConsumer } from "./consumers/notificationConsumer";
import dotenv from "dotenv";

// ==== importar rutas ====
import healthRoutes from "./routes/health.routes";

const app = express();
dotenv.config();

app.use(express.json());

// ==== rutas ====
app.use(healthRoutes);

const PORT = process.env.PORT || 3004;

export const startApp = async () => {
    try {
        console.log("====================================");
        console.log("Iniciando Notification Service...");

        // MongoDB
        console.log("[1] Conectando a MongoDB...");
        await connectDB();
        console.log("[OK] MongoDB conectado");

        // RabbitMQ
        console.log("[2] Conectando a RabbitMQ...");
        await connectRabbitMQ();
        console.log("[OK] RabbitMQ conectado");

        // Consumer
        console.log("[3] Iniciando consumidor...");
        await startConsumer();
        console.log("[OK] Consumer iniciado");

        // HTTP Server
        app.listen(PORT, () => {
            console.log(`[OK] Notification Service ejecutándose en puerto ${PORT}`);

            console.log(`[HEALTH CHECK] http://localhost:${PORT}/health`);

            console.log("====================================");
        });
    } catch (error) {
        console.error("====================================");
        console.error("[ERROR] Error iniciando la aplicación");
        console.error(error.message);
        console.error("====================================");

        process.exit(1);
    }
};
