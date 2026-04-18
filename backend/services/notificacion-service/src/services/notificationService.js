import { Notification } from "../models/notificationModel";

export const sendNotification = async (data) => {
    try {
        const { user_id, turn_id, date } = data;

        //Validación básica
        if (!user_id || !turn_id) {
            throw new Error("Datos incompletos para la notificación");
        }

        console.log(`Procesando notificación para usuario: ${user_id}`);

        // Mensaje
        const notificationMessage = `Tienes un nuevo turno (${turn_id}) para el ${date}.`;

        // IDEMPOTENCIA (evita duplicados)
        const existing = await Notification.findOne({
            userId: user_id,
            turnId: turn_id,
        });

        if (existing) {
            console.log("Notificación ya existe, evitando duplicado");
            return true;
        }

        //Simulación envío (email/SMS)
        console.log(`SMS/Email enviado: "${notificationMessage}"`);

        //Persistencia en MongoDB Atlas
        await Notification.create({
            userId: user_id,
            turnId: turn_id,
            message: notificationMessage,
            status: "SENT",
        });

        console.log("Notificación guardada en DB-Notificaciones");

        return true;
    } catch (error) {
        console.error("Error en notificationService:", error.message);

        // IMPORTANTE:
        // Esto hace que el consumer mande el mensaje al DLX
        throw error;
    }
};
