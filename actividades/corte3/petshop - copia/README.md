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




FASE 2 – APLICAR (Extensión del Circuit Breaker)

A partir de lo implementado en clase para /mascotas, deben:

•	Aplicar el mismo comportamiento en los demás endpoints del gateway (ej: /usuarios, /resumen u otros que tengan)


• Extensión del circuit breaker a usuarios 

Figura 6. Variable de control del estado del servicio de usuarios

<img width="333" height="159" alt="image" src="https://github.com/user-attachments/assets/376577db-69b9-44c4-9bd1-68980b93afbc" />

Nota: En la figura se muestra la variable `estado_usuarios`, utilizada para controlar el funcionamiento del servicio de usuarios. La propiedad `fallos` almacena la cantidad de errores consecutivos detectados, mientras que `circuito` indica si el servicio se encuentra funcionando normalmente (`False`) o bloqueado temporalmente (`True`) debido a múltiples fallos en la comunicación.


Figura 7. Código implementado en el Gateway para el servicio de usuarios

<img width="438" height="506" alt="image" src="https://github.com/user-attachments/assets/b5eb0dee-7c45-4c4e-afc1-a2289a6decf0" />

Nota: En la figura se muestra el código implementado en el Gateway para el servicio de usuarios. En este código se incluyen logs para registrar los eventos del sistema, manejo de errores y un mecanismo de circuit breaker que permite detectar múltiples fallos consecutivos. Cuando el servicio no responde después de varios intentos, el sistema bloquea temporalmente las solicitudes para evitar más errores y proteger la comunicación entre servicios.


Figura 8. Consulta de información del servicio de usuarios desde el Gateway
<img width="763" height="211" alt="image" src="https://github.com/user-attachments/assets/9daa5f2c-391c-4780-8f86-ddef5c78f1e7" />

Nota: En la figura se observa que el Gateway realiza correctamente la consulta al servicio de usuarios y muestra la información obtenida directamente en el navegador. Esto permite comprobar que la comunicación entre el Gateway y el servicio de usuarios se encuentra funcionando de manera adecuada.


Figura 9. Mensaje de error al intentar consultar el servicio de usuarios
<img width="684" height="219" alt="image" src="https://github.com/user-attachments/assets/2cd59295-d62d-44db-a8c9-3eb536ad0cb5" />

Nota: En la figura se observa que, al encontrarse apagado el contenedor del servicio de usuarios, el Gateway no puede obtener la información solicitada y devuelve un mensaje indicando que el servicio no se encuentra disponible. Esto permite evidenciar el funcionamiento del manejo de errores implementado en el sistema.


Figura 10. Bloqueo temporal del servicio de usuarios después de múltiples solicitudes
<img width="675" height="208" alt="image" src="https://github.com/user-attachments/assets/b417235e-c195-4580-8a6d-e5562208aeed" />

Nota: En la figura se observa que, después de realizar varios intentos de consulta al servicio de usuarios y no obtener respuesta, el sistema activa automáticamente el bloqueo temporal. Por esta razón, el Gateway muestra el mensaje “Servicio bloqueado”, evitando seguir enviando solicitudes al servicio que se encuentra caído.


Figura 11. Análisis de los logs del servicio de usuarios
<img width="921" height="310" alt="image" src="https://github.com/user-attachments/assets/7f634960-f4e6-470d-927d-ae4983974dbb" />

Nota: En la imagen se puede observar cómo el Gateway intenta conectarse varias veces al servicio de usuarios, pero al no recibir respuesta se generan errores HTTP 503. Cada fallo aumenta el contador de errores hasta que, después de varios intentos, el Circuit Breaker se activa y bloquea temporalmente el servicio. Esto permite evitar más solicitudes al servicio caído y ayuda a mantener la estabilidad del sistema.



Endpoint de resumen implementado en el Gateway
Figura 12. Control de estados de los servicios en el Gateway
<img width="303" height="454" alt="image" src="https://github.com/user-attachments/assets/a1fc2133-747e-4856-9df8-2e3efc315852" />

Nota: En la figura se observa un diccionario de Python utilizado para guardar y organizar el estado de los servicios del sistema. Dentro del diccionario llamado `estados` se almacena la información de los servicios de usuarios, mascotas y resumen.
Cada servicio contiene dos variables principales: `fallos`, que registra la cantidad de errores detectados, y `circuito`, que indica si el servicio se encuentra funcionando normalmente (`False`) o bloqueado temporalmente (`True`) debido a múltiples fallos consecutivos.



Figura 13. Código completo del endpoint de resumen implementado en el Gateway
<img width="379" height="636" alt="image" src="https://github.com/user-attachments/assets/0ad7e0df-d846-4fdf-bcca-ae8f5edb8912" />

Nota: En la figura se muestra el código fuente utilizado para el endpoint de resumen dentro del Gateway. Este código fue implementado para consultar la información de los servicios de usuarios y mascotas en un solo endpoint, evitando repetir la misma lógica utilizada en otros servicios. Además, incluye manejo de errores, registros en logs y el mecanismo de Circuit Breaker para controlar los fallos y proteger la estabilidad del sistema.


