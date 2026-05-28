# BEVS TurnoBank - asignacion y gestion de turnos

## Acerca del proyecto

"BEVS TurnoBank" es una aplicación web que permite a los clientes de un servicio, ofrecido por parte del banco para la reserva de turnos, su edición y cancelación. Asimismo, permite su gestión desde un rol de cliente y administrador.

## Arquitectura del sistema

El sistema utiliza un enfoque mixto:

- **Tipo de arquitectura global:** MicroServicios.
- **Arquitectura interna de los servicios:** Modelo Vista Controlador (MVC).

## Análisis y Definición del Sistema

### Problema que resuelve

Resuelve principalmente el problema de la organización y la atención eficiente de servicios donde hay bastante flujo de gente.

### ¿Qué pasaría si no existiera?

Generaría varios inconvenientes y confusión en el orden de atención y, a la vez, una mala experiencia tanto para el usuario como para los trabajadores.

### ¿Qué funciones principales tiene el sistema?

Las funciones principales serían las siguientes: crear, actualizar, ver y eliminar turnos, y también la autenticación de acceso.

### ¿Qué partes pueden trabajar por separado y qué procesos son independientes?

- Las partes que pueden trabajar por separado son el registro, login y autenticación.
- Los procesos totalmente independientes son el login y la validación de autenticación.

### ¿Qué servicio necesita información de otro?

El servicio de gestión de turnos depende del servicio de autenticación, ya que necesita del JWT para poder identificar al usuario y a su vez el rol.

### Flujo de datos (Peticiones)

- **¿Quién solicita datos?:** usuario solicita -> Gestion turno -> JWT
- **¿Quién responde?:** JWT -> Gestion turno -> usuario solicita

### Dimensionamiento y Escalabilidad

- **¿Es un sistema pequeño o grande?** Es un sistema mediano.
- **¿Cuántos usuarios tendrá el sistema?** 100 usuarios.
- **¿Necesita escalar?** Sí, ya que debería de poder soportar más cosas.

### Gestión de Datos

- **¿Qué información debe guardarse?** - nombreUsuario
    - Rol
    - email
    - password
    - sucursal
    - fecha
    - hora
- **¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?** Cada uno usa la suya.
- **¿Qué datos son críticos?** El identificador de usuario JWT.
- **¿Qué pasaría si se pierden?** El sistema no podría validar usuarios ni roles.

### Usuarios y Roles

- **¿Quién usará el sistema?** - admin
    - moderador
    - usuario
- **¿Todos pueden hacer lo mismo?** No, ya que el usuario solo puede gestionar su turno, en cambio el moderador puede llamar turnos y el admin tiene más privilegios.

### Tolerancia a fallos

- **¿Qué pasaría si falla?** Si llegara a fallar el sistema no podría guardar ni consultar información de los usuarios.

### Posibles soluciones

_(Sección pendiente de definir según los planes de contingencia del proyecto)_

---

## Stack de tecnologías utilizadas

#### Back End:

- Node.js
- express
- JWT

#### Front End:

- html
- css
- javaScript

#### Base de datos:

- MongoDb Atlas

#### Arquitectura y comunicación

- Docker
- Docker Compose
- RabbitMQ
- Microservicios
- Arquitectura MVC

## Configuración

_(Instrucciones de despliegue y configuración pendientes)_

## Instrucciones de ejecución

### 1. Ubicarse en la carpeta principal del proyecto

Abrir una terminal y dirigirse a la carpeta raíz del proyecto:

```bash
cd GESTION_TURNOS_BANCO
```

---

### 2. Verificar que exista el archivo docker-compose.yml

Ejecutar el siguiente comando:

```bash
ls
```

Debe aparecer un archivo similar a:

```txt
docker-compose.yml
```

---

### 3. Construir y levantar los contenedores

Ejecutar el siguiente comando:

```bash
docker compose up --build
```

Este comando:

- Construye las imágenes Docker de cada servicio.
- Levanta los contenedores del frontend y backend.
- Inicia RabbitMQ y la comunicación entre microservicios.

---

### 4. Acceder al sistema

Una vez iniciado el proyecto, acceder desde el navegador a:

#### Frontend

```txt
http://localhost:8080
```

#### API Gateway

```txt
http://localhost:3000
```

#### Panel de administración RabbitMQ

```txt
http://localhost:15672
```

---

### 5. Detener el sistema

Para detener todos los contenedores ejecutar:

```bash
docker compose down
```

# Circuit Breaker

## Servicio funcionando

El API Gateway se comunica normalmente con los microservicios y las solicitudes son procesadas correctamente.

```txt
Frontend → API Gateway → Microservicio
```

---

## Servicio caído

Cuando un microservicio falla o no responde, las solicitudes comienzan a generar errores.

```txt
Frontend → API Gateway → Servicio caído
```

---

## Circuito abierto

Después de varios fallos, el sistema bloquea temporalmente las solicitudes hacia el servicio afectado para evitar sobrecarga.

```txt
Frontend → API Gateway ✖ Servicio bloqueado
```

---

## Recuperación (Half-Open)

Después de un tiempo de espera, el Circuit Breaker pasa al estado **Half-Open**, donde permite algunas solicitudes de prueba al servicio.

Si el servicio responde correctamente, el circuito se cierra nuevamente y la comunicación vuelve a funcionar con normalidad.

```txt
Frontend → API Gateway → Servicio recuperado
```

# Monitoreo básico

El sistema implementa monitoreo básico para verificar el funcionamiento de los microservicios y detectar posibles fallos.

Se incluyen:

- Logs funcionales para registrar eventos y errores.
- Health checks para validar el estado de los servicios.
- Monitoreo de disponibilidad, latencia y cantidad de errores en las solicitudes.
