FASE 1 – OBSERVAR (sin modificar código)

Figura 1. Código fuente completo del Gateway para el servicio de mascotas con manejo de errores y circuit breaker
<img width="664" height="394" alt="image" src="https://github.com/user-attachments/assets/1af6c337-3192-477b-bb70-2e5b2e11ec7f" />
Nota: La figura presenta el código completo del Gateway implementado para el servicio de mascotas. En este código se incluyen mecanismos de registro de eventos (logs), manejo de errores y la implementación del patrón circuit breaker, utilizado para proteger el sistema ante fallos o indisponibilidad del backend.


Figura 2. Contenedor del servicio backend detenido dentro del entorno Docker
<img width="457" height="336" alt="image" src="https://github.com/user-attachments/assets/da3c2db1-4540-4ab2-b94e-c595f1399451" />
Nota: La figura muestra el estado de los contenedores del sistema en Docker, donde se evidencia que el servicio backend se encuentra apagado o detenido. Esta situación permite realizar pruebas de manejo de errores y verificar el funcionamiento del Gateway ante la indisponibilidad del backend.

Figura 3. Peticiones realizadas desde el navegador al Gateway mientras el backend se encuentra apagado
<img width="806" height="195" alt="image" src="https://github.com/user-attachments/assets/a5021b86-2e64-42ea-82b8-e38f08ec9269" />
Nota: La figura muestra varias solicitudes realizadas desde el navegador hacia el Gateway a través del endpoint de mascotas. Debido a que el servicio backend se encuentra apagado, el sistema responde con un mensaje de error indicando que el servicio no está disponible, permitiendo evidenciar el funcionamiento del manejo de errores y del mecanismo circuit breaker.

Figura 4. Bloqueo temporal del servicio después de varias peticiones realizadas al Gateway
<img width="681" height="216" alt="image" src="https://github.com/user-attachments/assets/5552487d-3f2c-4a18-a2c8-a5603847247e" />
Nota: En la figura se observa que, después de realizar varias peticiones desde el navegador y no obtener respuesta del backend, el sistema activa automáticamente el mecanismo de bloqueo temporal. Por esta razón, el Gateway muestra el mensaje “Servicio temporalmente bloqueado” y deja de procesar nuevas solicitudes por un momento para proteger el sistema.


Figura 5. Logs generados por el Gateway durante las fallas del servicio de mascotas
<img width="744" height="238" alt="image" src="https://github.com/user-attachments/assets/3036d942-9da0-421c-bd2f-171bf23933f6" />
Nota: En la figura se puede observar que el Gateway intenta conectarse varias veces con el servicio de mascotas, pero como el backend se encuentra apagado, se generan errores 503. Además, en los logs se registran los intentos fallidos (“Fallo número 1”, “Fallo número 2” y “Fallo número 3”) hasta que el sistema activa el “Circuito abierto”. Esto permite evidenciar cómo el Gateway detecta las fallas consecutivas y protege el sistema dejando de realizar más intentos de conexión al servicio caído.

Responder:
•	¿Qué hace el sistema actualmente?
El gateway intenta comunicarse con el servicio de mascotas y, al estar apagado, se generan errores 503. El sistema registra los fallos consecutivos hasta activar el Circuito abierto.

•	¿Se protege o insiste?
Primero el sistema insiste realizando varios intentos de conexión. Después de varios fallos, activa el Circuito abierto y se protege dejando de intentar conectarse al servicio caído.





