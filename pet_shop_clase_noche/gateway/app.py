from flask import Flask, jsonify
import requests
import time

app = Flask(__name__)

# ESTADOS POR SERVICIO

servicios = {

    "mascotas": {
        "fallos": 0,
        "estado": "CLOSED",
        "ultimo_fallo": 0
    },

    "usuarios": {
        "fallos": 0,
        "estado": "CLOSED",
        "ultimo_fallo": 0
    },

    "relacion": {
        "fallos": 0,
        "estado": "CLOSED",
        "ultimo_fallo": 0
    }
}

# cantidad máxima de fallos
MAX_FALLOS = 3

# tiempo de espera para recuperación
RECOVERY_TIME = 10


# FUNCIÓN GENÉRICA

def llamar_servicio(nombre, url):

    servicio = servicios[nombre]

    # ESTADO OPEN

    if servicio["estado"] == "OPEN":

        tiempo_actual = time.time()

        # HALF_OPEN
        if tiempo_actual - servicio["ultimo_fallo"] >= RECOVERY_TIME:

            servicio["estado"] = "HALF_OPEN"

            print(
                f"[{nombre}] HALF_OPEN - reintentando conexión",
                flush=True
            )

        else:

            print(
                f"[{nombre}] Circuito OPEN - acceso bloqueado",
                flush=True
            )

            return jsonify({
                "error": f"Servicio {nombre} temporalmente bloqueado"
            }), 503

    # LLAMADA AL SERVICIO

    try:

        print(f"[GATEWAY] llamando a {nombre}...", flush=True)

        response = requests.get(url, timeout=2)

        data = response.json()

        # backend respondió mal
        if response.status_code != 200:

            raise Exception("Backend respondió mal")

        # SERVICIO RECUPERADO

        servicio["fallos"] = 0
        servicio["estado"] = "CLOSED"

        print(
            f"[{nombre}] Estado CLOSED - servicio funcionando",
            flush=True
        )

        return jsonify(data)

    # ERROR DE CONEXIÓN

    except requests.exceptions.ConnectionError:

        servicio["fallos"] += 1

        print(
            f"[{nombre}] Error de conexión - fallo #{servicio['fallos']}",
            flush=True
        )

    # TIMEOUT

    except requests.exceptions.Timeout:

        servicio["fallos"] += 1

        print(
            f"[{nombre}] Timeout - fallo #{servicio['fallos']}",
            flush=True
        )

    # OTROS ERRORES

    except Exception as e:

        servicio["fallos"] += 1

        print(
            f"[{nombre}] Error: {str(e)} - fallo #{servicio['fallos']}",
            flush=True
        )

    # ABRIR CIRCUITO

    if servicio["fallos"] >= MAX_FALLOS:

        servicio["estado"] = "OPEN"
        servicio["ultimo_fallo"] = time.time()

        print(
            f"[{nombre}] Estado OPEN - demasiados fallos",
            flush=True
        )

    return jsonify({
        "error": f"Servicio {nombre} no disponible"
    }), 503


# ENDPOINTS

@app.route("/mascotas")
def mascotas():

    return llamar_servicio(
        "mascotas",
        "http://backend:5000/mascotas"
    )


@app.route("/usuarios")
def usuarios():

    return llamar_servicio(
        "usuarios",
        "http://usuarios:5000/usuarios"
    )


@app.route("/relacion")
def relacion():

    return llamar_servicio(
        "relacion",
        "http://backend:5000/relacion"
    )


# MAIN

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)