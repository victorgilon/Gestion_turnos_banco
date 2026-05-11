from flask import Flask, jsonify
import time

app = Flask(__name__)

@app.route("/usuarios")
def usuarios():

    print("[USUARIOS] petición recibida", flush=True)

    time.sleep(1)

    usuarios_data = [
        {
            "id": 1,
            "nombre": "Juan"
        },
        {
            "id": 2,
            "nombre": "María"
        }
    ]

    print("[USUARIOS] enviando respuesta", flush=True)

    return jsonify(usuarios_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)