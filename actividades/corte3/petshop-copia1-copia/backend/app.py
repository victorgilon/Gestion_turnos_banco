from flask import Flask, jsonify, request
import mysql.connector
import os
import requests

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.route("/")
def home():
    return "API MASCOTAS FUNCIONANDO"


#  CREAR MASCOTA
@app.route("/mascotas", methods=["POST"])
def crear_mascota():
    data = request.json

    if not data or "nombre" not in data or "tipo" not in data:
        return {"error": "Datos incompletos"}, 400

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO mascotas (nombre, tipo) VALUES (%s, %s)",
        (data["nombre"], data["tipo"])
    )
    connection.commit()
    connection.close()
    return {"mensaje": "Mascota creada"}


#  LISTAR MASCOTAS
@app.route("/mascotas", methods=["GET"])
def listar_mascotas():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM mascotas")
    resultados = cursor.fetchall()

    connection.close()
    
    mascotas = []
    for m in resultados:
        mascotas.append({
            "id": m[0],
            "nombre": m[1],
            "tipo": m[2]
        })
    print("[MASCOTAS] BACKEND -> EXTRAYENDO INFORMACION DE MASCOTAS 🔭" , flush=True)
    return jsonify(mascotas)


#  RELACION (CONSUME USUARIOS)
@app.route("/relacion")
def relacion():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT nombre FROM mascotas")
    mascota = cursor.fetchall()

    connection.close()

    try:
        usuarios = requests.get("http://usuarios:5000/usuarios").json()
    except:
        usuarios = []

    nombre_usuario = usuarios[0]["nombre"] if usuarios else "Sin usuario"
    nombre_mascota = mascota[0][0] if mascota else "Sin mascota"

    return {
        "usuario": nombre_usuario,
        "mascota": nombre_mascota
    }


#  RELACION POR ID
@app.route("/relacion/<int:id_usuario>")
def relacion_id(id_usuario):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT nombre FROM mascotas")
    mascota = cursor.fetchall()

    connection.close()

    try:
        usuario = requests.get(f"http://usuarios:5000/usuarios/{id_usuario}").json()
    except:
        return {"error": "Usuario no disponible"}, 500

    return {
        "usuario": usuario.get("nombre", "Sin nombre"),
        "mascota": mascota[0][0] if mascota else "Sin mascota"
    }
## LLAMADO POR ID
@app.route("/mascotas/<int:id>", methods=["GET"])
def obtener_mascota(id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM mascotas WHERE id = %s", (id,))
    resultado = cursor.fetchone()

    connection.close()

    if resultado is None:
        return {"mensaje": "Mascota no encontrada"}, 404

    mascota = {
        "id": resultado[0],
        "nombre": resultado[1],
        "tipo": resultado[2]
    }

    return jsonify(mascota)

@app.route("/health")
def health():
    return {
        "status": "ok",
        "service": "backend"
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)