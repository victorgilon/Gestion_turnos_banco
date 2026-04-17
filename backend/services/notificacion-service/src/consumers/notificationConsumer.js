import { getChannel } from "../config/rabbitmq";
import { sendNotification } from "../services/notificationService";

const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || "turnos_exchange";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "notificacion_queue";
const ROUTING_KEY = process.env.RABBITMQ_ROUTING_KEY || "turno.created";

// 🔹 DLX del .env
const DLX_EXCHANGE = process.env.RABBITMQ_DLX_EXCHANGE || "dlx_exchange";
const DLX_QUEUE = process.env.RABBITMQ_DLX_QUEUE || "dead_letter_queue";

export const startConsumer = async () => {
    try {
        const channel = getChannel();

        //Crear DLX
        await channel.assertExchange(DLX_EXCHANGE, "fanout", {
            durable: true,
        });

        await channel.assertQueue(DLX_QUEUE, {
            durable: true,
        });

        await channel.bindQueue(DLX_QUEUE, DLX_EXCHANGE, "");

        // Crear cola principal con DLX configurado
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": DLX_EXCHANGE,
            },
        });

        //Bind con exchange principal
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

        console.log("Esperando eventos 'turno.created'...");

        // Consumidor
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                try {
                    let data;

                    // Validar JSON
                    try {
                        data = JSON.parse(msg.content.toString());
                    } catch (parseError) {
                        console.error("JSON inválido → enviado a DLQ");

                        //No reencolar → va al DLX automáticamente
                        channel.nack(msg, false, false);
                        return;
                    }

                    console.log("Evento recibido:", data);

                    await sendNotification(data);

                    channel.ack(msg);
                } catch (error) {
                    console.error("Error procesando → enviado a DLQ");

                    // No reencolar → se envía a DLX
                    channel.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error("Error en el consumer:", error.message);
    }
};
