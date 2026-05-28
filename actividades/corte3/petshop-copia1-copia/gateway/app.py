from flask import Flask, request, jsonify
import requests
import time

app= Flask(__name__)

fallos_backend = 0
circuito_abierto = False
ultimo_fallo = 0

estado_usuarios = {
    "fallos": 0,
    "circuito": False,
    "ultimo_fallo": 0
}

estados = {

    "usuarios": {
        "fallos": 0,
        "circuito": False
    },

    "mascotas": {
        "fallos": 0,
        "circuito": False
    }

}
@app.route("/mascotas")
def mascotas():
   global fallos_backend, circuito_abierto, ultimo_fallo
   if circuito_abierto:
        tiempo_actual = time.time()
        if tiempo_actual - ultimo_fallo > 10:
            print(
                "Intentando recuperar servicio mascotas...",
                flush=True
            )
            circuito_abierto = False
        else:
            return {
                "error": "Servicio temporalmente bloqueado"
            }, 503
   try:
        inicio = time.time()
        print("[GATEWAY]  CONSULTANDO EL SERVICIO DE MASCOTAS 🔭", flush=True)
        response = requests.get("http://backend:5000/mascotas",timeout=2)
        
        fin = time.time()
        print(
        f"[GATEWAY] Tiempo de respuesta: {fin - inicio} segundos",flush=True
    )
        fallos_backend = 0
        
        
        return response.json()
   except:
        fallos_backend += 1
        print(
            f"Fallo número {fallos_backend}",
            flush=True
        )
        if fallos_backend >= 3:
            circuito_abierto = True
            ultimo_fallo = time.time()
            print(
                "Circuito abierto",
                flush=True
            )
        return {
            "error": "Servicio no disponible (BACKEND)"
        }, 503
 

@app.route("/usuarios")
def usuarios():
    if estado_usuarios["circuito"]:
        tiempo_actual = time.time()
        if tiempo_actual - estado_usuarios["ultimo_fallo"] > 10:
            print(
                "Intentando recuperar servicio usuarios...",
                flush=True
            )
            estado_usuarios["circuito"] = False
        else:
            return jsonify({
                "error": "Servicio bloqueado"
            }), 503
    try:
        inicio = time.time()
        print(
            "[GATEWAY] CONSULTANDO EL SERVICIO DE USUARIOS 🔭", flush=True
        )
        response = requests.get( "http://usuarios:5000/usuarios",timeout=2)
        fin = time.time()

        print(
        f"[GATEWAY] Tiempo de respuesta usuarios: {fin - inicio} segundos",flush=True)
        estado_usuarios["fallos"] = 0
        return jsonify(response.json())
    except:
        estado_usuarios["fallos"] += 1
        print(
            f"Fallo usuarios número {estado_usuarios['fallos']}",
            flush=True
        )
        if estado_usuarios["fallos"] >= 3:
            estado_usuarios["circuito"] = True
            estado_usuarios["ultimo_fallo"] = time.time()
            print(
                "Servicio bloqueado",
                flush=True
            )
        return jsonify({
            "error": "Servicio usuarios no disponible"}), 503


##LLAMADO PO ID
@app.route("/mascotas/<int:id>")
def mascota_gateway(id):
    response = requests.get(f"http://backend:5000/mascotas/{id}")

    return (
        response.content,
        response.status_code,
        response.headers.items()
    )


@app.route("/usuarios/<int:id>")
def usuario_gateway(id):
    response = requests.get(f"http://usuarios:5000/usuarios/{id}")

    return (
        response.content,
        response.status_code,
        response.headers.items()
    )

# MOSTRAR ERRO POR FALTA DE INGRESAR ID

@app.route("/mascotas/", methods=["GET"])
def mascotas_sin_id():
    return {"mensaje": "Por favor, ingrese un ID de la mascota"}, 400

@app.route("/usuarios/", methods=["GET"])
def usuarios_sin_id_gateway():
    return {"mensaje": "Por favor, ingrese un ID del usuario"}, 400

@app.route("/resumen")
def resumen():

    respuesta = {}

    try:

        print(
            "[GATEWAY] Consultando usuarios...",
            flush=True
        )

        usuarios_response = requests.get(
            "http://usuarios:5000/usuarios",
            timeout=2
        )

        respuesta["usuarios"] = usuarios_response.json()

    except:

        respuesta["usuarios"] = "Servicio usuarios no disponible"

        print(
            "[GATEWAY] Error en usuarios",
            flush=True
        )

    try:

        print(
            "[GATEWAY] Consultando mascotas...",
            flush=True
        )

        mascotas_response = requests.get(
            "http://backend:5000/mascotas",
            timeout=2
        )

        respuesta["mascotas"] = mascotas_response.json()

    except:

        respuesta["mascotas"] = "Servicio mascotas no disponible"

        print(
            "[GATEWAY] Error en mascotas",
            flush=True
        )

    return jsonify(respuesta)


@app.route("/estado/backend")
def estado_backend():
    try:
        response = requests.get("http://backend:5000/health", timeout=3)
        return jsonify(response.json())
    except:
        return jsonify({"status": "down"}, 503)
    

@app.route("/estado/usuarios")
def estado_usuarios():
    try:
        response = requests.get("http://usuarios:5000/health",timeout=3
        )
        return jsonify(response.json())
    except:
        return jsonify({"status": "down"}), 503


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)