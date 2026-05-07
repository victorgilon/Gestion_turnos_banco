from flask import Flask, request, jsonify
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

#==========================================================================================================#

@app.route("/")
def home():
    return "API de Pet Shop funcionando"

#==========================================================================================================#

@app.route("/mascotas", methods=["POST"])
def crear_mascota():
    data = requests.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO mascotas (nombre, tipo) VALUES (%s, %s)",
        (data["nombre"], data["tipo"])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Mascota creada"}), 201

#==========================================================================================================#

@app.route("/mascotas", methods=["GET"]) 
def obtener_mascotas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM mascotas")
    mascotas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(mascotas)

#==========================================================================================================#

@app.route("/relacion")
def relacion():
    usuarios = requests.get("http://127.0.0.1:5001/usuarios").json()
    return{
        "usuarios": usuarios,
        "mensaje": "Datos desde otro servicio"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)