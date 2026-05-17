from flask import Flask, jsonify
import requests
import time

app = Flask(__name__)

SERVICIOS = {
    "pedidos": "http://pedidos:5000/health",
    "inventario": "http://inventario:5000/health",
    "pagos": "http://pagos:5000/health"
}

fallos = {
    "pedidos": 0,
    "inventario": 0,
    "pagos": 0
}

metricas = {
    "pedidos":    {"total_llamadas": 0, "errores": 0, "tiempo_total": 0},
    "inventario": {"total_llamadas": 0, "errores": 0, "tiempo_total": 0},
    "pagos":      {"total_llamadas": 0, "errores": 0, "tiempo_total": 0}
}


# ========================== endpoint pedidos ==========================

@app.route("/pedidos")
def pedidos():
    try:
        inicio = time.time()
        print("[GATEWAY] Consultando pedidos...", flush=True)

        response = requests.get("http://pedidos:5000/pedidos", timeout=3)
        tiempo = time.time() - inicio

        metricas["pedidos"]["total_llamadas"] += 1
        metricas["pedidos"]["tiempo_total"] += tiempo

        if response.status_code == 200:
            print(f"[PEDIDOS] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
            return jsonify(response.json())
        else:
            metricas["pedidos"]["errores"] += 1
            return jsonify({"error": f"Servicio retornó {response.status_code}"}), 502

    except requests.exceptions.RequestException as e:
        metricas["pedidos"]["total_llamadas"] += 1
        metricas["pedidos"]["errores"] += 1
        print(f"[ERROR][PEDIDOS] {e}", flush=True)
        return jsonify({"error": "Servicio pedidos no disponible"}), 500


# ========================== endpoint pagos ==========================

@app.route("/pagos")
def pagos():
    try:
        inicio = time.time()
        print("[GATEWAY] Consultando pagos...", flush=True)

        response = requests.get("http://pagos:5000/pagos", timeout=3)
        tiempo = time.time() - inicio

        metricas["pagos"]["total_llamadas"] += 1
        metricas["pagos"]["tiempo_total"] += tiempo

        if response.status_code == 200:
            print(f"[PAGOS] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
            return jsonify(response.json())
        else:
            metricas["pagos"]["errores"] += 1
            return jsonify({"error": f"Servicio retornó {response.status_code}"}), 502

    except requests.exceptions.RequestException as e:
        metricas["pagos"]["total_llamadas"] += 1
        metricas["pagos"]["errores"] += 1
        print(f"[ERROR][PAGOS] {e}", flush=True)
        return jsonify({"error": "Servicio pagos no disponible"}), 500


# ========================== endpoint inventario ==========================

@app.route("/inventario")
def inventario():
    try:
        inicio = time.time()
        print("[GATEWAY] Consultando inventario...", flush=True)

        response = requests.get("http://inventario:5000/inventario", timeout=3)
        tiempo = time.time() - inicio

        metricas["inventario"]["total_llamadas"] += 1
        metricas["inventario"]["tiempo_total"] += tiempo

        if response.status_code == 200:
            print(f"[INVENTARIO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
            return jsonify(response.json())
        else:
            metricas["inventario"]["errores"] += 1
            return jsonify({"error": f"Servicio retornó {response.status_code}"}), 502

    except requests.exceptions.RequestException as e:
        metricas["inventario"]["total_llamadas"] += 1
        metricas["inventario"]["errores"] += 1
        print(f"[ERROR][INVENTARIO] {e}", flush=True)
        return jsonify({"error": "Servicio inventario no disponible"}), 500


# ========================== monitoreo general ==========================

@app.route("/estado")
def estado():
    resultado = {}
    print("\n========== MONITOREO DEL SISTEMA ==========", flush=True)

    for nombre, url in SERVICIOS.items():
        inicio = time.time()
        try:
            print(f"\n[MONITOREO] Verificando servicio: {nombre}", flush=True)
            respuesta = requests.get(url, timeout=2)
            tiempo = time.time() - inicio

            print(f"[MONITOREO] Servicio disponible: {nombre}", flush=True)
            print(f"[MONITOREO] Tiempo de respuesta: {tiempo:.4f} segundos", flush=True)
            print(f"[MONITOREO] Codigo HTTP: {respuesta.status_code}", flush=True)
            print(f"[MONITOREO] Veces caido: {fallos[nombre]}", flush=True)

            resultado[nombre] = {
                "estado": "disponible",
                "codigo_http": respuesta.status_code,
                "tiempo_respuesta": f"{tiempo:.4f} segundos",
                "veces_caido": fallos[nombre]
            }
        except requests.exceptions.RequestException as e:
            fallos[nombre] += 1
            print(f"[MONITOREO] Servicio caido: {nombre}", flush=True)
            print(f"[ERROR] {e}", flush=True)

            resultado[nombre] = {
                "estado": "caido",
                "veces_caido": fallos[nombre]
            }

    print("===========================================\n", flush=True)
    return jsonify(resultado)


# ========================== metricas ==========================

@app.route("/metricas")
def ver_metricas():
    resumen = {}
    for nombre, m in metricas.items():
        llamadas = m["total_llamadas"]
        resumen[nombre] = {
            "total_llamadas": llamadas,
            "errores": m["errores"],
            "tasa_error": f"{(m['errores'] / llamadas * 100):.1f}%" if llamadas > 0 else "N/A",
            "tiempo_promedio": f"{(m['tiempo_total'] / llamadas):.4f}s" if llamadas > 0 else "N/A"
        }
    return jsonify(resumen)


# ========================== health inventario ==========================

@app.route("/estado/inventario")
def estado_inventario():
    try:
        response = requests.get("http://inventario:5000/health", timeout=3)
        return jsonify(response.json())
    except:
        return jsonify({"status": "down"}), 503


# ========================== health pagos ==========================

@app.route("/estado/pagos")
def estado_pagos():
    try:
        response = requests.get("http://pagos:5000/health", timeout=3)
        return jsonify(response.json())
    except:
        return jsonify({"status": "down"}), 503


# ========================== health pedidos ==========================

@app.route("/estado/pedidos")
def estado_pedidos():
    try:
        response = requests.get("http://pedidos:5000/health", timeout=3)
        return jsonify(response.json())
    except:
        return jsonify({"status": "down"}), 503


app.run(host="0.0.0.0", port=5000)