import connectDB from "./config/base_de_datos";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startConsumer } from "./consumers/notificationConsumer";

export const startApp = async () => {
    try {
        console.log("Iniciando Notification Service...");

        //Conectar a MongoDB
        await connectDB();

        //Conectar a RabbitMQ
        await connectRabbitMQ();

        //Iniciar consumidor
        await startConsumer();

        console.log("Notification Service listo y escuchando eventos");
    } catch (error) {
        console.error("Error iniciando la aplicación:", error.message);
        process.exit(1);
    }
};
