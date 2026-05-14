from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/usuarios")
def usuarios():
    
    print("[USUARIOS] Consultando lista de usuarios", flush=True)

    return jsonify([
        {"id": 1, "nombre": "Ana"},
        {"id": 2, "nombre": "Luis"}
    ])

@app.route("/usuarios/<int:id>")
def usuario(id):

    print(f"[USUARIOS] Buscando usuario con ID: {id}", flush=True)

    data = [
        {"id": 1, "nombre": "Ana"},
        {"id": 2, "nombre": "Luis"}
    ]
    user = next((u for u in data if u["id"] == id), None)

    if user:
        
        print(f"[USUARIOS] Usuario encontrado: {user['nombre']}", flush=True)

        return jsonify(user)
    
    print("[USUARIOS] Usuario no encontrado", flush=True)

    return jsonify({"error": "No encontrado"}), 404

# ========================== health ==========================

@app.route("/health")
def health():

    print("[USUARIOS] Health check OK", flush=True)

    return {
        "status": "ok",
        "service": "usuarios"
        }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)