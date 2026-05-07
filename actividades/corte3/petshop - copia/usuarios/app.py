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
    return "API USUARIOS FUNCIONANDO"

#  CREAR USUARIO
@app.route("/usuarios", methods=["POST"])
def crear_usuario():
    data = request.json

    if not data or "nombre" not in data:
        return {"error": "Datos incompletos"}, 400

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO usuarios (nombre) VALUES (%s)",
        (data["nombre"],)
    )

    connection.commit()
    connection.close()

    return {"mensaje": "Usuario creado"}


#  LISTAR USUARIOS
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM usuarios")
    resultados = cursor.fetchall()

    connection.close()

    usuarios = []
    for u in resultados:
        usuarios.append({
            "id": u[0],
            "nombre": u[1]
        })

    return jsonify(usuarios)


#  LLAMADO POR  ID

@app.route("/usuarios/<int:id>", methods=["GET"])
def obtener_usuario(id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
    resultado = cursor.fetchone()

    connection.close()

    if resultado is None:
        return {"mensaje": "Usuario no encontrado"}, 404

    usuario = {
        "id": resultado[0],
        "nombre": resultado[1]
    }

    return jsonify(usuario)






if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)