## SISTEMA DISTRIBUIDO DE GESTIÓN DE TURNOS (EPS, BANCOS)

## ENTENDER EL PROBLEMA

# ¿Qué problema resuelve el sistema?
Este sistema resuelve el desorden y las largas filas en lugares como EPS o bancos.

# ¿Quién lo usará?
los clientes que necesitan un turno y también los empleados que atienden en las ventanillas.

# ¿Qué pasaría si no existiera?
Sin el sistema habría desorden, discusiones por el turno, más tiempo de espera y mala organización en la atención.

## IDENTIFICAR LOS SERVICIOS

# ¿Qué funciones principales tiene el sistema?
- Registro: Es cuando el cliente llega y solicita su turno. El sistema genera automáticamente un número y lo guarda para que quede en la fila de espera.
- Atención: Es el momento en que el empleado llama al número correspondiente y atiende al cliente según el servicio que necesite.
- Cierre:  Es cuando termina la atención y el sistema marca el turno como finalizado, guardando el registro de que ya fue atendido.

# ¿Qué partes pueden trabajar por separado?
Las partes que pueden trabajar por separado son el registro, la atención y el cierre del turno. Cada una cumple su función de manera independiente, una genera el turno, otra atiende al cliente y la última finaliza el proceso.

# ¿Qué procesos son independientes?
Los procesos independientes son el registro del turno, la atención y el cierre. Cada uno puede ejecutarse por separado


## CÓMO SE COMUNICAN

# ¿Qué servicio necesita información de otro?
El servicio de atención necesita información del registro para saber qué turnos están en espera. El cierre necesita información de la atención.

# ¿Quién solicita datos?
El servicio de atención solicita la lista de turnos pendientes al servicio de registro.
El servicio de cierre solicita los datos del turno que está siendo atendido.

# ¿Quién responde?
El servicio de registro responde enviando los turnos en espera.
El servicio de atención responde confirmando qué turno fue atendido para que el servicio de cierre lo marque como finalizado.


## ELEGIR LA ARQUITECTURA

# Arquitectura
Microservicios, porque cada módulo (registro, atención y cierre) funciona de manera independiente. Esto permite que el sistema sea más flexible y que, si un servicio falla, los demás sigan funcionando

# ¿Cuántos usuarios tendrá el sistema?
El sistema será usado por varias personas al mismo tiempo, como los clientes que solicitan turno y los empleados que están atendiendo en las ventanillas y estos daran un  cierre a la solicitud atendida.

# ¿Necesita escalar?
Sí, con el tiempo sí necesitará escalar, ya que podría aumentar la cantidad de usuarios, como más clientes solicitando turnos o más empleados atendiendo. Además, también podría requerir mejoras y actualizaciones de seguridad para adaptarse a nuevas necesidades o a un uso más grande.

# ¿Es un sistema pequeño o grande?
Es un sistema pequeño, ya que por ahora solo incluye funciones básicas como registro, atención y cierre de turnos. Sin embargo, en el futuro podría crecer y volverse más grande, agregando más funcionalidades, más usuarios y nuevas mejoras según las necesidades.

# Justificación
Elegí la arquitectura Microservicios porque permite que el sistema sea más organizado y flexible. Cada módulo puede funcionar de manera independiente, lo que facilita su mantenimiento y futuras mejoras.


## BASE DE DATOS

# ¿Qué información debe guardarse?
- Número del turno generado.
- Fecha y hora en que se creó el turno.
- Tipo de servicio solicitado.
- Datos del empleado que atiende.
- Estado del turno (pendiente, en atención o finalizado).
- Historial de las atenciones realizadas.
- Estado de turno (abierto o cerrado).

# ¿Qué datos son críticos?
Los datos más críticos son el número del turno, el estado del turno y el registro de atención. También es importante guardar correctamente qué empleado atendió cada turno y en qué momento, porque eso permite llevar control adecuado en el banco.

# ¿Qué pasaría si se pierden?
Si se pierden los datos, habría desorden en la atención, se repetirían turnos y no se sabría quién ya fue atendido. Esto generaría confusión y afectaría la organización y la confianza en el sistema.

# ¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?
En una arquitectura de microservicios, en general cada servicio tiene su propia base de datos. Esto permite que funcionen de manera independiente, que sean más seguros y que si uno falla no afecte completamente a los demás.

## FALLAS Y RIESGOS

# ¿Quién usará el sistema?
- Cliente: Es la persona que solicita el turno.
- Empleado: Es quien llama y atiende los turnos en ventanilla.
- Administrador: Es quien supervisa el sistema

# ¿Todos pueden hacer lo mismo?
No todos pueden hacer lo mismo. Cada usuario tiene un rol diferente dentro del sistema. El cliente solo puede generar su turno, el empleado se encarga de llamar y cerrar los turnos, y el administrador tiene acceso a configuraciones y reportes.


## FALLAS Y RIESGOS

# ¿Qué pasaría si falla el servicio de pagos?
No se podrían procesar los cobros y algunos turnos quedarían pendientes.

# ¿Qué pasaría si falla la base de datos?
No se podrían guardar ni consultar los turnos.

# ¿Qué pasaría si falla el servidor principal?
El sistema dejaría de funcionar temporalmente y se detendría la atención a los usuaros del banco.

# Soluciones más comunes ante fallas
- Reintentos automáticos: para que el sistema vuelva a intentar cuando haya un error de conexión.
- Notificaciones al administrador: para avisar cuando algo falle.
- Respaldo de datos: hacer copias de seguridad para no perder la información.
- Servidor de respaldo: en caso de que el principal deje de funcionar.
- Registro de errores: para identificar y corregir problemas.


## TECNOLOGÍAS UTILIZADAS

# Back End
- Node.js: Entorno que permite ejecutar JavaScript en el servidor.
- Express.js: Framework para crear la API y manejar las rutas del sistema.

# Front End
- HTML: Estructura de las páginas del sistema.
- CSS: Diseño y apariencia visual.

# Base de Datos
MongoDB Atlas:Base de datos en la nube que almacena los turnos, usuarios, estados y el historial del sistema.






















