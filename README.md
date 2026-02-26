
# BEVS TurnoBank - asignacion y gestion de turnos

## Acerca del proyecto

"BEVS TurnoBank" es una aplicacion web que permite a los clientes de un servicio, 
ofrecido por parte del banco para la reserva de turno, edicion y cancelacion. Asimismo
, permite su gestion desde un rol de cliente y administrador.

#### ¿Qué problema resuelve el sistema?

Los problemas que resuelve es la Reduccion de tiempo de espera,
la mejora en la organizacion y gestion de la fila, la parte de mayor eficiencia en la atencion al cliente, tambien la reduccion del estres y la frustractacion de clientes.

### ¿Quién lo usará?

El sistema sera utilizado por:
 - clientes del banco: para solicitar los servicios como los depositos, retiros, pagos.
 - Empleados de banco: es la parte para atender a los clientes y gestionar los turnos.
-  Administradores del banco: para configurar y gestionar el sistema de turnos.

### ¿Qué pasaría si no existiera?

Si no existiera el sistema de gestion de turnos, lo probable seria:
 - habrian largas filas y tambien el tiempo de espera
-  la atencion del cliente seria ineficiente
  -  la parte de los empleados del banco estarian sobrecargados, los clientes se sentirian frustados

## IDENTIFICAR LOS SERVICIOS

## ¿Qué funciones principales tiene el sistema?

Las funciones del sistema son:
-  Registro: para que los clientes se registren y obtengan su turno
-  Atencion: Es la parte en que los empleados del banco van a atender al cliente.

## ¿Qué partes pueden trabajar por separado?

Las partes que pueden trabajar por separado son el sistema de usuarios, el modulo de gestion de turnos y el area de atencion al cliente. Cada uno cumple una funcion diferente y puede funcionar de manera independiente sin afectar directamente a los demas.

## ¿Qué procesos son independientes?

Los procesos independientes suelen ser registro del cliente, asignacion de turnos, atencion al cliente.

## CÓMO SE COMUNICAN

## ¿Qué servicio necesita información de otro?

El servicio de pagos o atencion al cliente responde enviando la informacion solicitada para completar el proceso correctamente.

## ¿Quién solicita datos?

El servicio de turnos es quien solicita los datos cuando necesita confirmar informacion del usuario.

## ¿Quién responde?

El servicio de pagos o atencion al cliente responde enviando la informacion solicitada para completar el proceso correctamente.
## ELEGIR LA ARQUITECTURA

## Tipo de Arquitectura:
MicroServicios: El sistema se divide en servicios pequeños e independientes, donde cada uno cumple una funcion especifica.

## ¿Cuántos usuarios tendrá el sistema?
100
## ¿Necesita escalar?

Si, necesita escalar para soportar mas usuarios y turnos sin que el sistema se vuelva lento o falle.
## ¿Es un sistema pequeño o grande?
Es pequeño.
## BASE DE DATOS

## ¿Qué información debe guardarse?

* informacion del turno (numero de turno, fecha, hora del servicio)
* estado de turno (pendiente, proceso, atentido)

## ¿Qué datos son críticos?

Es el identificador de usuario JWT, ya que nos permite autentificar al usuario y tambien validar los permisos, poder asegurar que solo se puede acceder a las funciones correspondientes a su rol.

## ¿Qué pasaría si se pierden?

Un token de autenticacion es un codigo de seguridad que identifica al usuario cuando inicia sesion y permite al sistema verificar sus permisos dentro de la aplicacion.

### Pregunta clave:

¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?

En este sistema, cada servicio tiene su propia base de datos. Esto permite que funcionen de manera independiente, facilita el crecimiento del sistema y reduce el impacto de posibles fallos, ya que si un servicio presenta un problema, los demas no se ven afectados directamente.

## FALLAS Y RIESGOS

## ¿Quién usará el sistema?

El sistema sera utilizado por tres tipos de usuarios:
-  Administrador
-  Moderador
- usuario

## ¿Todos pueden hacer lo mismo?

No, cada rol tiene funciones diferentes. El usuario solo puede gestionar su propio turno. El moderador puede administrar y llamar turnos. El administrador tiene control total del sistema y de los usuarios.

## Pensar como ingenieros reales
## ¿Qué pasaría si falla?
Servicio de pagos: No se podrían confirmar los pagos ni completar algunas operaciones.
Base de datos: No se podría guardar ni consultar información de turnos o usuarios.
Servidor principal: El sistema dejaría de funcionar temporalmente.

## Escriban posibles soluciones:
Reintentos: Intentar nuevamente la operación cuando falle.
Notificaciones: Avisar al usuario cuando ocurra un error.
Respaldo de datos: Tener copias de seguridad para recuperar la información en caso de fallos.

## Stack de tecnologias utilizadas
Back End:
Node.js express JWT

Front End:
html css javaScript

Base de datos:
MongoDb Atlas
