import axios from "axios";

export const verificarUsuarioPorDocumento = async (documento) => {
    try {
        const response = await axios.get(`http://localhost:5100/api/users/documento/${documento}`);

        return response.data;
    } catch (error) {
        console.error("Error consultando auth-service:", error.message);
        return { exists: false };
    }
};
