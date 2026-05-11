from flask import Flask, request, jsonify
import mysql.connector
import os
import time
import requests

app = Flask(__name__)

# CONEXIÓN MYSQL
def get_connection():

    print("[BACKEND] conectando a MySQL...", flush=True)

    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

# HOME
@app.route("/")
def home():

    print("[BACKEND] API funcionando", flush=True)

    return "API FUNCIONANDO"

# RELACIÓN
@app.route("/relacion")
def relacion():

    print("[RELACION] iniciando consulta...", flush=True)

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT nombre FROM mascotas")
    mascota = cursor.fetchall()
    connection.close()
    print("[RELACION] mascotas obtenidas", flush=True)
    nombre_usuario = "Servicio usuarios no disponible"

    try:

        print("[RELACION] llamando a usuarios...", flush=True)

        usuarios = requests.get(
            "http://usuarios:5000/usuarios",
            timeout=2
        ).json()

        if usuarios:
            nombre_usuario = usuarios[0]["nombre"]
            print("[RELACION] usuarios obtenido correctamente", flush=True)

    except requests.exceptions.RequestException:
        print("[RELACION] servicio usuarios caído", flush=True)
    nombre_mascota = mascota[0][0] if mascota else "Sin mascota"

    return {
        "usuario": nombre_usuario,
        "mascota": nombre_mascota
    }

# CREAR MASCOTA
@app.route("/mascotas", methods=["POST"])
def crear_mascota():

    print("[MASCOTAS] creando mascota...", flush=True)
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO mascotas (nombre, tipo) VALUES (%s, %s)",
        (data["nombre"], data["tipo"])
    )
    connection.commit()
    connection.close()
    print("[MASCOTAS] mascota creada correctamente", flush=True)

    return {
        "mensaje": "Mascota creada"
    }

# OBTENER MASCOTAS

@app.route("/mascotas", methods=["GET"])
def obtener_mascotas():

    print("[MASCOTAS] obteniendo mascotas...", flush=True)

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM mascotas")
    mascotas = cursor.fetchall()
    connection.close()

    print("[MASCOTAS] mascotas enviadas", flush=True)

    return jsonify({
        "mascotas": mascotas
    })

# MAIN

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)