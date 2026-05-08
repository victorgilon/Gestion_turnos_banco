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

![Imagen 8](img/image_8.png)
![Imagen 9](img/image_9.png)

**Degradación Graciosa:** Se observa que, aunque un servicio esté caído, los demás endpoints responden correctamente.

![Imagen 10](img/image_10.png)
![Imagen 11](img/image_11.png)

---

## FASE 3 y 4: Lógica de Recuperación (Half-Open)

Se incorporó el estado **Half-Open** con un temporizador de **20 segundos**. 

1. **Estado Abierto:** Durante 20 segundos el sistema rechaza todo para proteger el backend.
2. **Estado Half-Open:** Pasado el tiempo, se permite una "petición de prueba" o sonda.
3. **Decisión:** Si la sonda tiene éxito, el circuito se cierra. Si falla, vuelve a abrirse.

![Imagen 12](img/image_12.png)
![Imagen 13](img/image_13.png)
![Imagen 14](img/image_14.png)
![Imagen 15](img/image_15.png)

### Implementación del Código
Se utiliza una comparación de tiempos para determinar si se debe permitir el reintento.

![Imagen 16](img/image_16.png)
![Imagen 17](img/image_17.png)
![Imagen 18](img/image_18.png)
![Imagen 19](img/image_19.png)

---

## FASE 5: Pruebas de Estrés y Recuperación del Sistema

### Escenario: Servicio Funcionando
Verificación de peticiones respondidas correctamente con el circuito cerrado.

![Imagen 20](img/image_20.png)
![Imagen 21](img/image_21.png)
![Imagen 22](img/image_22.png)

### Escenario: Transición de Estados
Simulación de errores para forzar la apertura y posterior cierre tras la recuperación.

![Imagen 23](img/image_23.png)
![Imagen 24](img/image_24.png)
![Imagen 25](img/image_25.png)
![Imagen 26](img/image_26.png)
![Imagen 27](img/image_27.png)
![Imagen 28](img/image_28.png)
![Imagen 29](img/image_29.png)

### Escenario: Caída del Servicio de Usuarios
Se detiene manualmente el servicio de usuarios para observar el cambio de estado en los logs.

![Imagen 30](img/image_30.png)
![Imagen 31](img/image_31.png)
![Imagen 32](img/image_32.png)

### Recuperación Final
Se restaura el servicio manualmente y se observa cómo el Gateway, tras esperar los 20 segundos de seguridad, realiza la verificación y cierra el circuito automáticamente.

![Imagen 33](img/image_33.png)
![Imagen 34](img/image_34.png)
![Imagen 35](img/image_35.png)

---

## Conclusiones del Laboratorio

1. **Gestión de Recursos:** El Circuit Breaker evita el consumo innecesario de recursos al no intentar conectar con servicios que se sabe que están caídos.
2. **Resiliencia:** El sistema es capaz de recuperarse por sí solo una vez que los servicios vuelven a estar saludables, sin necesidad de reiniciar el Gateway.
3. **Aislamiento:** La implementación de contadores por servicio garantiza que un error en una funcionalidad no provoque una caída total del sistema distribuido.
