TALLER PRÁCTICO – NIVEL INTERMEDIO
Sistemas Distribuidos – Diseño e Integración con Docker Compose

1. Objetivo
Diseñar e implementar un sistema distribuido básico utilizando Docker Compose, comprendiendo la relación entre servicios y su comunicación.
2. Fase de diseño del sistema
1 Definir el tipo de sistema (ejemplo: e-commerce, app de domicilios, plataforma educativa)
El sistema desarrollado corresponde a una aplicación web de gestión de tareas, cuyo propósito es permitir a los usuarios crear, consultar, actualizar y eliminar tareas de manera eficiente.
Este sistema se clasifica como una plataforma de productividad, ya que facilita la organización de actividades personales y académicas.

2 Identificar mínimo tres servicios (frontend, backend, base de datos)
El sistema está compuesto por los siguientes servicios:
Frontend: Es la interfaz gráfica a través de la cual los usuarios interactúan con el sistema.
Backend: Se encarga de procesar la lógica del negocio, gestionar las solicitudes y coordinar la comunicación con la base de datos.
Base de datos: Almacena la información de las tareas. Para este sistema se utiliza MongoDB.

3 Describir cómo se comunican
Los servicios se comunican de la siguiente manera:
El frontend envía solicitudes HTTP (GET, POST, PUT, DELETE) al backend.
El backend procesa las solicitudes y se comunica con la base de datos MongoDB para almacenar o consultar información.
La base de datos responde al backend con los datos requeridos.
Finalmente, el backend envía la respuesta al frontend para que sea visualizada por el usuario.
Esta comunicación se gestiona mediante contenedores utilizando Docker y su orquestación con Docker Compose.

4 Indicar qué ocurre si un servicio falla
•	Si falla el frontend, los usuarios no podrán interactuar con el sistema, aunque los demás servicios continúan funcionando.
•	Si falla el backend, el sistema no podrá procesar solicitudes, impidiendo la comunicación entre el frontend y la base de datos.
•	Si falla la base de datos, no será posible almacenar ni recuperar información, afectando directamente el funcionamiento del backend.
El uso de Docker permite aislar los servicios, facilitando su reinicio independiente y mejorando la disponibilidad del sistema.

3. Implementación con Docker Compose
Archivo base:
version: '3'
services:
web:
image: nginx
ports:
- "8080:80"
Completar el archivo agregando al menos un servicio adicional.}

4. Análisis
1 ¿Cuál es el rol de cada servicio?
En el sistema de gestión de tareas se identifican tres servicios principales:
Frontend: Se encarga de mostrar la interfaz al usuario, permitiendo la visualización del sistema a través del navegador. En este caso, utiliza un servidor web básico con Nginx.
Backend: Gestiona la lógica del sistema, procesa las solicitudes del usuario (crear, consultar tareas) y actúa como intermediario entre el frontend y la base de datos.
Base de datos: Almacena la información de las tareas. Se utiliza MongoDB para guardar los datos de forma persistente.

2 ¿Qué ventajas tiene dividir el sistema?
Dividir el sistema en varios servicios presenta diversas ventajas:
•	Escalabilidad: Cada servicio puede crecer de manera independiente según la demanda.
•	Mantenimiento: Es más fácil detectar y corregir errores en un servicio específico sin afectar todo el sistema.
•	Flexibilidad: Permite usar diferentes tecnologías en cada servicio (por ejemplo, Node.js en el backend y MongoDB en la base de datos).
•	Reutilización: Los servicios pueden ser utilizados en otros proyectos o ampliaciones futuras.
El uso de contenedores con Docker facilita esta separación y gestión

3 ¿Cómo se comunican los contenedores?
Los contenedores se comunican a través de una red interna creada automáticamente por Docker Compose.
•	Cada servicio puede acceder a otro utilizando su nombre como si fuera un host (por ejemplo, el backend se conecta a MongoDB usando mongodb).
•	El backend envía y recibe datos de la base de datos mediante una URL de conexión interna.
•	El frontend realiza solicitudes HTTP al backend para obtener o enviar información.
Este tipo de comunicación permite que los servicios trabajen de forma integrada dentro de un entorno distribuido.

5. Exploración para la siguiente clase
Agregar un servicio de base de datos (MySQL o MongoDB) en el archivo docker-compose.yml. No es
necesario que funcione completamente, pero debe definirse correctamente el servicio.
1 Investigar cómo definir variables de entorno
Las variables de entorno son valores que se configuran fuera del código y se utilizan para manejar información importante de la aplicación, como la conexión a la base de datos, direcciones o configuraciones del sistema.
En un proyecto con Docker, estas variables se definen en el archivo de configuración del contenedor y luego el backend las utiliza para funcionar correctamente sin necesidad de modificar el código directamente. Esto hace que la aplicación sea más flexible, segura y fácil de adaptar a diferentes entornos.
MONGO_URL: Conecta el backend con la base de datos MongoDB.
MONGO_INITDB_DATABASE: Crea automáticamente la base de datos al iniciar.

