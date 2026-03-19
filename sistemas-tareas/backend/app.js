const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ========== MIDDLEWARES =========

app.use(cors());
app.use(express.json());

// ========CONEXIÓN A MONGODB =======

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo_db:27017/tareas_db";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error(" Error conectando a MongoDB:", error));

// ================= MODELO =================

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
});

const Tarea = mongoose.model("Tarea", tareaSchema);

// ================= RUTAS =================

// Ruta principal
app.get("/", (req, res) => {
  res.send("API de tareas funcionando correctamente");
});

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tareas" });
  }
});

// Crear tarea
app.post("/tareas", async (req, res) => {
  try {
    const nuevaTarea = new Tarea({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion
    });

    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear tarea" });
  }
});

// Actualizar tarea
app.put("/tareas/:id", async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar tarea" });
  }
});

// Eliminar tarea
app.delete("/tareas/:id", async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar tarea" });
  }
});

// =====SERVIDOR ========

const PORT = 4000;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
});