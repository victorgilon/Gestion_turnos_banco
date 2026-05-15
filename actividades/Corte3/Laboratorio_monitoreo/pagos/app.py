from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/health")
def health():

    print("\n[MONITOREO] Health check ejecutado en pagos", flush=True)

    return jsonify({
        "servicio": "pagos",
        "estado": "activo"
    }), 200


@app.route("/pagos")
def pagos():

    print("\n[MONITOREO] Procesando pago...", flush=True)

    inicio = time.time()

    # Simulación de lentitud del servicio
    time.sleep(3)

    fin = time.time()

    tiempo = fin - inicio

    print(f"[MONITOREO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
    print("[MONITOREO] Servicio pagos disponible", flush=True)

    return jsonify({
        "mensaje": "Pago procesado",
        "tiempo_respuesta": f"{tiempo:.4f} segundos"
    })

app.run(host="0.0.0.0", port=5000)