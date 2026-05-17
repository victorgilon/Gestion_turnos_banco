from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print(
        "\n[INVENTARIO] Verificando estado del servicio",
        flush=True
    )

    return jsonify({
        "servicio": "inventario",
        "estado": "activo"
    }), 200


@app.route("/inventario")
def inventario():

    print(
        "\n[INVENTARIO] Consultando productos",flush=True
    )
    inicio = time.time()
    productos = [
        {"producto": "iPhone 15", "stock": 8},
        {"producto": "Cargador Apple", "stock": 12}
    ]

    # Simular demora del servicio
    time.sleep(8)

    # Calcular tiempo de respuesta
    tiempo_respuesta = time.time() - inicio

    print(
        f"[INVENTARIO] Tiempo de respuesta: {tiempo_respuesta:.2f} segundos",flush=True
    )

    print(
        "[INVENTARIO] Servicio disponible ",flush=True
    )

    return jsonify({
        "productos": productos,
        "tiempo_respuesta": f"{tiempo_respuesta:.2f} segundos"
    })

app.run(host="0.0.0.0", port=5000)