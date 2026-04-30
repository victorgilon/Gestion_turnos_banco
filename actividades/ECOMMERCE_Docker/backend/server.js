const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "tienda",
};

let pool;

async function connectWithRetry() {
    while (!pool) {
        try {
            pool = mysql.createPool({
                ...dbConfig,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });

            const connection = await pool.getConnection();
            await connection.query(`
        CREATE TABLE IF NOT EXISTS productos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          precio DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            connection.release();

            console.log("Conectado a MySQL");
        } catch (error) {
            console.log("Esperando a MySQL...", error.message);
            pool = null;
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
}

app.get("/api", (req, res) => {
    res.json({ mensaje: "Backend funcionando correctamente" });
});

app.get("/api/productos", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nombre, precio, created_at FROM productos ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los productos" });
    }
});

app.post("/api/productos", async (req, res) => {
    try {
        const { nombre, precio } = req.body;

        if (!nombre || precio === undefined || precio === null || precio === "") {
            return res.status(400).json({ error: "Nombre y precio son obligatorios" });
        }

        const precioNumero = Number(precio);
        if (Number.isNaN(precioNumero) || precioNumero <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número mayor a 0" });
        }

        const [result] = await pool.query("INSERT INTO productos (nombre, precio) VALUES (?, ?)", [nombre, precioNumero]);

        const [rows] = await pool.query("SELECT id, nombre, precio, created_at FROM productos WHERE id = ?", [result.insertId]);

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "No se pudo guardar el producto" });
    }
});

app.delete("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
});

(async () => {
    await connectWithRetry();
    app.listen(PORT, () => {
        console.log(`Servidor backend escuchando en el puerto ${PORT}`);
    });
})();
