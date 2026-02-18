# BEVS TurnoBank - asignacion y gestion de turnos

## Acerca del proyecto

"BEVS TurnoBank" es una aplicacion web que permite a los clientes de un servicio, ofrecido por parte del banco para la reserva de turno, edicion y cancelacion.
Asimismo, permite su gestion desde un rol de cliente y administrador



####  ¿Qué problema resuelve el sistema?
Los problemas que resuelve es la Reduccion de tiempo de espera,le mejora en la organizacion y gestion de la fila
la parte de mayor eficiencia en la atencion al cliente tambien la reduccion del estres y la frustractacion de clientes.
### ¿Quién lo usará?
El sistema sera utilizado por :
- clientes del banco :para solicitar los servicios como los depositos,restiros,pagos.
- Empleados de banco: es la parte para atender a los clientes y gestionar los turnos.
- Administradores del banco:para configurar y gestionar el sistema de turnos
  
 ### ¿Qué pasaría si no existiera?
 si no existiera el sistema de gestion de turnos, lo probable seria:
 - habrian largas filas y tambien el tiempo de espera
 - la atencion del cliente seria ineficiente
 - la parte de los empleados del banco estarian sobrecargados, los clientes se sentirian frustados


## IDENTIFICAR LOS SERVICIOS
## ¿Qué funciones principales tiene el sistema?
las funciones  del sistema son:
- Registro: para que  los clientes se registren y obtengan su turno
- Atencion: Es la parte en que los emplados del banco van a atender al cliente.
- Pagos:Para la parte de pagos de prestamos
## ¿Qué partes pueden trabajar por separado?

## ¿Qué procesos son independientes?
los procesos independientes suelen ser registro del cliente, asignacion de turnos,atencion al cliente y el proceso de pagos.

## CÓMO SE COMUNICAN
## ¿Qué servicio necesita información de otro?
## ¿Quién solicita datos?
- Cliente,los pagos 
## ¿Quién responde?
turnos, atencion al cliente 

## ELEGIR LA ARQUITECTURA
 ## ¿Cuántos usuarios tendrá el sistema?
 100
##  ¿Necesita escalar?
## ¿Es un sistema pequeño o grande?
es pequeño 

## BASE DE DATOS
## ¿Qué información debe guardarse?
- informacion  del turno(numero de turno,fecha,hora del servicio)
- estado de turno(pendiente,proceso,atentido)
##  ¿Qué datos son críticos?
- numero de turno y el estado actual de turno

## ¿Qué pasaría si se pierden?
- Desorganizacion en la atencion al cliente
- perdida y control sobre el turno

## Tipo de Arquitectura:



  ## Stack de tecnologías utilizadas
#### Back End:
- Node js Express
### Front End :
 - html
 - css
 - javaScript

## Configuración
