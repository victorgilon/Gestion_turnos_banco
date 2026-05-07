from flask import Flask, request, jsonify
import requests
import time

app = Flask(__name__)

# --- Configuración ---
UMBRAL = 3
TIEMPO_REINTENTO = 20  # Segundos que el circuito permanece abierto antes de probar

# --- Estados para MASCOTAS ---
fallos_mascotas = 0
circuito_mascotas_abierto = False
tiempo_bloqueo_mascotas = 0

# --- Estados para RELACION ---
fallos_relacion = 0
circuito_relacion_abierto = False
tiempo_bloqueo_relacion = 0

# --- Estados para USUARIOS ---
fallos_usuarios = 0
circuito_usuarios_abierto = False
tiempo_bloqueo_usuarios = 0

@app.route("/mascotas")
def mascotas():
    global fallos_mascotas, circuito_mascotas_abierto, tiempo_bloqueo_mascotas
    ahora = time.time()

    # Lógica de Recuperación (¿Ya pasó el tiempo de espera?)
    if circuito_mascotas_abierto:
        if ahora - tiempo_bloqueo_mascotas > TIEMPO_REINTENTO:
            print(">>> [HALF-OPEN] Probando conexión con Mascotas...", flush=True)
        else:
            return {"error": "Servicio Mascotas bloqueado (Circuit Open)"}, 503

    try:
        response = requests.get("http://backend:5000/mascotas", timeout=2)
        response.raise_for_status() 
        
        # SI FUNCIONA: Cerrar circuito y reiniciar contadores
        if circuito_mascotas_abierto:
            print(">>> [CLOSED] Servicio recuperado. Circuito cerrado.", flush=True)
        
        fallos_mascotas = 0
        circuito_mascotas_abierto = False
        return response.json()

    except:
        # SI FALLA: Volver a abrir o mantener abierto
        fallos_mascotas += 1
        tiempo_bloqueo_mascotas = ahora
        print(f"Fallo Mascotas: {fallos_mascotas}", flush=True)

        if fallos_mascotas >= UMBRAL:
            circuito_mascotas_abierto = True
            print(">>> [OPEN] Circuito de Mascotas abierto.", flush=True)

        return {"error": "Servicio no disponible"}, 503

@app.route("/relacion")
def relacion():
    global fallos_relacion, circuito_relacion_abierto, tiempo_bloqueo_relacion
    ahora = time.time()

    if circuito_relacion_abierto:
        if ahora - tiempo_bloqueo_relacion > TIEMPO_REINTENTO:
            print(">>> [HALF-OPEN] Probando conexión con Relacion...", flush=True)
        else:
            return {"error": "Servicio Relacion bloqueado (Circuit Open)"}, 503

    try:
        response = requests.get("http://backend:5000/relacion", timeout=2)
        response.raise_for_status()
        
        fallos_relacion = 0
        circuito_relacion_abierto = False
        return jsonify(response.json())
    except:
        fallos_relacion += 1
        tiempo_bloqueo_relacion = ahora
        print(f"Fallo Relacion: {fallos_relacion}", flush=True)
        if fallos_relacion >= UMBRAL:
            circuito_relacion_abierto = True
        return {"error": "Servicio relacion no disponible"}, 503

@app.route("/usuarios")
def usuarios():
    global fallos_usuarios, circuito_usuarios_abierto, tiempo_bloqueo_usuarios
    ahora = time.time()

    if circuito_usuarios_abierto:
        if ahora - tiempo_bloqueo_usuarios > TIEMPO_REINTENTO:
            print(">>> [HALF-OPEN] Probando conexión con Usuarios...", flush=True)
        else:
            return {"error": "Servicio Usuarios bloqueado (Circuit Open)"}, 503

    try:
        response = requests.get("http://usuarios:5000/usuarios", timeout=2)
        response.raise_for_status()
        
        fallos_usuarios = 0
        circuito_usuarios_abierto = False
        return jsonify(response.json())
    except:
        fallos_usuarios += 1
        tiempo_bloqueo_usuarios = ahora
        print(f"Fallo Usuarios: {fallos_usuarios}", flush=True)
        if fallos_usuarios >= UMBRAL:
            circuito_usuarios_abierto = True
        return {"error": "Servicio usuarios no disponible"}, 503

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)