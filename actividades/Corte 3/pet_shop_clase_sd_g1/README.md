# Laboratorio: Implementación del Patrón Circuit Breaker
**Asignatura:** Sistemas Distribuidos  
**Objetivo:** Gestión de fallos y resiliencia mediante estados de circuito.

---


## FASE 1: Inicio del Sistema y Detección de Fallos

Se inició el sistema verificando que funciona correctamente. Al solicitar información del servicio de mascotas, se obtienen los registros exitosamente. Los logs muestran que la solicitud pasa por el `gateway-1`, este delega al `backend-1` y entrega la respuesta al usuario.
#### imagen 1
<img width="972" height="227" alt="image" src="https://github.com/user-attachments/assets/1af98b58-1681-41a7-ad9d-c690ff5bcd69" />

<img width="879" height="205" alt="image" src="https://github.com/user-attachments/assets/b19c3bde-b3e6-47df-b179-2fa9a0198fa0" />

<img width="905" height="194" alt="image" src="https://github.com/user-attachments/assets/daf9822b-0cb5-418f-919e-bbefb2b3bd57" />


### Simulación de Caída
Se procedió a apagar el servicio de mascotas con el comando:
`docker stop pet_shop_clase_sd_g1-backend-1`Como resultado, la información deja de estar disponible.

#### imagen
<img width="738" height="441" alt="image" src="https://github.com/user-attachments/assets/8287597f-01f3-4b54-b17e-0e28ef8ff8d8" />


Al realizar 3 intentos fallidos, el Gateway detecta la pérdida de conectividad y bloquea las solicitudes enviando un estado **503**.

<img width="737" height="482" alt="image" src="https://github.com/user-attachments/assets/09f1cb3b-b0ce-4760-904b-d7516d0536ac" />

---

## FASE 2: Aislamiento de Fallos

Se implementó una lógica de contadores independientes para evitar que la caída de un servicio afecte a otros (ej. si falla mascotas, que usuarios siga funcionando).

<img width="885" height="431" alt="image" src="https://github.com/user-attachments/assets/cf190fc0-d14d-4d71-a10a-a8c60d5c23f7" />


**Degradación:** Se observa que, aunque un servicio esté caído, los demás endpoints responden correctamente.

<img width="897" height="494" alt="image" src="https://github.com/user-attachments/assets/cffc19ba-72df-49ef-98ab-bcc0974d71c8" />

---

## FASE 3 y 4: Lógica de Recuperación (Half-Open)

Se incorporó el estado **Half-Open** con un temporizador de **20 segundos**. 

1. **Estado Abierto:** Durante 20 segundos el sistema rechaza todo para proteger el backend.
2. **Estado Half-Open:** Pasado el tiempo, se permite una "petición de prueba" o sonda.
3. **Decisión:** Si la sonda tiene éxito, el circuito se cierra. Si falla, vuelve a abrirse.

<img width="893" height="313" alt="image" src="https://github.com/user-attachments/assets/5d4d5e53-50fc-40e4-a1ff-dc2d42ab7355" />


### Implementación del Código
Se utiliza una comparación de tiempos para determinar si se debe permitir el reintento.

<img width="842" height="411" alt="image" src="https://github.com/user-attachments/assets/5eb4be53-bb27-4c02-9729-e42357787016" />


---

## FASE 5: Pruebas y Recuperación del Sistema

### Escenario: Servicio Funcionando
Verificación de peticiones respondidas correctamente con el circuito cerrado.

<img width="533" height="382" alt="image" src="https://github.com/user-attachments/assets/efdca54c-890e-4411-8963-c1e5a3bf28bd" />


### Escenario: Caída del Servicio de Usuarios
Se detiene manualmente el servicio de usuarios para observar el cambio de estado en los logs.

<img width="501" height="232" alt="image" src="https://github.com/user-attachments/assets/b5b2a6e9-1bb0-4b8a-8123-070e91b3615a" />


### Recuperación Final
Se restaura el servicio manualmente y se observa cómo el Gateway, tras esperar los 20 segundos de seguridad, realiza la verificación y cierra el circuito automáticamente.

<img width="599" height="253" alt="image" src="https://github.com/user-attachments/assets/af535ae7-8f73-49cf-b9db-da770fcdc328" />


---

## Conclusiones del Laboratorio

1. **Gestión de Recursos:** El Circuit Breaker evita el consumo innecesario de recursos al no intentar conectar con servicios que se sabe que están caídos.
2. **Resiliencia:** El sistema es capaz de recuperarse por sí solo una vez que los servicios vuelven a estar saludables, sin necesidad de reiniciar el Gateway.
3. **Aislamiento:** La implementación de contadores por servicio garantiza que un error en una funcionalidad no provoque una caída total del sistema distribuido.
