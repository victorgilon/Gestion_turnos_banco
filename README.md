# BEVS TurnoBank - asignacion y gestion de turnos

# Arquityectura del sistema
Arquitectura modelo vista controlador (MVC)

## Problema que resuelve
Resuelve principalmente el problema de la organizacio y la atencion eficiente de servicios donde hay bastante flujo de gente

## que pasaria si no existiera
Generaria varios inconvenientes y confusion en el orden de atencion y a la vez una mala experiencia como para el usuario y los trabajadores

## ¿Qué funciones principales tiene el sistema?
las funciones serian las siguientes, crear, actualizar, ver y elimar turnos, tambien la autenticaion de acceso

## ¿Qué partes pueden trabajar por separado?
el parte de autenticacion registro, login y autenticacion

## ¿Qué procesos son independientes?
la autenticacion de  autenticacion login y validacion

## ¿Qué servicio necesita información de otro?
En el servicio de gestion de turno depende del servicio de autenticación ya que necesita del JWT para poder identificar el usuario y a su vez el rol

## ¿Quién solicita datos?
usuario solicita - Gestion turno - JWT

## ¿Quién responde?
JWT - Gestion turno - usuario solicita

## Tipo de arquitectura
MicroServicios

## ¿Cuántos usuarios tendrá el sistema?
100 usuarios

## ¿Necesita escalar?
si, ya que deberia de poder soportar mas cosas

## ¿Es un sistema pequeño o grande?
mediano

## ¿Qué información debe guardarse?
- nombreUsuario
- Rol
- email
- password
- sucursal
- fecha
- hora

## ¿Qué datos son críticos?
identificador de usuario JWT

## ¿Qué pasaría si se pierden?
El sistema no podria validar usuario ni roles

## ¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?
cada una usa la suya

### ¿Quién usará el sistema?
admin
moderador
usuario

## ¿Todos pueden hacer lo mismo?
no, ya que tanto usuario solo puede gestionar su turno, en cambio el moderador puede llamar turnos y admin mas privilegios

## ¿Qué pasaría si falla
Si llegara a fallar el sistema no podria guardar ni consultar informacion de los usuarios

## Posibles soluciones


## Acerca del proyecto

"BEVS TurnoBank" es una aplicacion web que permite a los clientes de un servicio, ofrecido por parte del banco para la reserva de turno, edicion y cancelacion.
Asimismo, permite su gestion desde un rol de cliente y administrador

## Stack de tecnologías utilizadas

#### Back End:
Node.js
express
JWT

#### Front End:
html
css
javaScript

#### Base de datos:
MongoDb Atlas

## Configuración