2 Buscar cómo conectar un backend con una base de datos
Para conectar un backend con una base de datos se utiliza una librería, en este caso Mongoose para trabajar con MongoDB. Primero se define una URL de conexión que indica dónde está la base de datos. Luego el backend se conecta a través de esa URL. Si la conexión es exitosa, se pueden definir modelos de datos y realizar operaciones como crear, consultar, actualizar y eliminar información (CRUD).
•	Primero, se levanta la base de datos MongoDB usando Docker, lo que permite que funcione como un servicio independiente dentro del sistema.
•	Luego, se define una variable de entorno que contiene la dirección de la base de datos. Esta dirección le indica al backend dónde debe conectarse.
•	Después, el backend (Node.js) utiliza Mongoose para conectarse a MongoDB usando esa dirección. Si la conexión es exitosa, el sistema puede empezar a trabajar con los datos.
•	A continuación, se crea un modelo de datos llamado “Tarea”, que define cómo se guardará la información, por ejemplo, el título y la descripción.
•	Finalmente, se crean las rutas del backend que permiten realizar las acciones principales: crear, consultar, actualizar y eliminar tareas. Estas operaciones permiten que el usuario interactúe con el sistema y que la información se guarde correctamente en la base de datos.

3 Identificar posibles errores de conexión
Posibles errores de conexión
•	Base de datos no iniciada: MongoDB no ha terminado de arrancar cuando el backend intenta conectarse, por lo que la conexión falla.
•	URL de conexión incorrecta: Si la dirección (nombre del servicio, puerto o base de datos) está mal escrita, el backend no encuentra MongoDB.
•	Problemas en Docker Compose: Si el backend inicia antes que la base de datos (por mala configuración), no logra conectarse.
•	Puerto incorrecto u ocupado: Si el puerto está mal configurado o ya está en uso, no se puede acceder al servicio.
•	Errores en el backend: Fallos en el código (por ejemplo en Mongoose) pueden impedir la conexión o hacer que el servidor se caiga.

Errores que se tuvieron en el proyecto
•	El backend se apagaba (exited): El contenedor no se mantenía activo porque no estaba ejecutando correctamente el servidor (app.js).
•	Error “ERR_CONNECTION_REFUSED”: El frontend no podía conectarse porque el backend estaba apagado.
•	Problemas con los puertos: Los puertos 3000 y 8080 estaban ocupados, por lo que se cambiaron a 4000 y 8081.
•	Configuración incorrecta en Dockerfile: Faltaba ejecutar el comando para iniciar el servidor (node app.js o npm start).
•	Problemas iniciales de conexión a MongoDB: El backend no lograba conectarse correctamente hasta ajustar la URL y la configuración.

6. Entregables
1 Archivo docker-compose.yml
version: '3.8'

services:
  frontend:
    image: nginx
    container_name: frontend_app
    ports:
      - "8081:80"
    volumes:
      - ${PWD}/frontend:/usr/share/nginx/html
    depends_on:
      - backend

  backend:
    build: ./backend
    container_name: backend_app
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URL=mongodb://mongodb:27017/tareas_db

  mongodb:
    image: mongo
    container_name: mongo_db
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=tareas_db

2 Diseño del sistema
El sistema de gestión de tareas está compuesto por tres servicios principales que trabajan de forma distribuida mediante contenedores Docker.
El frontend se encarga de mostrar la interfaz al usuario a través del navegador. Este servicio utiliza Nginx para servir los archivos HTML y JavaScript, permitiendo al usuario interactuar con el sistema, como crear, consultar, actualizar y eliminar tareas.
El backend está desarrollado con Node.js y Express, y es responsable de manejar la lógica del sistema. Recibe las solicitudes del frontend, procesa la información y se comunica con la base de datos. Además, expone una API que permite realizar operaciones CRUD sobre las tareas.
La base de datos utiliza MongoDB, donde se almacenan de manera persistente todas las tareas. Este servicio funciona de manera independiente y es accedido por el backend mediante una conexión definida por variables de entorno.
La comunicación entre los servicios se realiza a través de la red interna de Docker Compose. El frontend envía solicitudes HTTP al backend, y el backend se conecta a MongoDB utilizando la URL de conexión configurada.

3 Respuestas del análisis
1: Rol de cada servicio
Frontend: muestra la interfaz al usuario
Backend: procesa la lógica y las solicitudes
Base de datos: almacena las tareas

2: Ventajas de dividir el sistema
Mejor organización
Fácil mantenimiento
Mayor escalabilidad

3: Comunicación entre contenedores
Se comunican por la red interna de Docker
Usan el nombre de los servicios
Se conectan mediante solicitudes HTTP


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