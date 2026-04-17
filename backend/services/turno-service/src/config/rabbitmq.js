import dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config();

let channel = null;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672");
        channel = await connection.createChannel();

        // Aseguramos que el exchange existe antes de enviar nada
        await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", { durable: true });

        console.log("Turno-Service conectado a RabbitMQ (Productor)");
    } catch (error) {
        console.error("Error RabbitMQ en Turno-Service:", error.message);
    }
};

export const publishEvent = (routingKey, data) => {
    if (!channel) {
        console.error("No hay canal de RabbitMQ disponible");
        return;
    }

    // Usar una constante para asegurar que no enviamos a un exchange 'undefined'
    const exchange = process.env.RABBITMQ_EXCHANGE || "turnos_exchange";
    const buffer = Buffer.from(JSON.stringify(data));

    try {
        channel.publish(exchange, routingKey, buffer, {
            persistent: true,
        });
        console.log(`Evento enviado a ${exchange} con clave: ${routingKey}`);
    } catch (err) {
        console.error("Error al publicar en RabbitMQ:", err.message);
    }
};
