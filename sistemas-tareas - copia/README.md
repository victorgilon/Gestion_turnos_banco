1- Sistema de Gestión de Tareas
Este proyecto es una aplicación web de gestión de tareas que permite a los usuarios crear, consultar, actualizar y eliminar tareas. Está desarrollado con Node.js, MongoDB y Docker.


2- Arquitectura del sistema
-Frontend: Interfaz de usuario en HTML servida con Nginx.
-Backend: API desarrollada con Node.js y Express que procesa las solicitudes.
-Base de datos: MongoDB, donde se almacenan las tareas.

3- Tecnologías utilizadas
Node.js
Express
MongoDB
Mongoose
Docker
Docker Compose
Nginx

4- Cómo ejecutar el proyecto
Levantar los contenedores: docker-compose up --build

-Abrir el navegador y probar:
Frontend: http://localhost:8081
Backend: http://localhost:4000/tareas