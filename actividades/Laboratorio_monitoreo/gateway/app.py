from flask import Flask, jsonify
import requests
import time

app = Flask(__name__)

SERVICIOS = {
    "pedidos": "http://pedidos:5000/health",
    "inventario": "http://inventario:5000/health",
    "pagos": "http://pagos:5000/health"
}

# Contador de fallos
fallos = {
    "pedidos": 0,
    "inventario": 0,
    "pagos": 0
}   

# ========================== enpoit pedidos ==========================
@app.route("/pedidos")
def pedidos():
    try:
        inicio = time.time()
        print("[GATEWAY] consultando pedidos...", flush=True)
        response = requests.get("http://pedidos:5000/pedidos", timeout=3)

        if response.status_code == 200:

            fin = time.time()

            print(f"Tiempo de respuesta usuarios: {fin -  inicio}", flush=True)

            return jsonify(response.json())
    
    except requests.exceptions.RequestException as e:

        print(f"[ERROR] {e}", flush=True)

        return jsonify({
            "error": "Servicio pedidos no disponible"
        }), 500

# ========================== enpoit pagos ==========================
@app.route("/pagos")
def pagos():
    try:
        inicio = time.time()
        print("[GATEWAY] consultando pagos...", flush=True)
        response = requests.get("http://pagos:5000/pagos", timeout=3)

        if response.status_code == 200:

            fin = time.time()

            print(f"Tiempo de respuesta usuarios: {fin -  inicio}", flush=True)

            return jsonify(response.json())
    
    except requests.exceptions.RequestException as e:

        print(f"[ERROR] {e}", flush=True)

        return jsonify({
            "error": "Servicio pedidos no disponible"
        }), 500

# ========================== enpoit inventario ==========================
@app.route("/inventario")
def inventario():
    try:
        inicio = time.time()
        print("[GATEWAY] consultando pagos...", flush=True)
        response = requests.get("http://inventario:5000/inventario", timeout=3)

        if response.status_code == 200:

            fin = time.time()

            print(f"Tiempo de respuesta usuarios: {fin -  inicio}", flush=True)

            return jsonify(response.json())
    
    except requests.exceptions.RequestException as e:

        print(f"[ERROR] {e}", flush=True)

        return jsonify({
            "error": "Servicio pedidos no disponible"
        }), 500

# ========================== health de todos los servicios ==========================

@app.route("/estado")
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
            print(f"[MONITOREO] Codigo HTTP: {fallos[nombre]}", flush=True)

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
                "estado": "caido"
            }

    print("===========================================\n", flush=True)

    return jsonify(resultado)

# ========================== health de inventario ==========================

@app.route("/estado/inventario")
def estado_inventario():
    try:
        response = requests.get("http://inventario:5000/health", timeout= 3)
        return jsonify(response.json()) 
    except:
        return jsonify({"status": "down"}), 503 
    
# ========================== health de pagos ==========================

@app.route("/estado/pagos")
def estado_pagos():
    try:
        response = requests.get("http://pagos:5000/health", timeout= 3)
        return jsonify(response.json()) 
    except:
        return jsonify({"status": "down"}), 503 
    
# ========================== health de pedidos ==========================

@app.route("/estado/pedidos")
def estado_pedidos():
    try:
        response = requests.get("http://pedidos:5000/health", timeout= 3)
        return jsonify(response.json()) 
    except:
        return jsonify({"status": "down"}), 503 
    


app.run(host="0.0.0.0", port=5000)