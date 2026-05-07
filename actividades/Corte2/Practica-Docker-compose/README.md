# Fase de Diseño del Sistema: Aplicación de Pedidos en Línea

## A. Definir el tipo de sistema

**Aplicación web de pedidos de comidas en línea**, donde los usuarios pueden visualizar un menú y realizar pedidos que son procesados y almacenados en la base de datos.

---

## B. Identificar mínimo tres servicios

### 1. Frontend

Es el punto de interacción directa con el cliente. Desarrollado como una aplicación web responsiva, su función principal es:

- **Visualización:** Presentar de forma dinámica el catálogo de productos y precios.
- **Gestión de Sesión:** Permitir el ingreso y registro de usuarios.
- **Flujo de Compra:** Guiar al usuario desde la selección de productos hasta la confirmación del pedido.

### 2. Backend

Actúa como el núcleo del sistema. Bajo un enfoque orientado a microservicios, este se divide en los siguientes componentes especializados:

- **Servicio de Pedidos:** Controla el ciclo de vida de una orden (creación, validación de pago y cambio de estados).
- **Servicio de Usuarios:** Administra la autenticación (Login/JWT) y los perfiles de los clientes.
- **Servicio de Catálogo:** Gestiona el inventario de productos, descripciones y disponibilidad en tiempo real.

### 3. Base de Datos (Capa de Persistencia)

Se utiliza **MongoDB** como motor de base de datos NoSQL, lo cual aporta:

- **Flexibilidad:** Almacenamiento de pedidos y productos en formato JSON/BSON, ideal para menús que cambian frecuentemente.
- **Escalabilidad:** Capacidad de manejar grandes volumes de datos si el tráfico aumenta.
- **Desacoplamiento:** Cada microservicio mencionado anteriormente interactúa con sus propias colecciones para mantener la independencia de los datos.

### 4. API Gateway

El API Gateway actúa como un punto de entrada único para todas las solicitudes enviadas desde el Frontend. En lugar de que la aplicación web intente comunicarse directamente con cada microservicio, envía todas sus peticiones al Gateway, y este se encarga de redirigirlas.

**Funciones Principales:**

- **Enrutamiento Dinámico:** Recibe una solicitud (ej. `/api/pedidos`) y sabe exactamente a qué microservicio interno debe enviarla.
- **Seguridad y Autenticación:** Es el lugar ideal para verificar si el usuario tiene un token válido (JWT) antes de dejar que la petición llegue a los servicios internos.
- **Balanceo de Carga:** Si existen varias instancias de un servicio, el Gateway reparte las peticiones de forma equitativa.
- **Agregación de Respuestas:** Puede consultar varios microservicios a la vez y entregar al Frontend una sola respuesta combinada.

---

## C. Describir cómo se comunican

El sistema utiliza un modelo de comunicación **cliente-servidor** basado en el protocolo **HTTP/HTTPS**, siguiendo los principios de la arquitectura **REST**.

1.  **Comunicación Externa (Frontend a API Gateway):**
    El Frontend realiza peticiones a un punto único utilizando métodos estándar:
    - `GET`: Para consultar el menú o historial.
    - `POST`: Para registrar usuarios o crear órdenes.
    - `PUT/PATCH`: Para actualizar el estado de un pedido.

2.  **Comunicación Interna y Enrutamiento:**
    Una vez que el API Gateway recibe la solicitud, realiza la **Validación** (vía tokens JWT) y la **Redirección** al microservicio correspondiente.

3.  **Interacción con la Capa de Datos (MongoDB):**
    Cada microservicio es responsable de su propia comunicación. La comunicación es **asíncrona** en el backend para evitar bloqueos y garantizar fluidez.

4.  **Ciclo de Respuesta:**
    MongoDB confirma la operación -> El microservicio genera un objeto **JSON** -> El API Gateway entrega el JSON al Frontend con el código de estado HTTP adecuado.

---

## D. Qué ocurre si un servicio falla

### 1. Aislamiento de Fallos

Si el Servicio de Pedidos falla, el Servicio de Catálogo sigue operativo. El usuario podrá navegar por el menú, pero recibirá un mensaje de "Servicio de pedidos no disponible" al intentar comprar. El sistema no "muere" por completo.

### 2. Implementación de Circuit Breaker (Interruptor)

El API Gateway utiliza un "Circuit Breaker" para evitar la propagación de errores:

- **Detección:** Si un servicio no responde, el interruptor se "abre".
- **Protección:** Se deja de enviar peticiones al servicio fallido para permitir su recuperación.
- **Respuesta de Error:** Se devuelve un error rápido o respuesta alternativa en lugar de dejar al usuario esperando.

### 3. Estrategias de Recuperación y Disponibilidad

- **Reintentos Automáticos:** El Gateway reintenta la petición antes de marcar el servicio como caído.
- **Auto-escalado y Reemplazo:** Mediante herramientas de orquestación (como Docker), el sistema detecta fallos en contenedores y lanza nuevos automáticamente.

---

## Análisis Técnico

### 1. ¿Cuál es el rol de cada servicio?

- **Frontend:** Presentación y traducción de datos técnicos a interfaz visual (HTML/CSS).
- **API Gateway:** Orquestación, seguridad y punto único de entrada.
- **Microservicios:** Lógica de negocio independiente (vender, autenticar, mostrar).
- **Base de Datos:** Persistencia segura y organizada de la información.

### 2. ¿Qué ventajas tiene dividir el sistema?

- **Escalabilidad Selectiva:** Duplicar solo los servicios con alta demanda.
- **Mantenimiento Sencillo:** Actualizar un módulo sin riesgo de romper los demás.
- **Resiliencia:** Tolerancia a fallos parciales.
- **Independencia Tecnológica:** Posibilidad de usar diferentes lenguajes de programación por servicio.

### 3. ¿Cómo se comunican los contenedores?

Dentro del entorno de **Docker**, la comunicación se realiza mediante una **Red Virtual**:

- **Resolución por Nombre DNS Interno:** Permite encontrar servicios por nombre (ej. `http://ms-pedidos`) en lugar de IPs variables.
- **Protocolo HTTP/REST:** Intercambio de mensajes en formato **JSON**, un lenguaje universal para todos los contenedores.
- **Aislamiento:** Comunicación por puertos internos no expuestos a internet.
