# Sistema de Pedidos Distribuido

## Integrantes

- Brayan David Solis Mosquera
- Victor Gilon Pino

---

# Descripción

Se desarrolló un sistema distribuido basado en microservicios para gestionar:

- pedidos
- inventario
- pagos

El sistema implementa monitoreo básico utilizando logs, health checks y métricas de disponibilidad.

---

# Arquitectura

El sistema está compuesto por 4 servicios:

```text
Cliente
   |
Gateway
   |
--------------------------------
|              |              |
Pedidos     Inventario      Pagos
```

## Servicios

### Gateway

Encargado de:

- centralizar peticiones
- monitorear servicios
- validar disponibilidad
- detectar fallos

---

### Pedidos

Gestiona la información de pedidos del sistema.

Endpoint principal:

```text
/pedidos
```

---

### Inventario

Gestiona el stock de productos.

Endpoint principal:

```text
/inventario
```

---

### Pagos

Procesa pagos del sistema.

Este servicio simula lentitud y fallos para probar el monitoreo.

Endpoint principal:

```text
/pagos
```

---

# Tecnologías utilizadas

- Python
- Flask
- Docker Compose

---

# Monitoreo implementado

## 1. Logs descriptivos

Cada servicio genera logs personalizados para identificar:

- peticiones realizadas
- estado del servicio
- tiempos de respuesta
- errores
- veces_caido

## Ejemplo

```bash
[MONITOREO] Consultando inventario
[MONITOREO] Tiempo de respuesta: 0.0012 segundos
[MONITOREO] Servicio inventario disponible
[MONITOREO] ver las veces que el sistemas se ha caido
```

---

## 2. Health Checks

Cada microservicio implementa el endpoint:

```text
/health
```

Este endpoint permite validar si el servicio está disponible.

## Ejemplo de respuesta

```json
{
  "servicio": "pagos",
  "estado": "activo"
}
```

---

## 3. Monitoreo centralizado

El gateway consulta automáticamente todos los servicios.

Endpoint:

```text
/estado
```

El gateway:

- verifica disponibilidad
- mide tiempo de respuesta
- detecta fallos
- registra errores
- veces_caido

---

## 4. Métricas implementadas

### Tiempo de respuesta

Se mide utilizando:

```python
inicio = time.time()
fin = time.time()
```

### Cantidad de errores

Cuando un servicio falla, el gateway registra el error automáticamente.

---

# Simulación de fallos

Se apagó el servicio de pagos utilizando Docker.

## Comando utilizado

```bash
docker stop actividad_en_clase-pagos-1
```

---

# Resultados observados

## Funcionamiento normal

Cuando todos los servicios estaban activos:

- el gateway detectó disponibilidad correcta
- los endpoints respondieron con código HTTP 200
- los tiempos de respuesta fueron registrados

## Ejemplo

```bash
[MONITOREO] Verificando servicio: pedidos
[MONITOREO] Servicio disponible: pedidos
[MONITOREO] Tiempo de respuesta: 0.0021 segundos
[MONITOREO] ver las veces que el sistemas se ha caido
```

---

## Servicio de pagos caído

Al apagar el servicio de pagos:

- el gateway detectó el fallo
- se registraron errores
- pedidos e inventario siguieron funcionando

## Logs observados

```bash
[MONITOREO] Verificando servicio: pagos
[MONITOREO] Servicio caido: pagos
```

---

# Conclusiones

Se implementó un sistema básico de monitoreo en una arquitectura distribuida utilizando:

- logs
- health checks
- métricas
- monitoreo centralizado

El sistema permitió:

- detectar servicios caídos
- medir tiempos de respuesta
- analizar errores
- observar disponibilidad de microservicios

Esto mejora la observabilidad y resiliencia del sistema distribuido.