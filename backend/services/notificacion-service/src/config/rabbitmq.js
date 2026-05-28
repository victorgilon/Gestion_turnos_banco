import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || "turnos_exchange";

let channel = null;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);

        connection.on("error", (err) => {
            console.error("Error en RabbitMQ:", err.message);
        });

        connection.on("close", () => {
            console.warn("RabbitMQ desconectado. Reintentando...");
            setTimeout(connectRabbitMQ, 5000);
        });

        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, "topic", {
            durable: true,
        });

        console.log("Conectado a RabbitMQ");

        return channel;
    } catch (error) {
        console.error("No se pudo conectar a RabbitMQ:", error.message);
        // console.log("Reintentando en 5 segundos...");
        // setTimeout(connectRabbitMQ, 5000);
    }
};

// Obtener canal
export const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ no está conectado aún");
    }
    return channel;
};
