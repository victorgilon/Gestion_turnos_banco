

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// conexión a MongoDB (IMPORTANTE para Docker)
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/tareas_db";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

// modelo
const Tarea = mongoose.model("Tarea", {
  titulo: String,
  descripcion: String
});

// ================= RUTAS =================

// obtener tareas
app.get("/tareas", async (req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

// crear tarea
app.post("/tareas", async (req, res) => {
  const nueva = new Tarea(req.body);
  await nueva.save();
  res.json(nueva);
});

// actualizar tarea
app.put("/tareas/:id", async (req, res) => {
  const actualizada = await Tarea.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizada);
});

// eliminar tarea
app.delete("/tareas/:id", async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminada" });
});

// OBLIGATORIO
app.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});

