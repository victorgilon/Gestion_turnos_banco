from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print(
        "\n[PAGOS] Verificando estado del servicio",
        flush=True
    )

    return jsonify({
        "servicio": "pagos",
        "estado": "activo"
    }), 200


@app.route("/pagos")
def pagos():

    print(
        "\n[PAGOS] Procesando pago",flush=True
    )
    inicio = time.time()
    # Simular demora del servicio
    time.sleep(5)

    # Calcular tiempo de respuesta
    tiempo_respuesta = time.time() - inicio

    print(
        f"[PAGOS] Tiempo de respuesta: {tiempo_respuesta:.2f} segundos",flush=True
    )

    print(
        "[PAGOS] Servicio disponible ",flush=True
    )

    return jsonify({
        "mensaje": "Pago procesado correctamente",
        "tiempo_respuesta": f"{tiempo_respuesta:.2f} segundos"
    })

app.run(host="0.0.0.0", port=5000)