from flask import Flask, request, jsonify
import requests
import time 

app = Flask(__name__)

fallos_backend = 0
circuito_abierto_backend= False

fallos_usuarios = 0
circuito_abierto_usuarios= False

# ========================== enpoint usuarios ==========================

@app.route("/usuarios")
def usuarios():
    global circuito_abierto_usuarios, fallos_usuarios

    if circuito_abierto_usuarios:
        return{"error": "Servicio temporalmente bloqueado"}, 503
    try:
        inicio = time.time()
        print("[GATEWAY] consultando usuarios...", flush=True)
        response = requests.get("http://usuarios:5000/usuarios", timeout=3)

        if response.status_code == 200:
            fallos_usuarios = 0
            fin = time.time()
            print(f"Tiempo de respuesta usuarios: {fin -  inicio}", flush=True)
            return jsonify(response.json())
        
        else:
            fallos_usuarios += 1
            return{"Error": "usuarios con error"}, 503
    except:
        fallos_usuarios += 1
        print(f"Numero de fallos: {fallos_usuarios}", flush=True)
        if fallos_usuarios >= 3:
            circuito_abierto_usuarios = True
            print("Circuit breaker abierto", flush=True)
        
        return {"Error": "Usuarios no disponible"}, 503

# ========================== enpoint mascotas ==========================

@app.route("/mascotas")
def mascotas():

    global circuito_abierto_backend, fallos_backend

    if circuito_abierto_backend:
        return {"error": "Servicio temporalmente bloqueado"}, 503

    try:
        inicio = time.time()
        print("[GATEWAY] consultando mascotas", flush=True)
        response = requests.get("http://backend:5000/mascotas", timeout=3)
        if response.status_code == 200:
            fallos_backend = 0
            fin = time.time()
            print(f"Tiempo respuesta backend: {fin - inicio}", flush=True)
            return jsonify(response.json())
        else:
            fallos_backend += 1
            return {"error": "Backend con error"}, 503
        
    except:
        fallos_backend += 1
        print(f"Numero de fallos: {fallos_backend}", flush=True)
        if fallos_backend >= 3:
            circuito_abierto_backend = True
            print("Circuit breaker abierto", flush=True)

        return {"error": "Backend no disponible"}, 503
    
# ========================== health backend ==========================
    
@app.route("/estado/backend")
def estado_backend():
    try:
        response = requests.get("http://backend:5000/health", timeout= 3)
        return jsonify(response.json()) 
    except:
        return jsonify({"status": "down"}), 503

# ========================== health usuarios ==========================

@app.route("/estado/usuarios")
def estado_usuarios():
    try:
        response = requests.get("http://usuarios:5000/health", timeout= 3)
        return jsonify(response.json()) 
    except:
        return jsonify({"status": "down"}), 503 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)