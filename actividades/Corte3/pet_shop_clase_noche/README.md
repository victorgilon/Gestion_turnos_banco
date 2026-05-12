# Fase 1 – Observar y Analizar

## ¿Qué hace el sistema actualmente?

El sistema realiza peticiones a los microservicios internos a través del gateway.

Cuando un servicio falla (por ejemplo, porque está caído o no responde), el gateway captura la excepción, incrementa un contador de fallos y retorna un código de error **503 (Servicio no disponible)**.

---

## ¿Se protege o insiste?

El sistema inicialmente intenta realizar las peticiones, pero luego **se protege**.

Cuando el número de fallos consecutivos alcanza o supera el límite definido (3 fallos), el sistema activa el **Circuit Breaker**, cambiando su estado a abierto (`circuito_abierto = True`) y deja de realizar nuevas solicitudes al servicio afectado, evitando así la sobrecarga del sistema.

---

# Fase 2 - Preguntas de Análisis y Decisiones

## ¿Cada servicio debe tener su propio contador de fallos?

Sí. Cada servicio debe tener su propio contador de fallos porque cada microservicio puede comportarse de manera diferente. Por ejemplo, el servicio de mascotas puede fallar mientras el de usuarios sigue funcionando correctamente. Por eso se manejan variables separadas como:

```python
fallos_mascotas
fallos_usuarios
```

---

## ¿El circuito debe abrirse de forma independiente por servicio?

Sí. El circuito debe abrirse de forma independiente por servicio. Esto permite aislar los errores y evitar que un fallo en un microservicio afecte a todos los demás.

Por ejemplo:

```python
circuito_abierto_mascotas = True
```

Esto no debería bloquear automáticamente el servicio de usuarios.

---

## ¿Qué pasa si falla un servicio pero el otro sigue funcionando?

El sistema puede continuar funcionando de forma parcial.

Si uno de los microservicios falla, el endpoint /resumen devuelve la información del servicio que sigue disponible y muestra cuál servicio se encuentra bloqueado o no disponible.

```json
{
    "data": {
        "usuarios": [
            {
                "id": 1,
                "nombre": "Juan"
            }
        ]
    },
    "errores": {
        "mascotas": "Bloqueado"
    }
}
```

Esto ayuda a que el sistema sea más tolerante a fallos y permite detectar exactamente qué microservicio presenta problemas.

---

# Fase 3 – Investigar (Half-Open)

## ¿Qué significa “half-open”?

El estado **Half-Open** es una fase intermedia del patrón Circuit Breaker.

Cuando el circuito se abre debido a varios fallos consecutivos, el sistema deja de enviar peticiones al servicio para evitar más errores y sobrecarga.

Después de un tiempo de espera, el Circuit Breaker cambia al estado **Half-Open** para comprobar si el servicio ya volvió a funcionar.

En este estado:

- Se permite realizar una nueva petición de prueba.
- El sistema verifica si el microservicio responde correctamente.
- Dependiendo del resultado, el circuito puede cerrarse o abrirse nuevamente.

---

## ¿Cuándo se vuelve a intentar una llamada?

La llamada se vuelve a intentar después de que pasa un tiempo de bloqueo configurado por el desarrollador.

Por ejemplo:

```python
tiempo_bloqueo_usuarios = 10
```

Esto significa que el circuito permanecerá abierto durante 10 segundos.

Después de ese tiempo:

1. El sistema permite una petición de prueba.
2. El circuito entra en estado **Half-Open**.
3. Se verifica si el servicio responde correctamente.

Ejemplo:

```python
if time.time() - ultimo_fallo_usuarios > tiempo_bloqueo_usuarios:
```

---

## ¿Qué pasa si el servicio vuelve a fallar?

Si durante el estado **Half-Open** el servicio vuelve a fallar:

- El circuito se abre nuevamente.
- Se bloquean otra vez las peticiones.
- Se reinicia el tiempo de espera antes de volver a intentar.

Ejemplo:

```python
circuito_abierto_usuarios = True
```

Esto evita seguir enviando solicitudes a un servicio que todavía presenta errores o lentitud.

---

# 3. Análisis Final

## ¿Qué cambió en el comportamiento del sistema?

El sistema pasó de ser una arquitectura básica con fallos simples a un sistema más tolerante a errores usando el patrón Circuit Breaker.

Ahora:

- Los servicios no fallan directamente al usuario cuando un microservicio está caído o lento.
- El sistema detecta fallos consecutivos y abre el circuito automáticamente.
- Se bloquean las peticiones hacia servicios inestables.
- Se implementa un estado de recuperación (Half-Open) para validar si el servicio ya se restauró.
- Si el servicio vuelve a funcionar, el sistema se recupera automáticamente cerrando el circuito.

Esto hace que el sistema sea más estable, resiliente y eficiente.

---

## ¿Qué decisiones tomaron en la implementación?

Durante el desarrollo se tomaron las siguientes decisiones:

- Cada microservicio tiene su propio Circuit Breaker independiente.
    - `usuarios`
    - `mascotas`

- Se definió un límite de fallos antes de abrir el circuito (3 intentos).
- Se implementó un tiempo de espera antes de intentar la reconexión (`tiempo_bloqueo`).
- Se utilizó el estado Half-Open para validar la recuperación del servicio.
- Se usaron timeouts en las peticiones HTTP para evitar bloqueos del sistema.
- Se decidió manejar errores con `try/except` para evitar caídas del gateway.

---

## ¿Qué dificultades encontraron?

Durante la implementación se presentaron varias dificultades:

- **Timeouts frecuentes** debido a simulación de lentitud en los servicios.
- Dificultad para entender el estado Half-Open y su transición entre Open y Closed.
- Problemas de sincronización entre microservicios en Docker.
- Errores de conexión cuando un servicio aún estaba iniciando.
- Confusión inicial entre el Circuit Breaker del gateway y el comportamiento de los microservicios.

Estas dificultades ayudaron a comprender mejor el comportamiento real de sistemas distribuidos y la importancia de la tolerancia a fallos.
