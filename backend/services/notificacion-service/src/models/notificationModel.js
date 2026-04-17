import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    turnId: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
    createdAt: { type: Date, default: Date.now },
});

//Índice único para idempotencia (evita duplicados)
notificationSchema.index({ turnId: 1, userId: 1 }, { unique: true });

export const Notification = mongoose.model("Notification", notificationSchema);
