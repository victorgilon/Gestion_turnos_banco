export const health = async (req, res) => {
    console.log("[MONITOREO] Health check AUTH");

    res.status(200).json({
        servicio: "turno-service",
        estado: "activo",
    });
};
