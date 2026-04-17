import app from "./app";
import dotenv from "dotenv";
import "./config/base_de_datos";
import { connectRabbitMQ } from "./config/rabbitmq";

dotenv.config();

const PORT = process.env.PORT || 4002;

const startServer = async () => {
    try {
        // 1. Conectar a RabbitMQ (Productor)
        // Lo hacemos antes del listen para que el canal esté listo al recibir peticiones
        await connectRabbitMQ();
        console.log("RabbitMQ conectado");

        // 2. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log("=============================================");
            console.log(`Turno-service ejecutándose en el puerto ${PORT}`);
            console.log("=============================================");
        });
    } catch (error) {
        console.error("Error crítico al iniciar el servicio:", error.message);
        // Si no hay RabbitMQ, el microservicio no debería funcionar
        process.exit(1);
    }
};

startServer();
