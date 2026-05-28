from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print("\n[MONITOREO] Health check ejecutado en pedidos", flush=True)

    return jsonify({
        "servicio": "pedidos",
        "estado": "activo"
    }), 200


@app.route("/pedidos")
def pedidos():

    inicio = time.time()

    print("\n[MONITOREO] Consultando pedidos", flush=True)

    datos = [
        {"id": 1, "producto": "Laptop"},
        {"id": 2, "producto": "Mouse"}
    ]

    fin = time.time()

    tiempo = fin - inicio

    print(f"[MONITOREO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
    print("[MONITOREO] Servicio pedidos disponible", flush=True)

    return jsonify(datos)

app.run(host="0.0.0.0", port=5000)