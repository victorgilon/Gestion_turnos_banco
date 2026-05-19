from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print(
        "\n[PEDIDOS] Verificando estado del servicio", flush=True
    )

    return jsonify({
        "servicio": "pedidos",
        "estado": "activo"
    }), 200



@app.route("/pedidos")
def pedidos():
    inicio = time.time()
    print(
        "\n[PEDIDOS] Consultando pedidos",flush=True
    )
    pedidos_disponibles = [
        {"id": 1, "producto": "iPhone 15"},
        {"id": 2, "producto": "AirPods"}
    ]
    # Simular demora
    time.sleep(2)
    tiempo_respuesta = time.time() - inicio
    print(
        f"[PEDIDOS] Tiempo de respuesta: {tiempo_respuesta:.2f} segundos",flush=True
    )
    print(
        "[PEDIDOS] Servicio disponible ",flush=True
    )
    return jsonify({
        "pedidos": pedidos_disponibles,
        "tiempo_respuesta": f"{tiempo_respuesta:.2f} segundos"
    })

app.run(host="0.0.0.0", port=5000)