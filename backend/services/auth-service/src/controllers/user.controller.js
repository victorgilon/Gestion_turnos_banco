import User from "../models/user";

export const obtenerUsuarioPorDocumento = async (req, res) => {
    try {
        const { documento } = req.params;

        const user = await User.findOne({ documento });

        if (!user) {
            return res.json({ exists: false });
        }

        res.json({
            exists: true,
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
