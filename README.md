# BEVS TurnoBank - asignacion y gestion de turnos

# Arquityectura del sistema
Arquitectura modelo vista controlador (MVC)

## Problema que resuelve
Resuelve principalmente el problema de la organizacio y la atencion eficiente de servicios donde hay bastante flujo de gente

## que pasaria si no existiera
Generaria varios inconvenientes y confusion en el orden de atencion y a la vez una mala experiencia como para el usuario y los trabajadores

## ¿Qué funciones principales tiene el sistema?
las funciones serian las siguientes, crear, actualizar, ver y elimar turnos, tambien 

## ¿Qué partes pueden trabajar por separado?

## ¿Qué procesos son independientes?

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
