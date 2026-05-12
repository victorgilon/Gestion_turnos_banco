import time
import requests
from flask import Flask, jsonify

app = Flask(__name__)

class CircuitBreaker:
    def __init__(self, name, url, timeout=4, fallos_máximos=3, tiempo_recuperación=10):
        self.name = name
        self.url = url
        self.timeout = timeout
        self.fallos_máximos = fallos_máximos
        self.tiempo_recuperación = tiempo_recuperación
        
        # Estado interno
        self.fallos = 0
        self.circuito_abierto = False
        self.ultimo_fallo = 0

    #metodo
    def call(self):
        tiempo_actual = time.time()

        # Lógica de Reintento (Half-Open)
        if self.circuito_abierto:
            if tiempo_actual - self.ultimo_fallo > self.tiempo_recuperación:
                print(f"[{self.name}] Estado Half-Open: Intentando reconexión...", flush=True)
            else:
                print(f"[{self.name}] Circuito abierto. Bloqueando petición.", flush=True)
                return {"error": f"Servicio {self.name} temporalmente bloqueado"}, 503

        try:
            response = requests.get(self.url, timeout=self.timeout)
            response.raise_for_status() # Lanza excepción si hay error 4xx o 5xx
            
            # Éxito: Reiniciar estado
            self.circuito_abierto = False
            self.fallos = 0
            return response.json(), 200

        except Exception as e:
            self.fallos += 1
            self.ultimo_fallo = time.time()
            print(f"[{self.name}] Fallo número {self.fallos}: {e}", flush=True)

            if self.fallos >= self.fallos_máximos:
                self.circuito_abierto = True
                print(f"[{self.name}] !!! CIRCUITO ABIERTO !!!", flush=True)

            return {"error": f"Servicio {self.name} no disponible"}, 503

# Instanciamos los breakers para cada servicio
breaker_mascotas = CircuitBreaker("Mascotas", "http://backend:5000/mascotas", timeout=4)
breaker_usuarios = CircuitBreaker("Usuarios", "http://usuarios:5000/usuarios", timeout=2)

@app.route("/mascotas")
def mascotas():
    data, status = breaker_mascotas.call()
    return jsonify(data), status

@app.route("/usuarios")
def usuarios():
    data, status = breaker_usuarios.call()
    return jsonify(data), status

@app.route("/resumen")
def resumen():
    # El resumen depende de ambos, podemos consultar el estado de los breakers directamente
    if breaker_mascotas.circuito_abierto or breaker_usuarios.circuito_abierto:
        return jsonify({
            "error": "Resumen no disponible",
            "estados": {
                "usuarios": "Abierto" if breaker_usuarios.circuito_abierto else "Cerrado",
                "mascotas": "Abierto" if breaker_mascotas.circuito_abierto else "Cerrado"
            }
        }), 503

    # Si ambos están cerrados, intentamos obtener la data
    usuarios_data, usuarios_status = breaker_usuarios.call()
    mascotas_data, mascotas_status = breaker_mascotas.call()

    if usuarios_status == 200 and mascotas_status == 200:
        return jsonify({
            "usuarios": usuarios_data,
            "mascotas": mascotas_data.get("mascotas", [])
        })
    
    return jsonify({"error": "Error parcial en servicios dependientes"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)