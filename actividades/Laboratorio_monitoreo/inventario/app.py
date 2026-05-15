from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print("\n[MONITOREO] Health check ejecutado en inventario", flush=True)

    return jsonify({
        "servicio": "inventario",
        "estado": "activo"
    }), 200


@app.route("/inventario")
def inventario():

    print("\n[MONITOREO] Consultando inventario", flush=True)

    inicio = time.time()

    datos = [
        {"producto": "Laptop", "stock": 5},
        {"producto": "Mouse", "stock": 20}
    ]

    fin = time.time()

    tiempo = fin - inicio

    print(f"[MONITOREO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
    print("[MONITOREO] Servicio inventario disponible", flush=True)

    return jsonify({
        "inventario": datos,
        "tiempo_respuesta": f"{tiempo:.4f} segundos"
    })

app.run(host="0.0.0.0", port=5000)