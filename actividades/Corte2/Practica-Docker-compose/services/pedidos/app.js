
const express = require('express');
const app = express();
const PORT = 3002; 

const NOMBRE_SERVICIO = "PEDIDOS"; 

app.get('/', (req, res) => {
  res.json({
    servicio: NOMBRE_SERVICIO,
    estado: "Online",
    instancia: "Contenedor Docker",
    mensaje: `Bienvenido al microservicio de ${NOMBRE_SERVICIO.toLowerCase()}`
  });
});

app.listen(PORT, () => {
  console.log(`Microservicio de ${NOMBRE_SERVICIO} escuchando en puerto ${PORT}`);
});