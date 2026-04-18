# 🔔 Notification Service - BEVS TurnoBank

Este es un microservicio **asíncrono** encargado de procesar y persistir las notificaciones del sistema. Utiliza **RabbitMQ** como Broker de mensajería para recibir eventos de otros microservicios y **MongoDB Atlas** para el historial de notificaciones.

## 🚀 Tecnologías utilizadas

- **Node.js** (v20)
- **Express** (Framework base)
- **RabbitMQ** (Broker de eventos)
- **MongoDB Atlas** (Base de datos NoSQL)
- **Babel** (Para soporte de ECMAScript Modules - `import/export`)
- **Mongoose** (ODM para MongoDB)

## 📦 Instalación y Configuración

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

## 🛠️ Scripts disponibles

- `npm run dev`: Inicia el servicio en modo desarrollo usando `nodemon` y `babel-node`.
- `npm run build`: Transpila el código de ES6 a JavaScript moderno en la carpeta `dist`.
- `npm start`: Ejecuta la versión compilada del proyecto.

## 🏗️ Arquitectura del Servicio

El servicio funciona bajo una arquitectura basada en eventos (**Event-Driven Architecture**):

1.  **Consumer:** Escucha el exchange `turnos_exchange`.
2.  **DLX (Dead Letter Exchange):** Si un mensaje falla o el JSON es inválido, se mueve automáticamente a `dead_letter_queue` para evitar pérdida de datos.
3.  **Idempotencia:** Antes de procesar, el servicio verifica en MongoDB si el `turnId` ya fue notificado para evitar duplicados.
4.  **Persistence:** Guarda un log de cada notificación con estado `SENT` o `FAILED`.

## 📁 Estructura del Proyecto

```text
notification-service/
├── src/
│   ├── config/       # Configuración de RabbitMQ y Base de Datos
│   ├── consumers/    # Lógica de escucha de colas
│   ├── models/       # Esquemas de Mongoose
│   ├── services/     # Lógica de negocio (Envío de emails/persistencia)
│   ├── app.js        # Orquestación de arranque
│   └── index.js      # Punto de entrada
├── .babelrc          # Configuración de Babel
├── Dockerfile        # Configuración para contenedorización
└── package.json
```
