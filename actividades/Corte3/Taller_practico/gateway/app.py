from flask import Flask, jsonify
import requests
import time

app = Flask(__name__)

SERVICIOS = {
    "pedidos": "http://pedidos:5000/health",
    "inventario": "http://inventario:5000/health",
    "pagos": "http://pagos:5000/health"
}

@app.route("/status")
def status():

    resultado = {}

    print("\n========== MONITOREO DEL SISTEMA ==========", flush=True)

    for nombre, url in SERVICIOS.items():

        inicio = time.time()

        try:

            print(f"\n[MONITOREO] Verificando servicio: {nombre}", flush=True)

            respuesta = requests.get(url, timeout=2)

            fin = time.time()

            tiempo = fin - inicio

            print(f"[MONITOREO] Servicio disponible: {nombre}", flush=True)
            print(f"[MONITOREO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
            print(f"[MONITOREO] Codigo HTTP: {respuesta.status_code}", flush=True)

            resultado[nombre] = {
                "estado": "disponible",
                "codigo_http": respuesta.status_code,
                "tiempo_respuesta": f"{tiempo:.4f} segundos"
            }

        except requests.exceptions.RequestException as e:

            print(f"[MONITOREO] Servicio caido: {nombre}", flush=True)
            print(f"[ERROR] {e}", flush=True)

            resultado[nombre] = {
                "estado": "caido"
            }

    print("===========================================\n", flush=True)

    return jsonify(resultado)

app.run(host="0.0.0.0", port=5000)