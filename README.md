# BEVS TurnoBank - asignacion y gestion de turnos

## problema que resuelve
Este proyecto se centra en el manejo de turnos en  los bancos, ya que estos tradicionalmente se han basado en sistemas locales o procesos manuales los cuales son sistemas que no tienen flexibilidad, la falta de una arquitectura robusta hace que estos sistemas sean vulnerables a fallos de red.
con un sistema distribuido de gestion y asiganacion de turnos que permite la sincronizacion en tiempo real de todas las sucursales facilita el proceso de atencion de los clientes sin que hallan filas interminables

## Roles dentro del equipo asignados
-usuario 
-administrador

## Acceso al repositorio en GitHub

## PARTE 1 — ENTENDER EL PROBLEMA
#### ¿Qué problema resuelve el sistema?
-resuelve la ineficiencia en la gestion de turnos de los bancos 

#### ¿Quién lo usará?
-cliente
-empleados 
-administrador

#### ¿Qué pasaría si no existiera?
- se seguiria con el mismo sistema tradicional, el cual causa largas filas y frustracion en los clientes 

## PARTE 2 – IDENTIFICAR LOS SERVICIOS
#### ¿Qué funciones principales tiene el sistema?
- Generación y asignación de turnos
- Administración de sucursales
- Control del estado de los turnos

#### ¿Qué partes pueden trabajar por separado?
- Servicio de gestión de turnos
- Servicio de gestión de usuarios
- Servicio de sucursales 
#### ¿Qué procesos son independientes?
- Creación de un turno
- Actualización del estado de un turno
- Monitoreo del sistema

## PARTE 3 – ¿CÓMO SE COMUNICAN?
#### ¿Qué servicio necesita información de otro?
1) Servicio de Turnos necesita datos de:
- Sucursales (disponibilidad)
- Usuarios (datos del cliente)

2) Servicio de Reportes necesita datos de:
- Turnos (historial)
- Usuarios (actividad)

3) Servicio de Notificaciones necesita datos de:
- Turnos (estado del turno)
- Usuarios (contacto)

4) Panel de Atención necesita datos de:
- Turnos (siguiente cliente)
  
#### ¿Quién solicita datos?
- Turnos → solicita disponibilidad y datos de usuario
- Usuarios → solicita creación y consulta de turnos
- Reportes → solicita información histórica
- Panel de atención → solicita el siguiente turno
  
#### ¿Quién responde?
- Autenticación → responde validaciones de acceso
- Sucursales → responde disponibilidad
- Turnos → responde estado y datos de turnos
- Usuarios → responde información de clientes

## PARTE 4 – ELEGIR LA ARQUITECTURA -- EL TIPO DE ARQUITECTURA ES HIBRIDA 
#### ¿Cuántos usuarios tendrá el sistema?
- TENDRIA CIENTOS O MILES DE CLIENTES EN HORAS PICO
  
#### ¿Necesita escalar?
- SI PORQUE SE PODRIAN CREAR NUEVAS SUCURSALES Y NUEVOS SERVICIOS
  
#### ¿Es un sistema pequeño o grande?
- MEDIANO A GRANDE POR QUE MANEJA VARIAS SUCURSALES, MANEJA MULTIPLES MODULOS DEBE TENER ALTA DISPONIBILIDAD Y LA CRECIENTE ENTRADA DE CLIENTES
  
## PARTE 5 – BASE DE DATOS
#### ¿Qué información debe guardarse?
- SE DEBEN GUARDAR LOS DATOS DE LOS USUARIOS, TURNOS, SUCURSALES, HISTORIAL, NOTIFICACIONES DENTRO DE ESTOS LOS DATOS A GUARDAR ESTAN: NOMBRES, DOCUMENTO, CONTACTO, NUMERO DE TURNO, ESTADO, HORA CREACION-ATENCION, SUCURSAL ASIGNADA, UBICACION, REGISTRO DE TURNOS, MENSAJES ENVIADOS FECHA Y HORA.
  
#### ¿Qué datos son críticos?
- TURNOS ACTIVOS
- ESTADO DE ATENCION
- HISTORIAL DE TRANSACCIONES
- CONFIGURACION DE SUCURSALES
- CREDENCIALES DE USUARIO
  
#### ¿Qué pasaría si se pierden?
- SE PERDERIAN TURNOS ASIGNADOS
- SE DESORGANIZARIA LA ATENCION EN SUCURSALES
- NO HABRIA REGISTRO HISTORICOS
- SE AFECTARIA LA CONFIANZA DEL CLIENTE
  
#### ¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?
- CADA SERVICIO TIENE SU PROPIA BASE DE DATOS, YA QUE REDUCE DEPENDENCIA ENTRE SERVICIOS , AUMENTA SEGURIDAD MEJORA ESCALABILIDAD Y PERMITE USAR DISTINTOS MOTORES DE BASES DE DATOS SEGUN LA NESECIDAD


