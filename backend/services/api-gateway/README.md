# API Gateway - Sistema de Gestión de Turnos

Este es el servicio de **API Gateway** para el sistema de gestión de turnos. Actúa como el único punto de entrada (Single Point of Entry) para las peticiones provenientes del Frontend y las enruta hacia los microservicios correspondientes en el Backend.

## Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución.
* **Express.js**: Framework web para la creación del servidor.
* **http-proxy-middleware**: Middleware para el enrutamiento y proxy inverso de las peticiones HTTP.
* **CORS**: Middleware para gestionar los permisos de recursos de origen cruzado.

## Tabla de Enrutamiento (Rutas del Proxy)

El API Gateway intercepta las siguientes rutas y las redirige internamente a los microservicios:

| Ruta de Entrada (Frontend) | Microservicio Destino | Puerto Interno | Descripción |
| :--- | :--- | :--- | :--- |
| `/api/autenticacion` | `auth-service` | `3001` | Gestión de login, registro y tokens. |
| `/api/users` | `auth-service` | `3001` | Gestión de usuarios. |
| `/api/sucursales` | `sucursal-service` | `3002` | Gestión de sucursales. |
| `/api/turnos` | `turno-service` | `3003` | Gestión, creación y cancelación de turnos. |

## Configuración y Características Principales

* **Gestión de CORS Centralizada:** El Gateway está configurado para permitir peticiones explícitamente desde el entorno de desarrollo local del Frontend (`http://127.0.0.1:5500`) con envío de credenciales habilitado. *Nota: Los microservicios subyacentes no necesitan tener configurado CORS.*
* **Manejo de Errores (Resiliencia):** Incorpora una función de captura de errores (`onProxyError`). Si un microservicio destino está caído o inalcanzable, el Gateway captura el error y devuelve un estado HTTP `502 (Bad Gateway)` controlado al cliente, evitando que el servidor colapse.

## Instalación y Ejecución Local

1. Instalar las dependencias:
   ```bash
   npm install