Figura 14. Llamado al endpoint de resumen desde el navegador
<img width="538" height="700" alt="image" src="https://github.com/user-attachments/assets/94b3de34-c365-441c-8752-ff7ee90d49d3" />

Nota: En la figura se observa el resultado obtenido al realizar la consulta al endpoint de resumen desde el navegador. El Gateway muestra correctamente la información de los servicios de mascotas y usuarios en una sola respuesta, permitiendo verificar que ambos servicios están funcionando y comunicándose correctamente.


Figura 15. Prueba del endpoint de resumen con el servicio de usuarios apagado
<img width="554" height="503" alt="image" src="https://github.com/user-attachments/assets/25631193-ed5f-489e-9803-ca0c7fb88207" />

Nota: En la figura se observa una prueba realizada al endpoint de resumen después de apagar el servicio de usuarios. Como resultado, el sistema sigue mostrando correctamente la información del servicio de mascotas, mientras que en la sección de usuarios aparece el mensaje “Servicio usuarios no disponible”. Esto permite comprobar que el endpoint de resumen continúa funcionando incluso cuando uno de los servicios falla, mostrando únicamente el error correspondiente al servicio que se encuentra caído.


Figura 16. Logs generados durante las pruebas del endpoint de resumen
<img width="768" height="490" alt="image" src="https://github.com/user-attachments/assets/6ead13e7-067b-41d4-bd76-029bcc754302" />

Nota: En la figura se puede observar el comportamiento del endpoint de resumen durante las pruebas realizadas. Inicialmente, el sistema consulta correctamente el servicio de mascotas y responde con un código HTTP 200, indicando que la información fue obtenida correctamente. Posteriormente, se apaga el servicio de usuarios para verificar el manejo de errores, y en los logs se registran varios fallos consecutivos hasta que el sistema activa el bloqueo temporal del servicio. 
A pesar de que el servicio de usuarios se encuentra caído, el endpoint de resumen continúa funcionando y sigue mostrando correctamente la información disponible del servicio de mascotas. Esto permite comprobar que el sistema puede seguir respondiendo parcialmente aun cuando uno de los servicios presenta fallos, garantizando mayor estabilidad durante las pruebas.



Deben analizar y decidir:


•	¿Cada servicio debe tener su propio contador de fallos?

Sí. Cada servicio debe manejar sus propios fallos de manera independiente, porque un microservicio puede presentar errores mientras los demás siguen funcionando correctamente. Esto permite identificar exactamente qué servicio está fallando sin afectar a los otros.


•	¿El circuito debe abrirse de forma independiente por servicio?

Sí. El circuito debe abrirse únicamente para el servicio que está presentando errores. De esta manera, si un endpoint falla varias veces, solo ese servicio se bloquea temporalmente, mientras los demás continúan funcionando con normalidad.


•	¿Qué pasa si falla un servicio pero el otro sigue funcionando?

Si un servicio falla, el sistema no debería detenerse completamente. Los demás servicios deben seguir respondiendo normalmente. Por ejemplo, si falla el servicio de mascotas, el de usuarios puede continuar funcionando y el gateway aún puede responder parcialmente la información disponible.


Nota: No quiero ver el mismo código copiado…quiero ver cómo adaptan la lógica a otros endpoints



FASE 3 – INVESTIGAR (Half-Open)


Cada grupo debe investigar:


•	¿Qué significa “half-open”?

el estado “Half-Open” es un periodo de prueba controlada en el que el sistema deja pasar algunas solicitudes para verificar si el servicio está de nuevo disponible. Si las respuestas son exitosas, el circuito se cierra y el servicio retoma su funcionamiento normal. Si falla, el circuito se abre de nuevo, protegiendo al sistema. Así se evita que se reanude el tráfico sin que el servicio esté listo.


•	¿Cuándo se vuelve a intentar una llamada?

La llamada se vuelve a intentar después de que el circuito ha permanecido abierto durante un tiempo determinado. Este tipo sirve para darle oportunidad al servidor de recuperarse antes de volver a recibir solicitudes. Cuando llega ese momento, el sistema permite una petición de prueba para comprobar el estado del servicio. Si la respuesta es éxito, el circuito breaker considera que el servicio ya está estable y vuelve a estado normal. Esto permite que el sistema se recupere automáticamente sin necesidad de reiniciar manualmente.

•	¿Qué pasa si el servicio vuelve a fallar?

El estado “Half-Open” es una fase en la que, tras mantener el circuito bloqueado por fallos, se permite un número limitado de llamadas de prueba. Este estado se activa después de un tiempo de espera para darle margen al servicio de recuperarse. Si la llamada en este estado tiene éxito, el circuito se cierra y el sistema vuelve a su funcionamiento normal. Sin embargo, si la prueba falla, el circuito se abre nuevamente de inmediato, bloqueando las peticiones a ese servicio para proteger el sistema. El proceso se repite después de otro período de espera, manteniendo la estabilidad general.












