import { Notification } from "../models/notificationModel";

export const sendNotification = async (data) => {
    console.log("======================================");
    console.log("[NOTIFICATION-SERVICE] Nueva petición");
    try {
        const { user_id, turn_id, date } = data;

        console.log("[STEP 1] Extrayendo datos...");
        console.log("user_id:", user_id);
        console.log("turn_id:", turn_id);
        console.log("date:", date);

        // Validación básica
        console.log("[STEP 2] Validando datos obligatorios...");
        //Validación básica
        if (!user_id || !turn_id) {
            throw new Error("Datos incompletos para la notificación");
        }
        console.log("[OK] Datos válidos");
        console.log(`[STEP 3] Procesando notificación para usuario: ${user_id}`);

        // Mensaje
        const notificationMessage = `Tienes un nuevo turno (${turn_id}) para el ${date}.`;

        console.log("[STEP 4] Mensaje generado:");
        console.log(notificationMessage);

        // IDEMPOTENCIA (evita duplicados)
        console.log("[STEP 5] Verificando si la notificación ya existe...");

        const existing = await Notification.findOne({
            userId: user_id,
            turnId: turn_id,
        });

        if (existing) {
            console.log("[DUPLICATE] Notificación ya existe, evitando duplicado");
            console.log("======================================");
            return true;
        }

        console.log("[OK] No existe notificación previa");

        // Simulación envío (email/SMS)
        console.log("[STEP 6] Simulando envío SMS/Email...");
        console.log(`SMS/Email enviado: "${notificationMessage}"`);

        // Persistencia en MongoDB Atlas
        console.log("[STEP 7] Guardando notificación en MongoDB...");

        //Persistencia en MongoDB Atlas
        const notificationSaved = await Notification.create({
            userId: user_id,
            turnId: turn_id,
            message: notificationMessage,
            status: "SENT",
        });

        console.log("[SUCCESS] Notificación guardada correctamente");
        console.log("ID generado:", notificationSaved._id);

        console.log("======================================");

        return true;
    } catch (error) {
        console.error("======================================");
        console.error("[NOTIFICATION-SERVICE ERROR]");
        console.error("Error en notificationService:", error.message);
        console.error("======================================");

        // IMPORTANTE:
        // Esto hace que el consumer mande el mensaje al DLX
        throw error;
    }
};
